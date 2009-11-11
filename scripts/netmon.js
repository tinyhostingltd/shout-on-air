air.NativeApplication.nativeApplication.addEventListener(air.Event.NETWORK_CHANGE, onNetworkChange);

var networkMonitor;	
var monitorURL = prefs.streamurl +":"+ prefs.streamport;
function onNetworkChange(e){
	$(this).log("Network Change");
	
	try { //Check resource availability 
		networkMonitor = new air.URLMonitor(new air.URLRequest(monitorURL));
		networkMonitor.addEventListener(air.StatusEvent.STATUS, alertNetworkChange);
		networkMonitor.start();
	} 
	catch (err) {
		$(this).log("Error communicating with " + prefs.monitorURL);
	}
}
function alertNetworkChange(e){
	$(this).log("Network available = " + networkMonitor.available);
	if (networkMonitor.available) 
		ui.startPlayer();
	else {
		ui.stopPlayer();
		$(this).log("Can not find: "+ monitorURL);
		$("#playControl img").attr("src", "/images/disconnect.png");	
	}
}

onNetworkChange(true); //check if available