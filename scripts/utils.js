/**
 * @author cprobert
 */
jQuery.fn.log = function (msg) {
	if(prefs.debug)
      air.trace(msg);
    
	return this;
};

// Creating custom :external selector
$.expr[':'].external = function(obj){
    return !obj.href.match(/^mailto\:/)
            && (obj.hostname != location.hostname);
};
//// Add 'external' CSS class to all external links
//$('a:external').addClass('external');

function openInBrowser(url) {
	air.navigateToURL( new air.URLRequest(url)); 
}

function playSound(sound){
	var file = air.File.applicationDirectory.resolvePath(sound);
	var mp3 = new air.Sound(new air.URLRequest(file.url));
	mp3.play();
}