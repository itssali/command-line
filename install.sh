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

# Create ~/bin if it doesn't exist
mkdir -p ~/bin

# Move the command line executable to ~/bin
mv dist/an-cli ~/bin/an

# Add ~/bin to PATH if not already there
if [[ ":$PATH:" != *":$HOME/bin:"* ]]; then
  echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bash_profile
  echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bashrc
  echo 'export PATH="$HOME/bin:$PATH"' >> ~/.zshrc
  echo "Added ~/bin to your PATH. Please restart your terminal or run 'source ~/.bash_profile', 'source ~/.bashrc', or 'source ~/.zshrc' to refresh your environment."
fi

echo "AN Command Line has been installed successfully!"
echo "You can now use 'an' commands globally."