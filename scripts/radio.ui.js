/**
 * @author Courtenay Probert
 */
var ui = {
	init: function(){
		document.title = prefs.stationname;
		$("#header").html(prefs.header);
		
		this.setupslider();
		
		this.getTweets();
		//var ms2s = 120 * 1000 //convert miliseconds to seconds
		//$(document).everyTime(ms2s, function(i){
			ui.getTweets();
		//});
	},
	stopPlayer: function(){
		$(this).log("stopPlayer clicked");
		$("#playControl").unbind();
		shoutcastradio.stop(function(){
			$("#playControl").click(function () { 
				ui.startPlayer();
		    });	
			$("#playControl img").attr("src", "/images/player-start.png");		
		});
	},
	startPlayer: function(){
		$(this).log("startPlayer clicked");
		$("#playControl").unbind();
		$("#playControl img").attr("src", "/images/visualization.png");
		$("#playControl").click(function() { 
					alert("Buffering...");
		});	
		shoutcastradio.restart(function(){
			$("#playControl").unbind();
			$("#playControl").click(function () { 
					ui.stopPlayer();
			});	
			$("#playControl img").attr("src", "/images/player-stop.png");	
		});
		
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
	}
}