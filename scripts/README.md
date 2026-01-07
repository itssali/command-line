# Scripts Directory

This directory contains setup and utility scripts for the AN CLI tool.

## Files

### `publish.js`
Runs before publishing to npm (via `prepublishOnly` hook). Handles pre-publish checks and setup.

### `setup.js`
Post-install setup script that configures your shell environment for the CLI tool.

### Template Files (*.template)

These are template files that you can copy and customize for local development:

#### `an-wrapper.sh.template`
Template for creating a bash wrapper that can change your shell's directory.

**Usage:**
```bash
cp scripts/an-wrapper.sh.template scripts/an-wrapper.sh
# Edit an-wrapper.sh and update the path to your index.js
```

#### `an-config.sh.template`
Template for shell configuration that adds the `an-browse` function.

**Usage:**
```bash
cp scripts/an-config.sh.template scripts/an-config.sh
# Edit an-config.sh and update the path to your an-wrapper.sh
# Then source it in your shell: source scripts/an-config.sh
```

## Note

The actual `an-wrapper.sh` and `an-config.sh` files are not tracked in git as they contain local file paths. Use the `.template` versions as a starting point.
