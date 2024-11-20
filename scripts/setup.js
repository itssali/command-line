import { mkdir, writeFile, access } from 'fs/promises';
import { constants } from 'fs';
import path from 'path';
import os from 'os';

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

        // Check if PATH entry already exists
        const currentContent = await import('fs').then(fs => 
          fs.readFileSync(shellFile.path, 'utf8')
        );
        
        if (!currentContent.includes(binDir)) {
          await writeFile(shellFile.path, pathEntry, { flag: 'a' });
          modifiedFiles.push(shellFile);
        }
      } catch (error) {
        console.warn(`Warning: Could not modify ${shellFile.shell} configuration:`, error.message);
      }
    }

    if (modifiedFiles.length > 0) {
      console.log('\nSetup complete! Please do one of the following:');
      console.log('1. Restart your terminal');
      console.log('2. Or run the following command:');
      modifiedFiles.forEach(file => {
        console.log(`   source ${file.path}`);
      });
    } else {
      console.log('\nSetup complete! Your PATH is already configured.');
    }
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
};

setup();
