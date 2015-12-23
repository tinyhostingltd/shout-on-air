Shout-On-Air is a desktop client for **a** Shoutcast radio station, written on Adobe Air.
Shout-On-Air can be customised to for your radio station, by setting the stream URI and port number in the config.xml file.  The player can also be branded with your radio stations logos, colours, etc.  It also shows tweets that mention the station, so listeners can send in requests, you can tweet schedules etc.

Now with recording support - `[Ctrl]+R`

![http://shout-on-air.googlecode.com/files/Screenshot.png](http://shout-on-air.googlecode.com/files/Screenshot.png)

A Shoutcast/Icecast stream like an Internet radio, is like a never ending mp3, witch take a large amount of memory, and eventually make the player crash. To avoid problem in the flash Sound object I pre-load in the background another Sound object, and then crossfade the two on a periodic basis (configurable in the config.xml).  Technique as described at: http://bit.ly/3wJjua

I have example instances of the Shout-On-Air player implemented for these radio stations:

Download players from:
  * http://shout-on-air.probert.me.uk/

If you want me to create a desktop player for your station, [make a donation to a charity I work with](http://www.justgiving.com/Helen-runs-Paris/) then [drop me a line](http://probert.me.uk/contact.asp).

Or checkout the source code from http://shout-on-air.googlecode.com/svn/trunk/