/**
 * @author Courtenay Probert
 */
var bufferloaded = false;
var radio = Class.create({
	playing: false,
	s: null,
	req: null,
	context: null,
	url: prefs.streamurl,
	port: prefs.streamport,
	channel: null,
	pausePosition: 0,
	buffertime: 2,
	init: function(){
        //air.trace('You instantiated a Class!');
		var streamRndURL = this.url+":"+ this.port +"/;"+ Math.round(Math.random()*100000) +".mp3"; //every instance is on a seperate stream
		this.req = new air.URLRequest(streamRndURL); 
		//air.trace(streamRndURL);
    },
	load: function(){
		bufferloaded = false;
		this.s = new air.Sound();
		this.s.addEventListener(air.IOErrorEvent.IO_ERROR, this.error); 
		this.s.addEventListener(air.ProgressEvent.PROGRESS, this.progress); 
		this.context = new air.SoundLoaderContext(prefs.buffersize, true); //size of the buffer 1024
		this.s.load(this.req, this.context); 
	},
	unload: function(){
		this.s.close();
		this.context = null;
		//this.req = null;
		this.s = null;
	},
	play: function(otherplayer){
		//air.trace();
		if (bufferloaded) {
			//air.trace("Buffer is loaded - Now playing");
			this.playing = true;
			this.channel = this.s.play(); //this.pausePosition
		}
		else{
			//air.trace("Buffer not loaded - trying again in "+ this.buffertime +" seconds");
			$(this).oneTime(this.buffertime *1000, function() {
				this.buffertime += 1;
				this.play();
			});
		}
	},
	stop: function(){
		this.playing = false;
		this.pausePosition = this.channel.position; //not using at the mo
		this.channel.stop();
	  	this.unload(); // this should clean the memory
	},
	progress: function(event){
		var loadedPct = Math.round(100 * (event.bytesLoaded / prefs.buffersize)); 
    	//air.trace("The sound is " + loadedPct + "% loaded.");
		if (loadedPct >= 100) {
			bufferloaded = true;
			//air.trace("Buffer is loaded");
		}
	},
	error: function(event){
		alert("The station could not be loaded: " + event.text); 
		this.stop();
		$("#stop").hide(); //these shoudnt realy be in here 
		$("#play").show();
	}
});