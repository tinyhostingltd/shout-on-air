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
    set /p player=Enter player name:  
) else (
	set "player=%1"
)
if "%player%" == "" (
    set "player=Template"
)

echo Copying %player% config
copy ".\.players\%player%\config.xml" config.xml /y /a /v
echo Copying %player% icons
xcopy ".\.players\%player%\icons" .\icons /y /r /i

echo Creating application.xml
.\buildtools\msxsl.exe config.xml .\buildtools\application.xsl -o application.xml

rem Get Version
.\buildtools\msxsl.exe application.xml .\buildtools\version.xsl>.\buildtools\v
set /p v=<.\buildtools\v
del .\buildtools\v
echo Setting version to %v%

rem Get Filename
.\buildtools\msxsl.exe application.xml .\buildtools\name.xsl>.\buildtools\n
set /p n=<.\buildtools\n
del .\buildtools\n
echo Setting name to %n%

endlocal
echo Complete
pause