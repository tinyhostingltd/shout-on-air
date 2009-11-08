/**
 * @author Courtenay Probert
 */
$(document).ready(function() {
				
	var player1 = new radio();
	//var player2 = new radio();
	player1.load();
	player1.play();//default play
	air.SoundMixer.soundTransform = new air.SoundTransform(prefs.startingvol, 0); //Set global sound level to 80%
	
	// This toggles the players to clean the memory perodicaly (3 hours)
	$(document).everyTime((10800 * 1000), function(i){
		if (player1.playing) {
			//air.trace("loading player 2");
			player2.load();
		    //air.trace("playing player 2");
			player2.play();
			//player1.channel = new air.SoundTransform(0.1, 0);
			//air.trace("Stoping player 1");
			player1.stop();
		}
		else{
			//air.trace("loading player 1");
			player1.load();
		    //air.trace("playing player 1");
			player1.play();
			//player2.channel = new air.SoundTransform(0.1, 0);
			//air.trace("Stoping player 2");
			player2.stop();
		}
	});
	
	$("#slider").slider({
		value: prefs.startingvol * 100,
		min: 0,
		max: 100,
	   	change: function(event, ui) {
			var mypos = $('#slider').slider("value") / 100;
			//air.trace(mypos);
			air.SoundMixer.soundTransform = new air.SoundTransform(mypos, 0);
		}
	});
	
	$("#play").click(function () { 
		$("#play").hide();
		$("#stop").show();
		player1.play();
    });
	
	$("#stop").click(function () { 
		$("#stop").hide();
		$("#play").show();
		
		if (player1.playing)
			player1.stop();
		
		//if (player2.playing)
		//	player2.stop();
    });
});


function getTweets(){
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
}

$(document).ready(function() {
	getTweets();
	var ms2s = 120 * 1000 //convert miliseconds to seconds
	$(document).everyTime(ms2s, function(i){
		getTweets();
	});
});