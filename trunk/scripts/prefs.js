/**
 * @author cprobert
 */
var prefs = {
	stationname: "",
	weburl: "",
	streamurl: "",
	streamport: 0,
	streamfolder: "/",
	streamtype: "shoutcast",
	twitterusername: "",
	twittersearch: true,
	header: "<h1>Shout-On-Air</h1>",
	buffersize: 1024,
	debug: false,
	error: false,
	init: function(callback){
		this.debug = true;
		this.buffersize = 800;
		this.loadprefs();
		
		if (!this.error && typeof callback == 'function') 
				callback.call(this);
	},
	startingvol: function(volume){
		if(volume){ //Set
			var data = new air.ByteArray(); // Peristant save the volume to the users 
			data.writeUTFBytes(volume);
			air.EncryptedLocalStore.setItem('volume', data);
			return volume;
		}
		else { //Get
			volume = air.EncryptedLocalStore.getItem('volume');
			if (volume) 
				return volume.readUTFBytes(volume.bytesAvailable);
			else 
				return 0.8;
		}
	},
	loadprefs: function(){
		var prefsFile = air.File.applicationDirectory;
		prefsfile = prefsFile.resolvePath("config.xml");
		
		var prefsXML;
		var stream;
		stream = new air.FileStream();
		if (prefsfile.exists) {
			try {
				stream.open(prefsfile, air.FileMode.READ);
				prefsXML = stream.readUTFBytes(stream.bytesAvailable);
				stream.close();
				//air.trace("prefsXML: "+ prefsXML);	
				var domParser = new DOMParser();
				prefsXML = domParser.parseFromString(prefsXML, "text/xml");
				
				this.stationname = prefsXML.getElementsByTagName("stationname")[0].firstChild.nodeValue;
				$(this).log("stationname: " + this.stationname);
				
				this.weburl = prefsXML.getElementsByTagName("weburl")[0].firstChild.nodeValue;
				$(this).log("weburl: " + this.weburl);
				
				this.streamurl = prefsXML.getElementsByTagName("streamurl")[0].firstChild.nodeValue;
				$(this).log("streamurl: " + this.streamurl);
				
				this.streamport = prefsXML.getElementsByTagName("streamport")[0].firstChild.nodeValue;
				$(this).log("streamport: " + this.streamport);
				
				this.streamfolder = prefsXML.getElementsByTagName("streamfolder")[0].firstChild.nodeValue;
				$(this).log("streamfolder: " + this.streamfolder);
				
				this.streamtype = prefsXML.getElementsByTagName("streamtype")[0].firstChild.nodeValue;
				$(this).log("streamtype: " + this.streamtype);
				
				this.twitterusername = prefsXML.getElementsByTagName("twitterusername")[0].firstChild.nodeValue;
				$(this).log("twitterusername: " + this.twitterusername);
				this.header = prefsXML.getElementsByTagName("header")[0].textContent; //$(this).log("header: "+ this.header);
			}
			catch(err){
				this.error = true;
			}
		}
		else{
			this.error = true;
			alert("Can not find config file! "+ prefsfile);
		}
	}
}
