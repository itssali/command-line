import { mkdir, writeFile } from 'fs/promises';
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
    
    // Add bin directory to PATH if not already present
    const profile = platform === 'win32'
      ? path.join(home, '.profile')
      : path.join(home, '.bashrc');

    const pathEntry = `\nexport PATH="$PATH:${binDir}"\n`;
    await writeFile(profile, pathEntry, { flag: 'a' });
    
    console.log('Setup complete! Please restart your terminal or run:');
    console.log(`source ${profile}`);
  } catch (error) {
    console.error('Setup failed:', error);
  }
};

setup();

