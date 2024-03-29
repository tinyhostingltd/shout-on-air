/**
 * @author cprobert
 */
// App Methods
function SetUpSysTray(){
	if (air.NativeApplication.supportsSystemTrayIcon) {
		window.nativeWindow.addEventListener(runtime.flash.events.NativeWindowDisplayStateEvent.DISPLAY_STATE_CHANGING, nwMinimized);
		
		window.nativeWindow.addEventListener(runtime.flash.events.Event.CLOSING, exit);
		air.NativeApplication.nativeApplication.addEventListener(air.Event.EXITING, ShutDown);
		
		var iconLoader = new runtime.flash.display.Loader();
		iconLoader.contentLoaderInfo.addEventListener(air.Event.COMPLETE, iconLoadComplete);
		iconLoader.load(new air.URLRequest("icons/Logo-16.png"));
		
		air.NativeApplication.nativeApplication.icon.addEventListener("click", function(event){
			Dock();
		});
	}
}
// Event Handlers
function iconLoadComplete(event){
	if(air.NativeApplication.supportsSystemTrayIcon){
			air.NativeApplication.nativeApplication.icon.bitmaps = new Array(event.target.content.bitmapData);
			air.NativeApplication.nativeApplication.icon.tooltip = "Shout-On-Air";
			air.NativeApplication.nativeApplication.icon.menu = new air.NativeMenu();
			
				// Create Menu Items
				var openCommand = new air.NativeMenuItem("Toggle");
				openCommand.addEventListener(air.Event.SELECT,function(event){
					Dock();
				});
				
				// Player specific
				var playCommand = new air.NativeMenuItem("Play");
				playCommand.addEventListener(air.Event.SELECT,function(event){
					ui.startPlayer();
				});
				
				var stopCommand = new air.NativeMenuItem("Stop");
				stopCommand.addEventListener(air.Event.SELECT,function(event){
					ui.stopPlayer();
				});
				// End player specific
				
				var sep = new air.NativeMenuItem("", true);
				
				var exitCommand = new air.NativeMenuItem("Exit");
				exitCommand.addEventListener(air.Event.SELECT,function(event){
					air.NativeApplication.nativeApplication.exit();
				});
				
			// Add Items to menu
			air.NativeApplication.nativeApplication.icon.menu.addItem(openCommand);
			air.NativeApplication.nativeApplication.icon.menu.addItem(playCommand);
			air.NativeApplication.nativeApplication.icon.menu.addItem(stopCommand);
			air.NativeApplication.nativeApplication.icon.menu.addItem(sep);
			air.NativeApplication.nativeApplication.icon.menu.addItem(exitCommand);
	}
}
// Overrides
/* On Native Window Minimized */
function nwMinimized(nativeWindowDisplayStateEvent) {
	if(nativeWindowDisplayStateEvent.afterDisplayState == runtime.flash.display.NativeWindowDisplayState.MINIMIZED) {
		nativeWindowDisplayStateEvent.preventDefault();
		Dock();
	}
}
// Util Methods
function ShutDown(){
	//cleanup code
	var x = nativeWindow.x;
	prefs.winx(x);
	$(this).log("x: "+ x);
	var y = nativeWindow.y;
	prefs.winy(y);
	$(this).log("y: "+ y);
	$(this).log("ShutDown!");
}
function exit(){
	var exitingEvent = new air.Event(air.Event.EXITING, false, true);
	air.NativeApplication.nativeApplication.dispatchEvent(exitingEvent);
	if (!exitingEvent.isDefaultPrevented()) { 
        air.NativeApplication.nativeApplication.exit(); 
    }
}
function Dock() {
	window.nativeWindow.visible = !window.nativeWindow.visible;
}