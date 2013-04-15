@echo off
cls
cd /d %0\..
TITLE "Setup new Shout-On-Air Player"
setlocal
echo Please ensure you have your player config.xml and icons folder in the .players dir.

rem Set player 
if "%1" == "" (
    set /p player=Enter name the name of the folder of your .player! 
) else (
	set "player=%1"
)
if "%player%" == "" (
    set "player=Template"
)
echo Creating %player%

xcopy ./.players/%player%/* ./* /y /s


endlocal
echo Complete
pause