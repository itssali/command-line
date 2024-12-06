#!/usr/bin/env node

import inquirer from 'inquirer';
import figlet from 'figlet';
import { execSync, spawn } from 'child_process';
import { readdirSync, statSync } from 'fs';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import { dirname } from 'path';
import fs from 'fs';
import chalk from 'chalk';
import clipboardy from 'clipboardy';
import os from 'os';
import fetch from 'node-fetch';

const getUserDataDir = () => {
  const platform = process.platform;
  const home = os.homedir();
  
  switch (platform) {
    case 'win32':
      return path.join(process.env.APPDATA, 'an-cli');
    case 'darwin':
      return path.join(home, 'Library', 'Application Support', 'an-cli');
    default:
      return path.join(home, '.config', 'an-cli');
  }
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const version = '1.1.19';
const userFilePath = path.join(getUserDataDir(), 'user.json');
let currentDir = process.cwd();
let selectedIndex = 0;
let searchQuery = '';
const pageSize = process.stdout.rows - 5;

const displayWelcome = async (name) => {
  console.log(figlet.textSync(`Welcome ${name}`));
};

const saveName = async (newName = null) => {
  const userDir = getUserDataDir();
  try {
    await mkdir(userDir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      console.error('Error creating user directory:', error);
      return null;
    }
  }

  const { name } = newName
    ? { name: newName }
    : await inquirer.prompt([{ type: 'input', name: 'name', message: 'Enter your name:' }]);
  
  await writeFile(userFilePath, JSON.stringify({ name }));
  return name;
};

const checkOrSaveName = async () => {
  try {
    const userData = JSON.parse(await readFile(userFilePath, 'utf-8'));
    return userData.name;
  } catch (error) {
    return await saveName();
  }
};

const checkForUpdates = async () => {
  try {
    const latestVersion = execSync('npm show an-command-line version', { encoding: 'utf8' }).trim();
    if (latestVersion !== version) {
      console.log(`A new version (${latestVersion}) is available!`);
      console.log(`To update, run: npm install -g an-command-line`);
    } else {
      console.log('You are using the latest version.');
    }
  } catch (error) {
    console.error('Could not check for updates:', error.message);
  }
};

const browseDirectories = async () => {
  // ANSI escape codes for cursor and screen manipulation
  const CLEAR_SCREEN = '\x1b[2J\x1b[H';
  const MOVE_TO_TOP = '\x1b[H';
  const CLEAR_TO_BOTTOM = '\x1b[J';
  const HIDE_CURSOR = '\x1b[?25l';
  const SHOW_CURSOR = '\x1b[?25h';

  // Universal Unicode symbols that work in all terminals
  const DIRECTORY_ICON = '📂';  // folder
  const FILE_ICON = '📄';       // file

  const getFileIcon = (filename) => {
    return FILE_ICON;
  };

  const getDirectoryIcon = (dirname) => {
    return DIRECTORY_ICON;
  };

  let files = [];
  try {
    files = readdirSync(currentDir);
  } catch (error) {
    console.error(chalk.red(`Error reading directory: ${error.message}`));
    process.exit(1);
  }
  let filteredFiles = files;

  const displayFiles = () => {
    // Move to top and clear everything below
    process.stdout.write(MOVE_TO_TOP + CLEAR_TO_BOTTOM);

    const lines = [];
    lines.push(chalk.cyan(`Browsing: ${currentDir}`));
    lines.push(chalk.cyan(`Search: ${searchQuery}`));
    lines.push('Use ←→↑↓ to navigate, Enter to copy "cd" command, Esc to exit, type to search\n');
    
    if (filteredFiles.length === 0) {
      if (searchQuery) {
        lines.push(chalk.yellow('No matching files found'));
      } else {
        lines.push(chalk.yellow('Directory is empty'));
      }
    } else {
      const start = Math.max(0, selectedIndex - Math.floor(pageSize / 2));
      const end = Math.min(filteredFiles.length, start + pageSize);

      filteredFiles.slice(start, end).forEach((file, index) => {
        const fullPath = path.join(currentDir, file);
        let isDirectory = false;
        try {
          isDirectory = statSync(fullPath).isDirectory();
        } catch (error) {
          return;
        }
        const icon = isDirectory ? DIRECTORY_ICON : FILE_ICON;
        
        if (start + index === selectedIndex) {
          lines.push(chalk.green(`> ${icon}  ${file}`));
        } else {
          lines.push(`  ${icon}  ${file}`);
        }
      });
    }

    // Output new display
    process.stdout.write(lines.join('\n') + '\n');
  };

  // Initial setup
  process.stdout.write(CLEAR_SCREEN + HIDE_CURSOR);
  displayFiles();

  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding('utf8');

  const cleanup = () => {
    process.stdout.write(SHOW_CURSOR);
    process.stdin.setRawMode(false);
    process.stdin.pause();
  };

  // Handle process termination
  process.on('SIGINT', () => {
    cleanup();
    process.exit();
  });

  process.stdin.on('data', (key) => {
    const keyCode = key.toString();

    // Handle Ctrl+C
    if (keyCode === '\u0003') {
      cleanup();
      process.exit();
    }

    // Handle arrow keys
    if (keyCode === '\u001b[A') { // Up arrow
      if (selectedIndex > 0) {
        selectedIndex--;
        displayFiles();
      }
    } else if (keyCode === '\u001b[B') { // Down arrow
      if (selectedIndex < filteredFiles.length - 1) {
        selectedIndex++;
        displayFiles();
      }
    } else if (keyCode === '\u001b[C') { // Right arrow
      if (filteredFiles.length === 0) return;
      
      const selectedFile = filteredFiles[selectedIndex];
      const selectedPath = path.join(currentDir, selectedFile);
      
      try {
        if (statSync(selectedPath).isDirectory()) {
          currentDir = selectedPath;
          files = readdirSync(currentDir);
          filteredFiles = files;
          searchQuery = '';
          selectedIndex = 0;
          displayFiles();
        } else {
          console.log(chalk.yellow(`\n${selectedFile} is not a directory. Press any key to continue...`));
          process.stdin.once('data', () => displayFiles());
        }
      } catch (error) {
        console.log(chalk.red(`\nError accessing ${selectedFile}: ${error.message}`));
        setTimeout(displayFiles, 2000);
      }
    } else if (keyCode === '\r') { // Enter
      if (filteredFiles.length === 0) return;
      
      const selectedFile = filteredFiles[selectedIndex];
      const selectedPath = path.join(currentDir, selectedFile);
      
      try {
        if (statSync(selectedPath).isDirectory()) {
          const cdCommand = `cd "${selectedPath}"`;
          clipboardy.writeSync(cdCommand);
          cleanup();
          console.clear();
          console.log(chalk.green(`Copied ${cdCommand} to your clipboard.`));
          process.exit(0);
        } else {
          console.log(chalk.yellow(`\n${selectedFile} is not a directory. Press any key to continue...`));
          process.stdin.once('data', () => displayFiles());
        }
      } catch (error) {
        console.log(chalk.red(`\nError accessing ${selectedFile}: ${error.message}`));
        setTimeout(displayFiles, 2000);
      }
    } else if (keyCode === '\u001b[D') { // Left arrow
      if (currentDir !== '/') {
        currentDir = path.dirname(currentDir);
        try {
          files = readdirSync(currentDir);
          filteredFiles = files;
          searchQuery = '';
          selectedIndex = 0;
          displayFiles();
        } catch (error) {
          console.error(chalk.red(`Error reading directory: ${error.message}`));
          setTimeout(() => {
            currentDir = path.join(currentDir, '..');
            displayFiles();
          }, 2000);
        }
      }
    } else if (keyCode === '\u001b') { // Escape
      cleanup();
      console.clear();
      process.exit();
    } else if (keyCode === '\u007f') { // Backspace
      if (searchQuery.length > 0) {
        searchQuery = searchQuery.slice(0, -1);
        filteredFiles = files.filter(file => 
          file.toLowerCase().includes(searchQuery.toLowerCase())
        );
        selectedIndex = 0;
        displayFiles();
      }
    } else if (/^[\x20-\x7E]$/.test(keyCode)) { // Printable characters
      searchQuery += keyCode;
      filteredFiles = files.filter(file => 
        file.toLowerCase().includes(searchQuery.toLowerCase())
      );
      selectedIndex = 0;
      displayFiles();
    }
  });
};

const handleCommands = async () => {
  const args = process.argv.slice(2);
  const command = args[0] || '';
  let name = await checkOrSaveName();

  switch (command) {
    case '':
      displayWelcome(name);
      await checkForUpdates();
      break;
    case '--version':
    case 'version':
      console.log(`Current Version: ${version}`);
      await checkForUpdates();
      break;
    case '--update':
    case 'update':
      console.log('Updating command line...');
      try {
        execSync('npm update an-command-line', { stdio: 'inherit' });
        console.log('Updated to the latest version.');
      } catch (error) {
        console.error('Update failed:', error.message);
        console.log(chalk.yellow('Try running: npm update an-command-line'));
      }
      break;
    case 'browse':
      await browseDirectories();
      break;
    case 'go':
      if (args.length > 1) {
        const searchQuery = args.slice(1).join(' ');
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
        console.log(chalk.blue(`Searching Google for: ${searchQuery}`));
        spawn('open', [searchUrl]);
      } else {
        console.log(chalk.red('Please provide a search query after the "go" command.'));
      }
      break;
    case '--change':
    case 'change':
      if (args[1] === 'name') {
        console.log('Changing your name...');
        name = await saveName();
        displayWelcome(name);
      } else {
        console.log('Unknown command after "change".');
      }
      break;
    case '--help':
    case 'help':
    case '--commands':
    case 'commands':
      console.log(chalk.cyan(`
AN Command Line Interface v${version}

Available commands (all commands can also be used with -- prefix, e.g., --help):

  an version: Show current version and check for updates
  an update: Update to the latest version
  an help: Show this help message
  an commands: Show this help message
  an change name: Change your welcome name
  an browse: Browse directories with fuzzy search
  an go <search terms>: Search Google directly
  an system: Display system information
  an weather <city>: Show weather for specified city

Navigation in browse mode:
  ↑↓ Arrow keys: Navigate through files
  ←  Left arrow: Go to parent directory
  →  Right arrow: Enter directory
  ↵  Enter: Copy cd command to clipboard
  ESC: Exit browse mode
  Type: Filter files (fuzzy search)
`));
      break;
    case 'system':
      console.log(chalk.cyan('System Information:'));
      console.log(`OS: ${os.type()} ${os.release()}`);
      console.log(`Platform: ${os.platform()}`);
      console.log(`CPU Architecture: ${os.arch()}`);
      console.log(`Memory: ${Math.round(os.totalmem() / 1024 / 1024 / 1024)}GB`);
      console.log(`Free Memory: ${Math.round(os.freemem() / 1024 / 1024 / 1024)}GB`);
      console.log(`CPU Cores: ${os.cpus().length}`);
      console.log(`User Home Directory: ${os.homedir()}`);
      console.log(`System Uptime: ${Math.floor(os.uptime() / 3600)} hours`);
      break;

    case 'weather':
      if (!args[1]) {
        console.log(chalk.red('Please provide a city name (e.g., an weather London)'));
        break;
      }
      try {
        const city = args.slice(1).join('+');
        const response = await fetch(`https://wttr.in/${city}?format=j1`);
        const data = await response.json();
        
        const current = data.current_condition[0];
        console.log(chalk.cyan(`Weather in ${data.nearest_area[0].areaName[0].value}, ${data.nearest_area[0].country[0].value}:`));
        console.log(`Temperature: ${current.temp_C}°C (${current.temp_F}°F)`);
        console.log(`Conditions: ${current.weatherDesc[0].value}`);
        console.log(`Humidity: ${current.humidity}%`);
        console.log(`Wind: ${current.windspeedKmph} km/h`);
        console.log(`Feels like: ${current.FeelsLikeC}°C`);
      } catch (error) {
        console.log(chalk.red('City not found or service unavailable. Try again later.'));
      }
      break;
    default:
      console.log(`Unknown command: ${command}`);
  }
};

handleCommands();
