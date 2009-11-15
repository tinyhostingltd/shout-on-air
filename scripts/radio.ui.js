/**
 * @author Courtenay Probert
 */
var ui = {
	init: function(){
		document.title = prefs.stationname;
		$("#header").html(prefs.header);
		
		this.setupslider();
		this.getTweets();
		this.getTweets();
		
		$.ctrl('R', function() {
		    ui.startRecord();
		});
		try {
			nativeWindow.x = (air.Screen.mainScreen.bounds.width - 300)
			nativeWindow.y = (air.Screen.mainScreen.bounds.height - 580)
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
		$(this).log("startRecord clicked");	
		$("#playControl").unbind();
		shoutcastradio.stop(function(){
			radio.name = prefs.stationname;
			radio.init(prefs.streamurl + ":" + prefs.streamport);
			radio.load();
			radio.record();
			$("#playControl").click(function () { 
					ui.stopRecord();
			});	
			$("#playControl img").attr("src", "/images/record.png");
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
			showTimestamp: true
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
	}
}