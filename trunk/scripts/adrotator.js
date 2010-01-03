/**
 * @author cprobert
 */
var adrotator = {
	template: '<a id="ad${count}" href="${url}"><img src="${img}" width="280" height="50" /></a>',
	xmlfeed: 'ads.xml',
	init: function(){
		this.template = $.template(this.template);
		this.getAds();
	},
	getAds: function(){
		$.ajax({
			type: "GET",
			url: adrotator.xmlfeed,
			dataType: "xml",
			success: function(xml) {
				var count = 1;
				$(xml).find('ad').each(function(){
					//$(this).log("ad - url: "+ $(this).attr('url'));
					//$(this).log("ad - img: "+ $(this).attr('img'));
					
					$('#adspace').append(adrotator.template , {
					     'count': count,
						 'url': $(this).attr('url'),
					     'img': $(this).attr('img')
					});
					
					count++;
				});
				batchWireLinks("#adspace");
				adrotator.cycleAds();
			},
			error: function(XMLHttpRequest, textStatus, errorThrown){
				$(this).log("Error getting ads:", errorThrown);
			}
		});	
	},
	cycleAds: function(){
		$('#adspace').cycle({ 
		    fx:    'turnDown',
			random:  1,
			//pause: 1,
		    timeout: 30000
		}).log("Loading ads");
	}
}
