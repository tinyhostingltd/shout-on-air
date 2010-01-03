/**
 * @author Courtenay Probert
 */
var radio = {// Global Properties
	debug: false,
	type: "shoutcast",
	playing: false,
	buffertime: 3000, // 3 secs
	p:{// Private vars
		pausePosition: 0,
		s: null,
		req: null,
		context: null,
		channel: null,
		urlStream: null,
		fileStream: null,
		playCallback: null,
		uri: "",
		bufferloopcount: 1,
	},
	init: function(uri){
		this.p.uri = uri;
        this.log("You instantiated: "+ this.name);
    },
	load: function(){
		var rnduri = this.p.uri;
		if(this.type == "shoutcast"){
		 	rnduri = this.p.uri + ";" + Math.round(Math.random() * 100000) + ".mp3"
		}
		this.p.req = new air.URLRequest(rnduri); 
		this.p.req.cacheResponse = false;	
		this.p.req.useCache = false;
		this.log("Loading: "+ rnduri);
		
		this.p.s = new air.Sound();
		this.p.s.addEventListener(air.IOErrorEvent.IO_ERROR, this.e.error.bind(this)); 
		this.p.s.addEventListener(air.ProgressEvent.PROGRESS, this.e.progress.bind(this)); 
		//this.p.s.addEventListener(air.Event.ID3, this.e.id3.bind(this));
		this.p.s.addEventListener(air.Event.COMPLETE, this.e.complete.bind(this));
		this.p.context = new air.SoundLoaderContext(this.buffertime, false); 
		this.p.s.load(this.p.req, this.p.context); 
		this.log("Loaded player: "+ this.name);
	},
	unload: function(){
		if (this.p.s != null) {
			try {
				this.p.s.close();
			}
			catch(err){
				this.log("s.close - err: "+ err);
			}
			this.p.context = null;
			this.p.req = null; //I've moved initialisation from load to the constructor, so dont close here
			this.p.s = null;
			this.log("Unloaded player: "+ this.name);
		}
	},
	play: function(callback){
		this.p.playCallback = callback;
		if (!this.p.s.isBuffering){
			this.log("Buffer is loaded - Now playing");
			this.playing = true;
			this.p.channel = this.p.s.play(this.p.pausePosition); 
			if(this.p.bufferloopcount > 1)
				this.p.bufferloopcount -= 1;
			this.log("Started player: "+ this.name);
			
			if(typeof callback == 'function'){
				this.log(this.name +" callback");
		        this.p.playCallback.call(this); // Stop other player
		    }
		}
		else{
			$(this).log("Buffer not loaded - trying again in "+ this.p.bufferloopcount +" seconds");
			$(this).oneTime(this.p.bufferloopcount * 1000, function(event) {
				this.p.bufferloopcount += 1;
				this.play(callback);
			});
		}
	},
	stop: function(){
		
		if (this.p.channel == null) {
			this.playing = false;
		}
		else {
			try {
				this.p.pausePosition = this.p.channel.position; //not using at the mo
				this.p.channel.stop();
				this.playing = false;
				this.log("Stopped player: "+ this.name);
			} 
			catch (err) {
				this.log("Error on stopplayer ("+ this.name +") "+ err);
			}
			this.unload(); // this should clean the memory
		}
	},
	record: function(file){
		this.log(this.name + " recording");
		this.p.urlStream = new air.URLStream();
		this.p.fileStream = new air.FileStream();
		this.p.urlStream.addEventListener(air.ProgressEvent.PROGRESS, this.e.writefile.bind(this));
		this.p.urlStream.addEventListener(air.IOErrorEvent.IO_ERROR, this.e.error.bind(this));
		
		if (file == null) {
			var d = new Date();
			this.file = air.File.desktopDirectory.resolvePath(this.name + "-" + d.getDateTimeStamp() + ".mp3");
		}
		else {
			if(!file.extension || file.extension.toLowerCase() != "mp3"){
				this.log("no extension");
				file.nativePath += ".mp3";
			}
			this.file = file;
		}
			
		this.p.fileStream.openAsync(this.file, air.FileMode.WRITE);
		this.p.urlStream.load(this.p.req);
		this.play();
	},
	stoprecord: function(){
		if(this.p.urlStream.connected)
			this.p.urlStream.close();
		this.p.fileStream.close();
		this.stop();
	},
	e: {
		complete: function(event){
			alert("Finished playing :-("); 
		},
		id3: function(event){
			var id3 = event.target.id3; 
		    air.trace("Received ID3 Info:"); 
		    for (propName in id3) 
		    { 
		        air.trace(propName + " = " + id3[propName]); 
		    } 
		},
		progress: function(event){
			//event.bytesLoaded
			//air.trace(this.p.s.isBuffering);
				
			// Could i flush when event.bytesLoaded  > than 10 meg? (stop and close) 
			//if (event.bytesLoaded > 10 * 1024) 
		},
		error: function(event){
			this.log(event.text);
			this.stop();
		},
		writefile: function(){
			var dataBuffer = new air.ByteArray();
			this.p.urlStream.readBytes(dataBuffer, 0, this.p.urlStream.bytesAvailable);
			this.p.fileStream.writeBytes(dataBuffer, 0, dataBuffer.length);
	},
	},
	log: function(msg){
		if(this.debug)
      		air.trace(msg);
	}
};

var shoutcastradio = {
	debug: false,
	type: "shoutcast",
	toggletime: 3600,
	buffertime: 3000,
	url: "",
	port: "80",
	folder: "/",
	p:{
		player1: {},
		player2: {},
		i: 0,
		timeoutID: 0
	},
	init: function(streamurl, streamport, streamfolder){
		this.log("Loading Shoutcast Radio");
		if (streamurl != "") 
			this.url = streamurl;
		
		if (streamport != "") 
			this.port = streamport;
			
		if (streamfolder != "") 
			this.folder = streamfolder;
		
		if (this.url && this.port) {
			var streamRndURL = this.url + ":" + this.port + this.folder; //every instance is on a seperate stream
			this.p.player1 = $.extend(true, {name: 'player1'}, radio);
			this.p.player1.debug = this.debug;
			this.p.player1.type = this.type;
			this.p.player1.buffertime = this.buffertime;
			this.p.player1.init(streamRndURL);
			
			streamRndURL = this.url + ":" + this.port;
			this.p.player2 = $.extend(true, {name: 'player2'}, radio);
			this.p.player2.debug = this.debug;
			this.p.player2.type = this.type;
			this.p.player2.buffertime = this.buffertime;
			this.p.player2.init(streamRndURL);
		}
		else {
			alert("No URL or Port!");
			this.log("url: " + this.url);
			this.log("port: " + this.port);
		}
	},
	play: function(callback){
			$(this).log("Swaping players.  Iteration: " + shoutcastradio.p.i);
			window.clearTimeout(this.p.timeoutID);
			
			if (shoutcastradio.p.player1.playing) {
				shoutcastradio.p.player2.load()
				shoutcastradio.p.player2.play(function(){
					/*
					for (i = 1; i <= 0; i-0.1) {
						shoutcastradio.p.player1.p.channel.soundTransform = new air.SoundTransform(i, 0);
					}
					*/
					shoutcastradio.p.player1.stop();
					if (typeof callback == 'function') 
						callback.call(this);
				});
			}
			else {
				shoutcastradio.p.player1.load()//.log("loading player 1");
				shoutcastradio.p.player1.play(function(){
					/*
					for (i = 1; i <= 0; i - 0.1) {
						shoutcastradio.p.player2.p.channel.soundTransform = new air.SoundTransform(i, 0);
						$(this).log(i);
					}
					*/
					shoutcastradio.p.player2.stop();
					if (typeof callback == 'function') 
						callback.call(this);
				});
			}
			shoutcastradio.p.i ++;
			this.p.timeoutID  = window.setTimeout(shoutcastradio.play, shoutcastradio.toggletime * 1000); // This toggles the players to clean the memory perodicaly (1 hours = 3600 secs)
	},
	stop: function(callback){
		this.log("Stoping shoutcastradio");
		
		if (this.p.player1.playing) {
			this.log("Stoping player1");
			this.p.player1.stop();
		}
		
		if (this.p.player2.playing) {
			this.log("Stoping player2");
			this.p.player2.stop();
		}
		
		window.clearTimeout(this.p.timeoutID);
		
		if (typeof callback == 'function') 
			callback.call(this);
	},
	restart: function(callback){
		this.stop();
		this.play(function(){
			if (typeof callback == 'function') 
				callback.call(this);
		});
	},
	log: function(msg){
		if (this.debug) 
			air.trace(msg);
	}
}
