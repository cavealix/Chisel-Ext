// Inform the background page that 
// this tab should have a page-action.
chrome.runtime.sendMessage({
  from: 'alltrails',
  subject: 'showPageAction',
});

//message user coordinates to background to make API call
function geoSuccess(pos){
	console.log(pos);
	//send url api call to background to avoid CORs restrictions
	chrome.runtime.sendMessage(
    	{from: 'alltrails', subject: 'fetchJSON', lat: pos.coords.latitude, lon: pos.coords.longitude}, (response) => {
    		if(response){
    			console.log(response);
    		}
    	// ...also specifying a callback to be called 
    	//    from the receiving end (content script).
    });
}

//get user location
if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(geoSuccess);
}

// Listen for messages from the popup.
chrome.runtime.onMessage.addListener((msg, sender, response) => {
  // First, validate the message's structure.
  if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {
    // Collect the necessary data. 
    
    /*var rootElement = document.getElementById('desktop-header').childNodes[1].getAttribute("data-react-props");
    var rootData = JSON.parse(rootElement);
    console.log(rootData);*/

    //read trail data
    var content = document.getElementById('main').childNodes[1].childNodes[1].getAttribute("data-react-props");
    var contentData = JSON.parse(content);

    // Directly respond to the sender (popup), 
    // through the specified callback.
    var trailData = {
      name: contentData.initialSelectedObject.name,
      elev_gain: contentData.initialSelectedObject.elevation_gain,
      duration_minutes: contentData.initialSelectedObject.duration_minutes,
      latitude: contentData.initialCenter[0],
      longitude: contentData.initialCenter[1],
      length: contentData.initialSelectedObject.length
    };

    //send reply of trail data back to popup.js
    response(trailData);
  }
});