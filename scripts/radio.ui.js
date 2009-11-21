/**
 * @author Courtenay Probert
 */
var ui = {
	init: function(){
		document.title = prefs.stationname;
		$("#header").html(prefs.header)
		
		if(prefs.weburl != null){
			$("#header").click(function(){
				openInBrowser(prefs.weburl);
			}).css('cursor', 'pointer');	
		}
		
		this.setupslider();
		this.getTweets();
		this.getTweets();
		
		$.ctrl('R', function() {
		    ui.startRecord();
		});
		try {
			var x = prefs.winx();
			$(this).log("prefs x: "+ x);
			if (x == null || x > air.Screen.mainScreen.bounds.width) {
				nativeWindow.x = (air.Screen.mainScreen.bounds.width - 300);
			}
			else {
				nativeWindow.x = x;
			}
			
			var y = prefs.winy();
			$(this).log("prefs y: "+ y);
			if (y == null || y > air.Screen.mainScreen.bounds.height) {
				nativeWindow.y = (air.Screen.mainScreen.bounds.height - 630);
			}
			else {
				nativeWindow.y = y;
			}
		}
		catch(err){
			air.trace("Could not move window");
		}
	},
	startPlayer: function(){
		$(this).log("startPlayer clicked");
		this.wire.buffering();
		shoutcastradio.restart(function(){
			ui.wire.stop();	
		});
	},
	stopPlayer: function(){
		$(this).log("stopPlayer clicked");
		shoutcastradio.stop(function(){
			ui.wire.start();		
		});
	},
	startRecord: function(){
		$(this).log("startRecord run");	
		$("#playControl").unbind();
		shoutcastradio.stop(function(){
			radio.name = prefs.stationname;
			radio.type = prefs.streamtype;
			radio.init(prefs.streamurl + ":" + prefs.streamport + prefs.streamfolder);
			radio.load();
			
		    try
		    {
				var d = new Date();
				var file = "Music/" + prefs.stationname + "-" + d.getDateTimeStamp() + ".mp3";
				var mp3 = air.File.userDirectory.resolvePath(file);
				//var mp3 = air.File.desktopDirectory.resolvePath("*.mp3");
		        mp3.browseForSave("Save MP3 As");
		        mp3.addEventListener(air.Event.SELECT, ui.e.record);
		    }
		    catch(e)
		    {
		        air.trace(e.message)
		    }
		});
	},
	stopRecord: function(){
		radio.stoprecord();
		this.stopPlayer()
	},
	setupslider: function(){
		$("#slider").slider({
			value: prefs.startingvol() * 100,
			min: 0,
			max: 100,
		   	change: function(event, ui) {
				var pos = $('#slider').slider("value") / 100;
				//air.trace(mypos);
				air.SoundMixer.soundTransform = new air.SoundTransform(pos, 0);
				prefs.startingvol(pos);
			}
		});	
	},
	getTweets: function(){
		$("#twitter").getTwitter({
			userName: prefs.twitterusername,
			numTweets: 3,
			loaderText: "Loading tweets...",
			slideIn: true,
			slideDuration: 750,
			showHeading: true,
			headingText: prefs.stationname,
			showProfileLink: true,
			showTimestamp: true,
			search: prefs.twittersearch,
		});	
		setTimeout(ui.getTweets, 120*1000);
	},
	wire: {
		start: function(){
			$("#playControl").unbind();
			$("#playControl").click(function () { 
				ui.startPlayer();
		    });
			$("#playControl img").attr("src", "/images/player-start.png");
		},
		stop: function(){
			$("#playControl").unbind();
			$("#playControl").click(function () { 
					ui.stopPlayer();
			});	
			$("#playControl img").attr("src", "/images/player-stop.png");
		},
		buffering: function(){
			$("#playControl").unbind();
			$("#playControl").click(function() { 
					alert("Buffering...");
			});	
			$("#playControl img").attr("src", "/images/visualization.png");
		}
	},
	e: {
		record: function(e){
			var file = e.target;
			$(this).log("record callback: "+ file.nativePath);
			radio.record(file);
			$("#playControl").click(function () { 
					ui.stopRecord();
			});	
			$("#playControl img").attr("src", "/images/record.png");
		}
	},
}