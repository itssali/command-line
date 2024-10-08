import os
import sys
import webbrowser

VERSION = "1.0.0"

def show_version():
    print(f"AN Command Line Version: {VERSION}")

def update_command_line():
    print("Updating the command line...")
    os.system("git pull origin main")

def show_help():
    print("Available Commands:")
    print("  version        Show the current version")
    print("  update         Update the command line to the latest release")
    print("  help           Show this help message")
    print("  commands       List all available commands")
    print("  go <query>     Open a Google search for <query>")

def show_commands():
    print("Commands you can use:")
    print("  version, update, help, commands, go")

def perform_google_search(query):
    search_url = f"https://www.google.com/search?q={query.replace(' ', '+')}"
    webbrowser.open(search_url)

def main():
    if len(sys.argv) < 2:
        print("Please provide a command. Use 'an help' for more information.")
        return

    command = sys.argv[1]

    # Remove '--' if present
    if command.startswith("--"):
        command = command[2:]

    if command in ['version', 'v']:
        show_version()
    elif command in ['update', 'u']:
        update_command_line()
    elif command in ['help', 'h']:
        show_help()
    elif command in ['commands', 'c']:
        show_commands()
    elif command == 'go':
        if len(sys.argv) < 3:
            print("Please provide a query to search.")
        else:
            query = " ".join(sys.argv[2:])
            perform_google_search(query)
    else:
        print(f"Unknown command: {command}. Use 'an help' for assistance.")

if __name__ == "__main__":
    main()
