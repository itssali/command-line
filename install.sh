#!/bin/bash

# Download the executable
curl -LO https://github.com/itssali/command-line/blob/main/an  # Replace with the actual URL of the executable

# Move it to /usr/local/bin
sudo mv an /usr/local/bin/an

# Make it executable
sudo chmod +x /usr/local/bin/an

echo "AN Command Line installed successfully! You can use it by typing 'an' in your terminal."
