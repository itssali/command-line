@echo off
:: ASCII art display
echo  _   _      _ _         __  __        _   _                         
echo | | | | ___| | | ___   |  \/  |_ __  | \ | | __ _ ___ ___  ___ _ __ 
echo | |_| |/ _ \ | |/ _ \  | |\/| | '__| |  \| |/ _` / __/ __|/ _ \ '__|
echo |  _  |  __/ | | (_) | | |  | | |_   | |\  | (_| \__ \__ \  __/ |   
echo |_| |_|\___|_|_|\___/  |_|  |_|_(_)  |_| \_|\__,_|___/___/\___|_|   

echo Installing AN Command Line...

:: Create installation directory
set "install_dir=%ProgramFiles%\AN"
mkdir "%install_dir%" 2>nul

:: Download an.py from your GitHub repository
curl -L -o "%install_dir%\an.py" "https://raw.githubusercontent.com/itssali/command-line/main/an.py"

:: Create a symbolic link for global access
mklink "%USERPROFILE%\an.bat" "%install_dir%\an.py"

echo AN Command Line has been installed successfully!
echo You can now use 'an' commands globally.
pause
