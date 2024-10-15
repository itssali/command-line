#!/usr/bin/env node

import inquirer from 'inquirer'; // To prompt for user name
import figlet from 'figlet';     // For ASCII art
import { execSync } from 'child_process'; // For shell commands
import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import open from 'open'; // Import the open package
import { exec } from 'child_process'; // Import exec to check latest version

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const version = '1.0.6';
const userFilePath = path.join(__dirname, 'user.json');

// Function to display ASCII art
const displayWelcome = async (name) => {
  console.log(figlet.textSync(`Welcome ${name}`));
};

// Function to check and save user's name
const checkOrSaveName = async () => {
  try {
    const userData = JSON.parse(await readFile(userFilePath, 'utf-8'));
    return userData.name;
  } catch (error) {
    const { name } = await inquirer.prompt([{ type: 'input', name: 'name', message: 'Enter your name:' }]);
    await writeFile(userFilePath, JSON.stringify({ name }));
    return name;
  }
};

// Function to check for the latest version from npm
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

// Handle different commands
const handleCommands = async (command) => {
  const name = await checkOrSaveName();

  switch (command) {
    case '':
      displayWelcome(name);
      await checkForUpdates(); // Check for updates on startup
      break;
    case '--version':
    case 'version':
      console.log(`Current Version: ${version}`);
      await checkForUpdates(); // Check for updates when version is requested
      break;
    case '--update':
    case 'update':
      console.log('Updating command line...');
      try {
        execSync('npm install -g an-command-line', { stdio: 'inherit' });
        console.log('Updated to the latest version.');
      } catch (error) {
        console.error('Update failed:', error.message);
      }
      break;
    case '--help':
    case 'help':
    case '--commands':
    case 'commands':
      console.log(`
Available commands:
  an --version (or an version): Show current version and available updates.
  an --update (or an update): Update to the latest version.
  an --help (or an help): Show available commands.
  an --commands (or an commands): Show all commands.
  an go <text>: Search Google for the specified text.
      `);
      break;
    case 'go':
      const searchQuery = process.argv.slice(3).join(' ');
      if (searchQuery) {
        const url = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
        await open(url); // Open the search URL in the default browser
        console.log(`Searching Google for: ${searchQuery}`);
      } else {
        console.log('Please provide a search query.');
      }
      break;
    default:
      console.log(`Unknown command: ${command}`);
  }
};

// Get the command and process it
const command = process.argv[2] || '';
handleCommands(command);
