/**
 * @author Courtenay Probert
 */
//Global vars used in the call back events (because this is nonger the radion object)
var bufferloaded = false;
buffersize = 500;

var radio = {
	playing: false,
	s: null,
	req: null,
	context: null,
	channel: null,
	pausePosition: 0,
	buffertime: 2,
	debug: true,
	init: function(mp3){
        this.log("You instantiated a Class! "+ mp3);
		this.req = new air.URLRequest(mp3); 
		//this.req.cacheResponse = false;	
    },
	load: function(){
		bufferloaded = false;
		this.s = new air.Sound();
		this.s.addEventListener(air.IOErrorEvent.IO_ERROR, this.error); 
		this.s.addEventListener(air.ProgressEvent.PROGRESS, this.progress); 
		this.context = new air.SoundLoaderContext(buffersize, true); //size of the buffer 1024
		this.s.load(this.req, this.context); 
	},
	unload: function(){
		this.s.close();
		this.context = null;
		//this.req = null;
		this.s = null;
	},
	play: function(callback){
		if (bufferloaded) {
			this.log("Buffer is loaded - Now playing");
			this.playing = true;
			this.channel = this.s.play(); //this.pausePosition
			
			if(typeof callback == 'function'){
		        callback.call(this); // Stop other player
		    }
		}
		else{
			$(this).log("Buffer not loaded - trying again in "+ this.buffertime +" seconds");
			$(this).oneTime(this.buffertime *1000, function() {
				this.buffertime += 1;
				this.play(callback);
			});
		}
	},
	stop: function(){
		this.playing = false;
		try {
			this.pausePosition = this.channel.position; //not using at the mo
			this.channel.stop();
		} 
		catch (err) {
			air.trace("Error on stop: "+ err);
		}
	  	this.unload(); // this should clean the memory
	},
	progress: function(event){
		// Could i flush when event.bytesLoaded  = x ??? (stop and close)
		var loadedPct = Math.round(100 * (event.bytesLoaded / buffersize)); 
    	//air.trace("Buffer: " + event.bytesLoaded + " - buffersize:" + buffersize);
		if (loadedPct >= 100)
			bufferloaded = true;
		else
			$(this).log("Buffer: "+ loadedPct +"%");
	},
	error: function(event){
		alert("The station could not be loaded: " + event.text); 
		this.stop();
		$("#stop").hide(); //these shoudnt realy be in here 
		$("#play").show();
	},
	log: function(msg){
		if(this.debug)
      		air.trace(msg);
	}
};

var shoutcastradio = {
	url: "",
	port: "",
	player1: {},
	player2: {},
	debug: false,
	init: function(streamurl, streamport){
		this.log("Loading Shoutcast Radio");
		if (streamurl != "")
			this.url = streamurl;
			
		if (streamport != "")
			this.port = streamport;
		
		if (this.url && this.port) {
			
			var streamRndURL = this.url + ":" + this.port + "/;" + Math.round(Math.random() * 100000) + ".mp3"; //every instance is on a seperate stream
			this.player1 = $.extend(true,{},radio);
			this.player1.debug = this.debug;
			this.player1.init(streamRndURL);
			
			streamRndURL = this.url + ":" + this.port + "/;" + Math.round(Math.random() * 100000) + ".mp3";
			this.player2 = $.extend(true,{},radio);
			this.player2.debug = this.debug;
			this.player2.init(streamRndURL);
			
			//this.play();
		}
		else {
			alert("No URL or Port!");
			this.log("url: "+ this.url);
			this.log("port: "+ this.port);
		}
	},
	toggle: function(){
		// This toggles the players to clean the memory perodicaly (1 hours [3600 secs])
		$(document).everyTime((3600 * 1000), "radioSwap", function(i){
		if (i == 3) {
			$(this).log("Refreshing window...");
			window.location.reload(true); //Theres an air problem with loading too many sound objects
		}
			
		$(this).log("Swaping players.  Iteration: "+ i);
		
		if (this.player1.playing) {
			this.player2.load()//.log("loading player 2");
			this.player2.play(function(){
				//this.player1.channel = new air.SoundTransform(0.1, 0);
				air.trace("Stoping player 1");
				this.player1.stop();
			})//.log("playing player 2");
		}
		else{
			this.player1.load()//.log("loading player 1");
			this.player1.play(function(){
				//this.player2.channel = new air.SoundTransform(0.1, 0);
				//air.trace("Stoping player 2");
				this.player2.stop();	
			})//.log("playing player 1");
		}
	});		
	},
	play: function(callback){
			this.player1.load();
			//playSound("/sound/jingle.mp3"); // Should add intro jingle here
			this.player1.play(function(){
				if (typeof callback == 'function') 
					callback.call(this);
			});
			
			this.toggle();		
	},
	stop: function(callback){
		if (this.player1.playing)
			this.player1.stop();
		
		if (this.player2.playing)
			this.player2.stop();
		
		if(typeof callback == 'function')
			callback.call(this); 
	},
	restart: function(callback){
		this.stop();
		this.play(callback);
	},
	log: function(msg){
		if(this.debug)
      		air.trace(msg);
	}
}
