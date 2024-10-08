package main

import (
    "fmt"
    "os"
    "os/exec"
    "strings"
    "time"
)

const VERSION = "1.0.0"

// ASCII Art
var asciiArt = []string{
    "  _   _      _ _         __  __        _   _                         ",
    " | | | | ___| | | ___   |  \\/  |_ __  | \\ | | __ _ ___ ___  ___ _ __ ",
    " | |_| |/ _ \\ | |/ _ \\  | |\\/| | '__| |  \\| |/ _` / __/ __|/ _ \\ '__|",
    " |  _  |  __/ | | (_) | | |  | | |_   | |\\  | (_| \\__ \\__ \\  __/ |   ",
    " |_| |_|\\___|_|_|\\___/  |_|  |_|_(_)  |_| \\_|\\__,_|___/___/\\___|_|   ",
}

func displayAsciiArt() {
    for _, line := range asciiArt {
        for _, char := range line {
            fmt.Print(string(char))
            time.Sleep(10 * time.Millisecond) // Fast typing effect
        }
        fmt.Println() // Move to the next line after fully printing
    }
}

func showVersion() {
    fmt.Printf("AN Command Line Version: %s\n", VERSION)
}

func updateCommandLine() {
    fmt.Println("Updating the command line...")
    // os.system("git pull origin main") // Handle updates differently
}

func showHelp() {
    fmt.Println("Available Commands:")
    fmt.Println("  version        Show the current version")
    fmt.Println("  update         Update the command line to the latest release")
    fmt.Println("  help           Show this help message")
    fmt.Println("  commands       List all available commands")
    fmt.Println("  go <query>     Open a Google search for <query>")
}

func showCommands() {
    fmt.Println("Commands you can use:")
    fmt.Println("  version, update, help, commands, go")
}

func performGoogleSearch(query string) {
    searchURL := fmt.Sprintf("https://www.google.com/search?q=%s", strings.ReplaceAll(query, " ", "+"))
    err := exec.Command("open", searchURL).Start() // Use "start" for Windows
    if err != nil {
        fmt.Println("Error opening browser:", err)
    }
}

func main() {
    displayAsciiArt() // Display the ASCII art

    if len(os.Args) < 2 {
        fmt.Println("Please provide a command. Use 'an help' for more information.")
        return
    }

    command := os.Args[1]

    // Remove '--' if present
    if strings.HasPrefix(command, "--") {
        command = command[2:]
    }

    switch command {
    case "version", "v":
        showVersion()
    case "update", "u":
        updateCommandLine()
    case "help", "h":
        showHelp()
    case "commands", "c":
        showCommands()
    case "go":
        if len(os.Args) < 3 {
            fmt.Println("Please provide a query to search.")
        } else {
            query := strings.Join(os.Args[2:], " ")
            performGoogleSearch(query)
        }
    default:
        fmt.Printf("Unknown command: %s. Use 'an help' for assistance.\n", command)
    }
}
