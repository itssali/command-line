#!/usr/bin/env node

import inquirer from 'inquirer'; // To prompt for user name
import figlet from 'figlet';     // For ASCII art
import { execSync } from 'child_process'; // For shell commands
import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import open from 'open'; // Import the open package

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const version = '1.0.2';
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

// Handle different commands
const handleCommands = async (command) => {
  const name = await checkOrSaveName();

  switch (command) {
    case '':
      displayWelcome(name);
      break;
    case '--version':
    case 'version':
      console.log(`Version: ${version}`);
      break;
      case '--update':
        case 'update':
          console.log('To update the command line tool, please run the following command:');
          console.log('npm install -g an-command-line');
          break;        
    case '--help':
    case 'help':
    case '--commands':
    case 'commands':
      console.log(`
Available commands:
  an --version (or an version): Show version.
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
