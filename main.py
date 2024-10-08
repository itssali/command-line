import subprocess

def showCommands():
    print("Available Commands:")
    print("  version        Show the current version")
    print("  update         Update the command line to the latest release")
    print("  help           Show this help message")
    print("  commands       List all available commands")
    print("  go <query>     Open a Google search for <query>")


def showVersion():
    with open('version.txt', 'r') as f:
        version = f.read()
    print(version)


def updateCLI():
    print("Updating CLI...")
    subprocess.run(['python', '-m', 'pyinstaller', '--onefile', 'main.py'])


def main():
    while True:
        showCommands()
        choice = input("Enter a command: ")
        if choice in ['version', 'update']:
            globals()[choice]()
        elif choice == 'help':
            print("Available commands:")
            print("  version        Show the current version")
            print("  update         Update the command line to the latest release")
            print("  help           Show this help message")
            print("  commands       List all available commands")
            print("  go <query>     Open a Google search for <query>")
        elif choice == 'commands':
            showCommands()
        elif choice.startswith('go'):
            query = choice.split()[1]
            subprocess.run(['start', f'https://www.google.com/search?q={query}'])
        else:
            print("Invalid command. Please try again.")

if __name__ == '__main__':
    main()