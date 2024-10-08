@echo off
setlocal

:: Create directory if it doesn't exist
if not exist "%USERPROFILE%\bin" (
    mkdir "%USERPROFILE%\bin"
)

:: Download the executable from GitHub Releases
powershell -Command "Invoke-WebRequest -Uri https://github.com/itssali/command-line/raw/main/an.exe -OutFile %USERPROFILE%\bin\an.exe"

:: Add %USERPROFILE%\bin to PATH
setx PATH "%USERPROFILE%\bin;%PATH%"

echo AN Command Line installed successfully! You can use it by typing 'an' in your command prompt.
endlocal
