<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:a="http://ns.adobe.com/air/application/3.0">
<xsl:output method="xml" indent="yes"/>
	<xsl:template match="/prefs">
        <application xmlns="http://ns.adobe.com/air/application/3.0">
            <!-- The application identifier string, unique to this application. Required. -->
            <id><xsl:value-of select="stationname"/>.shout-on-air</id>
            <!-- Used as the filename for the application. Required. -->
            <filename><xsl:value-of select="stationname"/></filename>
            <!-- The name that is displayed in the AIR application installer. Optional. -->
            <name><xsl:value-of select="stationname"/></name>
            <!-- An application version designator (such as "v1", "2.5", or "Alpha 1"). Required. -->
            <versionNumber><xsl:value-of select="versionNumber"/></versionNumber>
            <!-- Description, displayed in the AIR application installer. Optional. -->
            <description/>
            <!-- Copyright information. Optional -->
            <copyright>Copyright (c) 2013 Courtenay Probert.</copyright> 
            <installFolder><xsl:value-of select="stationname"/></installFolder> 
            <programMenuFolder><xsl:value-of select="stationname"/></programMenuFolder> 
            <!-- Settings for the application's initial window. Required. -->
            <initialWindow>
                <!-- The main HTML file of the application. Required. -->
                <content>radio.html</content>
                <!-- The title of the main window. Optional. -->
                <title><xsl:value-of select="stationname"/></title>
                <!-- The type of system chrome to use (either "standard" or "none"). Optional. Default standard. -->
                <systemChrome>standard</systemChrome>
                <!-- Whether the window is transparent. Only applicable when systemChrome is false. Optional. Default false. -->
                <transparent>false</transparent>
                <!-- Whether the window is initially visible. Optional. Default false. -->
                <visible>true</visible>
                <!-- Whether the user can minimize the window. Optional. Default true. -->
                <minimizable>true</minimizable>
                <!-- Whether the user can maximize the window. Optional. Default true. -->
                <maximizable>false</maximizable>
                <!-- Whether the user can resize the window. Optional. Default true. -->
                <resizable>true</resizable>
                <!-- The window's initial width. Optional. -->
                <width>295</width>
                <!-- The window's initial height. Optional. -->
                <height>600</height>
                <!-- The window's initial x position. Optional. -->
                <x>10</x>
                <!-- The window's initial y position. Optional. -->
                <y>10</y>
                <!-- The window's minimum size, specified as a width/height pair, such as "400 200". Optional. -->
                <minSize>295 130</minSize>
                <!-- The window's initial maximum size, specified as a width/height pair, such as "1600 1200". Optional. -->
                <maxSize>295 800</maxSize>
            </initialWindow>
            <icon>
                <image16x16>icons/Logo-16.png</image16x16>
                <image32x32>icons/Logo-32.png</image32x32>
                <image48x48>icons/Logo-48.png</image48x48>
                <image128x128>icons/Logo-128.png</image128x128>
            </icon>
            <fileTypes></fileTypes>
        </application>
	</xsl:template>
</xsl:stylesheet>