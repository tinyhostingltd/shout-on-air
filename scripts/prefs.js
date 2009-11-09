/**
 * @author cprobert
 */
var prefs = {
	stationname: "",
	weburl: "",
	streamurl: "",
	streamport: 80,
	buffersize: 1024,
	twitterusername: "",
	header: "",
	debug: false,
	init: function(){
		this.debug = true;
		this.stationname = "DapperFM";
		this.weburl = "http://www.dapperfm.co.uk";
		this.streamurl = "http://93.89.82.244";
		this.streamport = 8096;
		this.buffersize = 800;
		this.twitterusername = "dapperfm";
		this.header = "<h1>Dapper <em style='color:#5E7E19;'>FM</em></h1><h2>&nbsp; &nbsp; &nbsp; our community <br /> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; your radio station</h2>";
	},
	startingvol: function(volume){
		if(volume){ //Set
			var data = new air.ByteArray(); // Peristant save the volume to the users 
			data.writeUTFBytes(volume);
			air.EncryptedLocalStore.setItem('volume', data);
			return volume;
		}
		else { //Get
			volume = air.EncryptedLocalStore.getItem('volume');
			if (volume) 
				return volume.readUTFBytes(volume.bytesAvailable);
			else 
				return 0.8;
		}
	}
}
