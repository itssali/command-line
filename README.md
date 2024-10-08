# AN Command Line

AN Command Line is a custom command line interface that allows you to use a variety of commands easily.

## Installation

To install the AN Command Line tool, follow the appropriate instructions for your operating system:

### macOS and Linux

For macOS and Linux, run the following command in your terminal (works for both Bash and Zsh):

```bash
curl -sSL https://raw.githubusercontent.com/itssali/command-line/main/install.sh | bash
```

This command will download and execute the installation script, which sets up the `an` command globally on your system.

### Windows

For Windows, you can install the AN Command Line tool by running the following command in your Command Prompt:

```cmd
curl -L https://raw.githubusercontent.com/itssali/command-line/main/install.bat -o install.bat && install.bat
```

This command will download and execute the installation script, which sets up the `an` command globally on your system.

### Commands

Once installed, you can use the following commands:

- `an --version` or `an version`: Show the current version of the AN Command Line.
- `an --update` or `an update`: Update the AN Command Line to the latest release.
- `an --help` or `an help`: Display help information about available commands.
- `an --commands` or `an commands`: Show all available commands.

### Example Usage

To perform a Google search, use the following command:

```bash
an go how to make cupcakes
```

This command will open your default web browser and search for "how to make cupcakes" on Google.

## Requirements

- This command line tool does not require any additional software installations like Python.
- It is designed to work seamlessly on macOS, Linux, and Windows.

## License

This project is licensed under the MIT License.