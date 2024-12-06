#!/bin/bash

# Get the current directory from the command output
output=$(node "/Users/alinasser/Library/Mobile Documents/com~apple~CloudDocs/Coding/command-line/index.js" "$@")

# Check if the output starts with "cd "
if [[ $output == cd* ]]; then
    # Execute the cd command
    eval "$output"
else
    # Print any other output
    echo "$output"
fi
