@echo off
adt -package -storetype pkcs12 -keystore cert.p12 -storepass LetItAllOut ShoutOnAir.air application.xml config.xml radio.html icons images lib scripts stylesheets

pause