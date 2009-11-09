/**
 * @author Courtenay Probert
 */

var player1 = new radio();
var player2 = new radio();

function stopPlayer(){
	$("#stop").hide();
	$("#play").show();
	
	if (player1.playing)
		player1.stop();
	
	if (player2.playing)
		player2.stop();
}
function startPlayer(){
	stopPlayer();
	$("#play").hide();
	$("#stop").show();
	player1.load();
	player1.play();
}

$(document).ready(function() {
	player1.load();
	//playSound("/sound/jingle.mp3"); // Should add intro jingle here
	player1.play();//default play
	air.SoundMixer.soundTransform = new air.SoundTransform(prefs.startingvol(), 0); //Set global sound level to 80%
	
	// This toggles the players to clean the memory perodicaly (1 hours [3600 secs])
	$(document).everyTime((3600 * 1000), function(i){
		if (i == 3) {
			$(this).log("Refreshing window...");
			window.location.reload(true); //Theres an air problem with loading too many sound objects
		}
			
		$(this).log("Swaping players.  Iteration: "+ i);
		
		if (player1.playing) {
			player2.load()//.log("loading player 2");
			player2.play(function(){
				//player1.channel = new air.SoundTransform(0.1, 0);
				air.trace("Stoping player 1");
				player1.stop();
			})//.log("playing player 2");
		}
		else{
			player1.load()//.log("loading player 1");
			player1.play(function(){
				//player2.channel = new air.SoundTransform(0.1, 0);
				//air.trace("Stoping player 2");
				player2.stop();	
			})//.log("playing player 1");
		}
	});
	
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
	
	$("#play").click(function () { 
		startPlayer();
    });
	
	$("#stop").click(function () { 
		stopPlayer();
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