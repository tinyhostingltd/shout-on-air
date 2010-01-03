/**
 * @author cprobert
 */
window.name = "Shout-On-Air";

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

function batchWireLinks(id){
	$(id +" a:external").each(function(i){
		$(this).log("Adding click to link: "+ $(this).attr('href'));
		$(this).click(function(e){
			openInBrowser($(this).attr('href'));
			e.preventDefault();
		});
	});
}

function playSound(sound){
	var file = air.File.applicationDirectory.resolvePath(sound);
	var mp3 = new air.Sound(new air.URLRequest(file.url));
	mp3.play();
}

/**
 * The "bind()" function extension from Prototype.js, extracted for general use
 *
 * @author Richard Harrison, http://www.pluggable.co.uk
 * @author Sam Stephenson (Modified from Prototype Javascript framework)
 * @license MIT-style license @see http://www.prototypejs.org/
 */
Function.prototype.bind = function(){
    // http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Functions:arguments
    var _$A = function(a){return Array.prototype.slice.call(a);}

    if(arguments.length < 2 && (typeof arguments[0] == "undefined")) return this;

    var __method = this, args = _$A(arguments), object = args.shift();

    return function() {
      return __method.apply(object, args.concat(_$A(arguments)));
    }
}

Date.prototype.getDateTimeStamp = function(){
	var daynames = new Array( "Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
	var monthnames = new Array( "January","February","March","April","May","June","July","August","September","October","November","December");
	return daynames[this.getDay()] +"."+ this.getDate() +"."+ monthnames[this.getMonth()] +"."+ this.getFullYear() +"."+ this.getHours() +"."+ this.getMinutes();
}

$.ctrl = function(key, callback, args) {
    $(document).keydown(function(e) {
        if(!args) args=[]; // IE barks when args is null
        if(e.keyCode == key.charCodeAt(0) && e.ctrlKey) {
            callback.apply(this, args);
            return false;
        }
    });
};