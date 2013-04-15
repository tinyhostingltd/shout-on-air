@echo off
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

echo Building %n%-%v%.air
adt -package -storetype pkcs12 -keystore cert.p12 -storepass LetItAllOut %n%-%v%.air application.xml config.xml radio.html icons images lib scripts stylesheets

pause