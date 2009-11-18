/**
 * @author Courtenay Probert
 */
var radio = {
	playing: false,
	s: null,
	uri: "",
	req: null,
	context: null,
	channel: null,
	pausePosition: 0,
	buffertime: 2,
	debug: false,
	bufferloaded: false,
	buffersize: 500,
	buffertime: 2,
	urlStream: null,
	fileStream: null,
	type: "shoutcast",
	init: function(uri){
		this.uri = uri;
        this.log("You instantiated: "+ this.name);
    },
	load: function(){
		this.bufferloaded = false;
		var rnduri = this.uri;
		if(this.type == "shoutcast"){
		 	rnduri = this.uri + ";" + Math.round(Math.random() * 100000) + ".mp3"
		}
		this.req = new air.URLRequest(rnduri); 
		this.req.cacheResponse = false;	
		this.req.useCache = false;
		this.log("Loading: "+ rnduri);
		
		this.s = new air.Sound();
		this.s.addEventListener(air.IOErrorEvent.IO_ERROR, this.e.error.bind(this)); 
		this.s.addEventListener(air.ProgressEvent.PROGRESS, this.e.progress.bind(this)); 
		this.context = new air.SoundLoaderContext(buffersize, true); 
		this.s.load(this.req, this.context); 
		this.log("Loaded player: "+ this.name);
	},
	unload: function(){
		if (this.s != null) {
			try {
				this.s.close();
			}
			catch(err){
				this.log("s.close - err: "+ err);
			}
			this.context = null;
			this.req = null; //I've moved initialisation from load to the constructor, so dont close here
			this.s = null;
			this.log("Unloaded player: "+ this.name);
		}
	},
	play: function(callback){
		if (this.bufferloaded) {
			this.log("Buffer is loaded - Now playing");
			this.playing = true;
			this.channel = this.s.play(); //this.pausePosition
			if(this.buffertime > 1)
				this.buffertime -= 1;
			this.log("Started player: "+ this.name);
			
			if(typeof callback == 'function'){
		        callback.call(this); // Stop other player
		    }
		}
		else{
			$(this).log("Buffer not loaded - trying again in "+ this.buffertime +" seconds");
			$(this).oneTime(this.buffertime *1000, function(event) {
				this.buffertime += 1;
				this.play(callback);
			});
		}
	},
	stop: function(){
		
		if (this.channel == null) {
			this.playing = false;
		}
		else {
			try {
				this.pausePosition = this.channel.position; //not using at the mo
				this.channel.stop();
				this.playing = false;
				this.log("Stopped player: "+ this.name);
			} 
			catch (err) {
				this.log("Error on stopplayer ("+ this.name +") "+ err);
			}
			this.unload(); // this should clean the memory
		}
	},
	record: function(){
		this.log(this.name + " recording");
		this.urlStream = new air.URLStream();
		this.fileStream = new air.FileStream();
		this.urlStream.addEventListener(air.ProgressEvent.PROGRESS, this.e.writefile.bind(this));
		this.urlStream.addEventListener(air.IOErrorEvent.IO_ERROR, this.e.error.bind(this));
		var d=new Date();
		this.file = air.File.desktopDirectory.resolvePath(this.name +"-"+ d.getDateTimeStamp() +".mp3");
		this.fileStream.openAsync(this.file, air.FileMode.WRITE);
		this.urlStream.load(this.req);
		this.play();
	},
	stoprecord: function(){
		if(this.urlStream.connected)
			this.urlStream.close();
		this.fileStream.close();
		this.stop();
	},
	e: {
		progress: function(event){
			// Could i flush when event.bytesLoaded  = x ??? (stop and close)
			var loadedPct = Math.round(100 * (event.bytesLoaded / this.buffersize));
			if (loadedPct >= 100) 
				this.bufferloaded = true;
			else 
				$(this).log(this.name +" buffer: " + loadedPct + "%");
		},
		error: function(event){
			this.log(event.text);
			this.stop();
		},
		writefile: function(){
			var dataBuffer = new air.ByteArray();
			this.urlStream.readBytes(dataBuffer, 0, this.urlStream.bytesAvailable);
			this.fileStream.writeBytes(dataBuffer, 0, dataBuffer.length);
	},
	},
	log: function(msg){
		if(this.debug)
      		air.trace(msg);
	}
};

var shoutcastradio = {
	url: "",
	port: "80",
	folder: "/",
	type: "shoutcast",
	player1: {},
	player2: {},
	debug: false,
	toggletime: 3600,
	i: 0,
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
			this.player1 = $.extend(true, {name: 'player1'}, radio);
			this.player1.debug = this.debug;
			this.player1.type = this.type;
			this.player1.init(streamRndURL);
			
			streamRndURL = this.url + ":" + this.port;
			this.player2 = $.extend(true, {name: 'player2'}, radio);
			this.player2.debug = this.debug;
			this.player2.type = this.type;
			this.player2.init(streamRndURL);
		}
		else {
			alert("No URL or Port!");
			this.log("url: " + this.url);
			this.log("port: " + this.port);
		}
	},
	play: function(callback){
			$(this).log("Swaping players.  Iteration: " + shoutcastradio.i);
			
			if (shoutcastradio.player1.playing) {
				shoutcastradio.player2.load()
				shoutcastradio.player2.play(function(){
					/*
					for (i = 1; i <= 0; i-0.1) {
						shoutcastradio.player1.channel.soundTransform = new air.SoundTransform(i, 0);
					}
					*/
					shoutcastradio.player1.stop();
					if (typeof callback == 'function') 
						callback.call(this);
				});
			}
			else {
				shoutcastradio.player1.load()//.log("loading player 1");
				shoutcastradio.player1.play(function(){
					/*
					for (i = 1; i <= 0; i - 0.1) {
						shoutcastradio.player2.channel.soundTransform = new air.SoundTransform(i, 0);
						$(this).log(i);
					}
					*/
					shoutcastradio.player2.stop();
					if (typeof callback == 'function') 
						callback.call(this);
				});
			}
			shoutcastradio.i ++;
			setTimeout(shoutcastradio.play, shoutcastradio.toggletime * 1000); // This toggles the players to clean the memory perodicaly (1 hours = 3600 secs)
	},
	stop: function(callback){
		if (this.player1.playing) 
			this.player1.stop();
		
		if (this.player2.playing) 
			this.player2.stop();
		
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
