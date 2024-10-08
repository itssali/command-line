@echo off
REM Download the executable using PowerShell
powershell -Command "Invoke-WebRequest -Uri https://github.com/itssali/command-line -OutFile an.exe"  REM Replace with the actual URL of the executable

REM Move the executable to Program Files
move an.exe "C:\Program Files\an.exe"

REM Add to PATH
setx PATH "%PATH%;C:\Program Files"

echo AN Command Line installed successfully! You can use it by typing 'an' in your command prompt.
