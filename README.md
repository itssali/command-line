## AN Command Line Interface

The **AN Command Line Interface** is a custom command line tool designed to enhance your productivity by providing easy access to various commands and features. With it, you can execute simple tasks, check for updates, and display information efficiently.

### Features

- **Fuzzy Search**: Browse directories using a fuzzy search feature that allows you to filter files by typing part of their names. Use the arrow keys to navigate through the filtered results.
  
- **Directory Navigation**: Easily navigate through your file system. Use the arrow keys to select a directory and press Enter to change into it. The command for changing directories is automatically copied to your clipboard.

- **Google Search**: Use the `go` command followed by your search query to perform a Google search directly from the command line.

- **Version Check**: Check for updates to the AN Command Line Interface with the `--version` command. You'll be notified if a new version is available.

- **Custom Name**: Set and change your welcome name for a personalized experience.

- **System Information**: Get detailed information about your system using the `system` command.
- **Weather Information**: Check the current weather for any city using the `weather` command.

### Prerequisites

Before installing the AN Command Line Interface, make sure you have Node.js and npm installed on your system. Follow these steps to download and install them:

1. **Download Node.js**:
   - Visit the [Node.js official website](https://nodejs.org/).
   - Download the installer for your operating system (Windows, macOS, or Linux).
   - Run the installer and follow the instructions to complete the installation.

2. **Verify npm Installation**:
   - Once Node.js is installed, npm (Node Package Manager) is included automatically.
   - Open your terminal and run the following command to check if npm is installed:

     ```bash
     npm -v
     ```

   - If you see a version number, npm is successfully installed.

### Installation

Install the CLI tool locally without requiring admin privileges:

```bash
npm install an-command-line
```

### Updating

To update the AN Command Line Interface to the latest version, simply run:

```bash
npm update an-command-line
```

### Usage

- **Welcome Message**: When you run the command line interface without any arguments, it will display a welcome message personalized with your name.
  
- **Help Command**: Use `--help` or `--commands` to view available commands and their descriptions.
  
- **Changing Your Name**: Use `--change name` to set a new welcome name.

- **Browsing Directories**: Run the `browse` command to start browsing your file system.

- **Performing Google Searches**: Type `go <your search query>` to search Google directly from the command line.

- **System Information**: Use the `system` command to get detailed information about your system.
- **Weather Information**: Use the `weather` command to check the current weather for any city.

### Example

1. To search for a file named "report":
   ```bash
   an browse
   ```

2. To perform a Google search for "best programming languages":
   ```bash
   an go best programming languages
   ```

The installation will automatically:
1. Create necessary user directories
2. Add the CLI to your PATH
3. Set up user-specific configuration

No sudo or admin privileges required!
