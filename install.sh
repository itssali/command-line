#!/bin/bash

# ASCII art or welcome message
echo "  _   _      _ _         __  __        _   _                         "
echo " | | | | ___| | | ___   |  \/  |_ __  | \ | | __ _ ___ ___  ___ _ __ "
echo " | |_| |/ _ \ | |/ _ \  | |\/| | '__| |  \| |/ _` / __/ __|/ _ \ '__|"
echo " |  _  |  __/ | | (_) | | |  | | |_   | |\  | (_| \__ \__ \  __/ |   "
echo " |_| |_|\___|_|_|\___/  |_|  |_|_(_)  |_| \_|\__,_|___/___/\___|_|   "
echo ""

echo "Installing AN Command Line..."

# Move the executable to /usr/local/bin for global access
sudo mv an-cli /usr/local/bin/an

echo ""
echo "AN Command Line has been installed successfully!"
echo "You can now use 'an' commands globally."
