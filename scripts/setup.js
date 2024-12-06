import { mkdir, writeFile, access } from 'fs/promises';
import { constants } from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const setup = async () => {
  const platform = process.platform;
  const home = os.homedir();
  
  // Create user bin directory if it doesn't exist
  const binDir = platform === 'win32'
    ? path.join(home, '.local', 'bin')
    : path.join(home, '.local', 'bin');

  try {
    await mkdir(binDir, { recursive: true });
    
    // Determine shell configuration file
    let shellFiles = [];
    if (platform === 'darwin') { // macOS
      shellFiles = [
        { path: path.join(home, '.zshrc'), shell: 'zsh' },
        { path: path.join(home, '.bashrc'), shell: 'bash' }
      ];
    } else if (platform === 'win32') {
      shellFiles = [{ path: path.join(home, '.profile'), shell: 'profile' }];
    } else { // Linux and others
      shellFiles = [{ path: path.join(home, '.bashrc'), shell: 'bash' }];
    }

    const pathEntry = `\n# Added by an-command-line setup\nexport PATH="$PATH:${binDir}"\n`;
    let modifiedFiles = [];

    for (const shellFile of shellFiles) {
      try {
        // Check if file exists
        try {
          await access(shellFile.path, constants.F_OK);
        } catch {
          // Create the file if it doesn't exist
          await writeFile(shellFile.path, '', { flag: 'a' });
        }

        // Read current content
        const currentContent = await import('fs').then(fs => 
          fs.readFileSync(shellFile.path, 'utf8')
        );
        
        // Check if PATH entry needs to be added
        if (!currentContent.includes(binDir)) {
          await writeFile(shellFile.path, pathEntry, { flag: 'a' });
          modifiedFiles.push(shellFile);
        }

        // For zsh shell, handle the an-browse function
        if (shellFile.shell === 'zsh') {
          const functionDef = `\n# an-browse function definition
an-browse() {
    local output=$(node "${path.join(__dirname, '..', 'index.js')}" "$@")
    if [[ $output == cd* ]]; then
        eval "$output"
    else
        echo "$output"
    fi
}\n`;
          
          // Remove any existing function definitions
          let newContent = currentContent.replace(/\n# an-browse function definition\nan-browse\(\)[\s\S]*?\n}\n/g, '');
          
          // Add the new function definition if it doesn't exist
          if (!newContent.includes('an-browse() {')) {
            newContent = newContent.trim() + '\n' + functionDef;
            await writeFile(shellFile.path, newContent);
            if (!modifiedFiles.includes(shellFile)) {
              modifiedFiles.push(shellFile);
            }
          }
        }
      } catch (error) {
        console.warn(`Warning: Could not modify ${shellFile.shell} configuration:`, error.message);
      }
    }

    if (modifiedFiles.length > 0) {
      console.log('\nSetup complete! Please do one of the following:');
      console.log('1. Restart your terminal');
      console.log('2. Or run the following command:');
      console.log(`   source ${modifiedFiles[0].path}`);
    } else {
      console.log('\nSetup complete! Your PATH is already configured.');
    }
  } catch (error) {
    console.error('Error during setup:', error);
    process.exit(1);
  }
};

setup();
