/**
 * @author cprobert
 */
var prefs = {
	stationname: "Shout-On-Air",
	weburl: "#",
	streamurl: "",
	streamport: 0,
	streamfolder: "/",
	streamtype: "shoutcast",
	toggletime: 1800,
	adserver: null,
	twitterusername: null,
	twittersearch: true,
	header: "<h1>Shout-On-Air</h1>",
	buffertime: 3000,
	debug: true,
	error: false,
	init: function(callback){
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
	winx: function(x){
		if(x){ //Set
			var data = new air.ByteArray(); // Peristant save the volume to the users 
			data.writeUTFBytes(x);
			air.EncryptedLocalStore.setItem('x', data);
			return x;
		}
		else { //Get
			x = air.EncryptedLocalStore.getItem('x');
			if (x) 
				return x.readUTFBytes(x.bytesAvailable);
			else 
				return null;
		}
	},
	winy: function(y){
		if(y){ //Set
			var data = new air.ByteArray(); // Peristant save the volume to the users 
			data.writeUTFBytes(y);
			air.EncryptedLocalStore.setItem('y', data);
			return y;
		}
		else { //Get
			y = air.EncryptedLocalStore.getItem('y');
			if (y) 
				return y.readUTFBytes(y.bytesAvailable);
			else 
				return null;
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
				var domParser = new DOMParser();
				prefsXML = domParser.parseFromString(prefsXML, "text/xml");
				
				//Using this type of accessor results in a fail if not not present
				this.streamurl = prefsXML.getElementsByTagName("streamurl")[0].firstChild.nodeValue;
				$(this).log("streamurl: " + this.streamurl);
				
				this.streamport = prefsXML.getElementsByTagName("streamport")[0].firstChild.nodeValue;
				$(this).log("streamport: " + this.streamport);
				
				//Using this type of accessor results in a empty string if not not present
				var streamfolder = $(prefsXML).find('streamfolder').text();
				if(streamfolder != "")
					this.streamfolder = streamfolder
				$(this).log("streamfolder: " + this.streamfolder);
				
				this.stationname = $(prefsXML).find('stationname').text();
				$(this).log("stationname: " + this.stationname);
				
				var weburl = prefsXML.getElementsByTagName("weburl")[0].firstChild.nodeValue;
				$(this).log("weburl: " + weburl);
				if (weburl != "")//if empty use default
					this.weburl = weburl;
				
				var adserver = $(prefsXML).find('adserver').text();
				$(this).log("adserver: " + adserver);
				if (adserver != "")
					this.adserver = adserver;
				
				var toggletime = $(prefsXML).find('toggletime').text();
				$(this).log("toggletime: " + toggletime);
				if (toggletime != "")
					this.toggletime = toggletime;
				
				var buffertime = $(prefsXML).find('buffertime').text();
				$(this).log("buffertime: " + buffertime);
				if (buffertime != "")
					this.buffertime = parseInt(buffertime);
				
				var streamtype = $(prefsXML).find('streamtype').text();
				$(this).log("streamtype: " + streamtype);
				if(streamtype != "")
					this.streamtype = streamtype;
				
				var twitterusername = $(prefsXML).find('twitterusername').text();
				$(this).log("twitterusername: " + twitterusername);
				if(twitterusername != "")
					this.twitterusername = twitterusername;
				
				this.header = $(prefsXML).find('header').text();
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
