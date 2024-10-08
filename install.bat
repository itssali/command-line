@echo off
echo  _   _      _ _         __  __        _   _                         
echo | | | | ___| | | ___   |  \/  |_ __  | \ | | __ _ ___ ___  ___ _ __ 
echo | |_| |/ _ \ | |/ _ \  | |\/| | '__| |  \| |/ _` / __/ __|/ _ \ '__|
echo |  _  |  __/ | | (_) | | |  | | |_   | |\  | (_| \__ \__ \  __/ |   
echo |_| |_|\___|_|_|\___/  |_|  |_|_(_)  |_| \_|\__,_|___/___/\___|_|   

echo Installing AN Command Line...

:: Check if the destination folder exists
IF NOT EXIST "%ProgramFiles%\AN Command Line" (
    mkdir "%ProgramFiles%\AN Command Line"
)

:: Move the executable to the target directory
copy /y "dist\an.exe" "%ProgramFiles%\AN Command Line\an.exe"

:: Create a command to call the executable
echo @echo off > "%ProgramFiles%\AN Command Line\an.bat"
echo "%ProgramFiles%\AN Command Line\an.exe" %%* >> "%ProgramFiles%\AN Command Line\an.bat"

:: Create a symbolic link in the system path
mklink "%USERPROFILE%\AppData\Local\Microsoft\WindowsApps\an.exe" "%ProgramFiles%\AN Command Line\an.exe"

echo AN Command Line has been installed successfully!
echo You can now use 'an' commands globally.
