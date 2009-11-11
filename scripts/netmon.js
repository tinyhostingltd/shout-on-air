var netmon = {
	networkMonitor: null,
	monitorURL: null,
	init: function(){
		air.NativeApplication.nativeApplication.addEventListener(air.Event.NETWORK_CHANGE, this.onNetworkChange);
		this.monitorURL = prefs.streamurl +":"+ prefs.streamport;
	},
	onNetworkChange: function(e){
		$(this).log("Network Change");
		try { //Check resource availability 
			netmon.networkMonitor = new air.URLMonitor(new air.URLRequest(this.monitorURL));
			netmon.networkMonitor.addEventListener(air.StatusEvent.STATUS, netmon.alertNetworkChange);
			netmon.networkMonitor.start();
		} 
		catch (err) {
			$(this).log("Error communicating with " + this.monitorURL);
		}
	},
	alertNetworkChange: function(e){
		$(this).log("Network available = " + netmon.networkMonitor.available);
		if (netmon.networkMonitor.available) 
			ui.startPlayer();
		else {
			ui.stopPlayer();
			$(this).log("Can not find: " + monitorURL);
			$("#playControl img").attr("src", "/images/disconnect.png");
		}
	}
}

