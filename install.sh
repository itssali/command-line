#!/bin/bash

# Create bin directory if it doesn't exist
mkdir -p ~/bin

# Download the executable from GitHub Releases
curl -LO https://github.com/itssali/command-line/raw/main/an  # Update this URL if necessary

# Move it to ~/bin
mv an ~/bin/an

# Make it executable
chmod +x ~/bin/an

# Add ~/bin to PATH if it's not already there
if ! echo "$PATH" | grep -q "$HOME/bin"; then
    echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bash_profile
    source ~/.bash_profile
fi

echo "AN Command Line installed successfully! You can use it by typing 'an' in your terminal."
