#!/bin/bash

# Define the ASCII art as an array
text=(
    "  _   _      _ _         __  __        _   _                         "
    " | | | | ___| | | ___   |  \/  |_ __  | \ | | __ _ ___ ___  ___ _ __ "
    " | |_| |/ _ \\ | |/ _ \\  | |\\/| | '__| |  \\| |/ _\` / __/ __|/ _ \\ '__|"
    " |  _  |  __/ | | (_) | | |  | | |_   | |\\  | (_| \\__ \\__ \\  __/ |   "
    " |_| |_|\\___|_|_|\\___/  |_|  |_|_(_)  |_| \\_|\\__,_|___/___/\\___|_|   "
)

# Loop through each line of ASCII art and type it out quickly
for line in "${text[@]}"; do
  for ((i=0; i<${#line}; i++)); do
    printf "%s" "${line:$i:1}"
    sleep 0.001  # Fast typing effect
  done
  echo ""  # Move to the next line after fully printing
done

echo "Installing AN Command Line..."

# Create the destination directory if it doesn't exist
mkdir -p ~/bin

# Check if the an-cli executable exists in the dist folder
if [ ! -f "dist/an-cli" ]; then
    echo "Error: 'dist/an-cli' not found. Make sure you have built the executable."
    exit 1
fi

# Move the an-cli executable to ~/bin
mv dist/an-cli ~/bin/an

# Check if ~/bin is already in the PATH
if ! echo "$PATH" | grep -q "$HOME/bin"; then
    # Add ~/bin to PATH if not present
    echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bash_profile
    echo 'export PATH="$HOME/bin:$PATH"' >> ~/.zshrc
    echo "Added ~/bin to your PATH. Please restart your terminal or run 'source ~/.bash_profile' or 'source ~/.zshrc' to refresh your environment."
fi

echo "AN Command Line has been installed successfully!"
echo "You can now use 'an' commands globally."