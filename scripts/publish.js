import { execSync } from 'child_process';
import { writeFile, unlink, readFile } from 'fs/promises';

const publish = async () => {
  try {
    // Read package.json
    const pkg = JSON.parse(await readFile('package.json', 'utf8'));
    
    // Increment patch version
    const [major, minor, patch] = pkg.version.split('.');
    pkg.version = `${major}.${minor}.${parseInt(patch) + 1}`;
    console.log(`Publishing version ${pkg.version}`);

    // First publish to npm with unscoped name
    console.log('Publishing to npm...');
    pkg.name = 'an-command-line';
    await writeFile('package.json', JSON.stringify(pkg, null, 2));
    execSync('npm publish --access public --ignore-scripts', { stdio: 'inherit' });

    // Then publish to GitHub Packages with scoped name
    console.log('Publishing to GitHub Packages...');
    pkg.name = '@itssali/an-command-line';
    await writeFile('package.json', JSON.stringify(pkg, null, 2));
    
    // Create temporary .npmrc
    await writeFile('.npmrc', 
      '@itssali:registry=https://npm.pkg.github.com/\n' +
      `//npm.pkg.github.com/:_authToken=${process.env.NODE_AUTH_TOKEN}\n` +
      `//npm.pkg.github.com/:always-auth=true\n`
    );

    execSync('npm publish --registry https://npm.pkg.github.com --ignore-scripts', { stdio: 'inherit' });

    // Clean up
    await unlink('.npmrc');
    
    // Restore package.json with scoped name
    await writeFile('package.json', JSON.stringify(pkg, null, 2));
    
    console.log(`Successfully published version ${pkg.version} to both registries!`);
  } catch (error) {
    console.error('Publishing failed:', error);
    process.exit(1);
  }
};

publish();