/**
 * @author cprobert
 */
var prefs = {
	stationname: "",
	weburl: "",
	streamurl: "",
	streamport: 80,
	startingvol: .8,
	buffersize: 1024,
	twitterusername: "",
	header: "",
	init: function(){
		this.stationname = "DapperFM";
		this.weburl = "http://www.dapperfm.co.uk";
		this.streamurl = "http://93.89.82.244";
		this.streamport = 8096;
		this.startingvol = .8;
		this.buffersize = 1024;
		this.twitterusername = "dapperfm";
		this.header = "<h1>Dapper <em style='color:#5E7E19;'>FM</em></h1><h2>&nbsp; &nbsp; &nbsp; our community <br /> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; your radio station</h2>";
	}
}
