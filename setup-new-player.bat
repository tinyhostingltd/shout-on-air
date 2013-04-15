@echo off
cls
cd /d %0\..
TITLE "Setup new Shout-On-Air Player"
setlocal
echo Please ensure you have your player config.xml and icons folder in the .players dir.
echo .

dir .players /b
echo .

rem Set player 
if "%1" == "" (
    set /p player=Enter name the name of the folder of your .player:  
) else (
	set "player=%1"
)
if "%player%" == "" (
    set "player=Template"
)

echo Copying %player% config
xcopy "./.players/%player%/config.xml" config.xml /f /y /r
echo Copying %player% icons
xcopy "./.players/%player%/icons/*.*" icons /f /y /r

endlocal
echo Complete
pause