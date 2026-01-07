# AN Command Line Interface - Copilot Instructions

## Project Overview
This is a Node.js CLI tool (`@itssali/an-command-line`) that provides an interactive terminal directory browser with fuzzy search, Google search integration, system info, and weather features. The binary is `an` and users invoke commands like `an browse` or `an weather London`.

## Architecture & Key Patterns

### Single File CLI Structure
- **All logic in [index.js](../index.js)**: The entire application is a monolithic 396-line file with command routing, terminal UI, and feature implementations
- **No external modules**: All functionality (browse, weather, search) lives in one file using a switch statement in `handleCommands()`
- **Raw terminal control**: Uses ANSI escape codes directly (`\x1b[2J`, `\x1b[H`) and `process.stdin.setRawMode(true)` for the browse UI

### User Data Management
- **Cross-platform user directory**: Uses OS-specific paths via `getUserDataDir()` - `~/Library/Application Support/an-cli` on macOS, `%APPDATA%/an-cli` on Windows
- **User persistence**: Stores user name in `user.json` in the user data directory, checked on every run

### Terminal UI in Browse Mode
The `browseDirectories()` function creates a full-screen interactive file browser:
- **Stateful display**: Maintains `currentDir`, `selectedIndex`, `searchQuery`, and `filteredFiles` variables in closure
- **Keyboard handling**: Raw mode captures arrow keys (`\u001b[A`), Enter, Escape, backspace, and printable chars for filtering
- **Inline search**: Typing filters files in real-time without modal dialogs - no separate search prompt

## Development Workflow

### Version Management & Publishing
- **Dual publishing**: Package publishes to both npm (unscoped) and GitHub Packages (scoped)
- **Auto version bump**: [scripts/publish.js](../scripts/publish.js) increments patch version and handles both registries
- **Version hardcoded twice**: Update version in both [package.json](../package.json) AND line 33 of [index.js](../index.js)
- **prepublishOnly hook**: Runs [scripts/publish.js](../scripts/publish.js) automatically

### Local Testing
```bash
# Test CLI locally before publishing
npm link
an browse  # Test command
npm unlink  # Clean up
```

### Shell Integration
- [scripts/setup.js](../scripts/setup.js): Modifies `.zshrc`/`.bashrc` to add PATH and define `an-browse()` function for zsh
- [scripts/an-wrapper.sh](../scripts/an-wrapper.sh): Bash wrapper that evaluates `cd` commands output by the CLI
- **Shell function pattern**: The browse feature outputs `cd "path"` which wrapper scripts execute in the parent shell

## Code Conventions

### Imports & Dependencies
- **ESM only**: Uses `"type": "module"` - all imports/exports must use ESM syntax
- **Minimal deps**: Only `chalk`, `inquirer`, `figlet`, `clipboardy`, `node-fetch` - avoid adding more
- **Node stdlib preference**: Use native `fs/promises`, `child_process`, `path`, `os` modules

### Terminal Output Styling
- **Chalk for color**: Use `chalk.cyan()` for info, `chalk.red()` for errors, `chalk.green()` for success, `chalk.yellow()` for warnings
- **Figlet for welcome**: `displayWelcome()` renders ASCII art greeting - only used on bare `an` command

### Command Pattern
Add new commands by:
1. Adding case to `handleCommands()` switch statement
2. Accepting args via `args.slice(1)`
3. Using `console.log()` for output (except browse mode which uses `process.stdout.write()`)

### External API Integration
- **Weather**: Uses `wttr.in` API with `format=j1` for JSON - see `weather` case for pattern
- **Google search**: Uses `spawn('open', [url])` on macOS - spawns system browser

## Critical Gotchas

1. **Browse mode cleanup**: Always call `cleanup()` before exiting browse mode to restore cursor and raw mode
2. **Path handling**: Use `path.join()` for all paths - supports Windows and Unix
3. **Unicode icons**: File/folder icons use emoji (`📂`/`📄`) - work cross-platform unlike ASCII box chars
4. **Update check**: `checkForUpdates()` shells out to `npm show` - can fail if npm registry unavailable
5. **No error boundaries**: Most errors just `console.error()` and continue - add proper error handling for new features

## Testing & Debugging

- **Manual testing only**: No test framework - test by installing locally with `npm link`
- **Terminal size**: Browse mode uses `process.stdout.rows - 5` for pagination - test in different terminal sizes
- **Clipboard testing**: Browse Enter key uses `clipboardy.writeSync()` - verify clipboard integration works
