var trailData = {};
var histWeather = {};


//Calculate Effort
function effort (user_elev, trail_elev, distance, gain) {

	//https://www.outsideonline.com/2315751/ultimate-backpacking-calorie-estimator
	//https://runnersconnect.net/high-altitude-training-running-performance/#:~:text=For%20every%20thousand%20feet%20of,per%201%2C000%20feet%20of%20altitude.
	
	// effort calc has two parts, additional effort by calories of incline compared to flat distance and 4.4% increased difficulty per 1000ft base elvation difference
	// ( 1 + cal of incline / cal of flat distance ) * base elev difference/1000 * 1.044   //   or *.96 if user is already higher than base elev
	
	let W = 180; // your weight (kg)
	let L = 10; // the weight of your pack (kg)
	let V = 2.5; // your hiking speed (m/s)
	let N = 1; // a “terrain factor” that adjusts the results for different surfaces (for example, a paved road has a terrain factor of 1.0, but a gravel road is 1.2, since it takes more calories to walk on a soft or uneven surface) 
	var effort = 0;

	var G = gain/distance*100; // the grade of any incline (%)

	//if user going to higher elevation
	if (user_elev <= trail_elev) {

		effort = Math.round(((1.5*W + 2*(W + L)*(L/W)^2 + N*(W + L)*(1.5*V^2 + 0.35*V*G)) / (1.5*W + 2*(W + L)*(L/W)^2 + N*(W + L)*(1.5*V^2)) * ((trail_elev - user_elev)/1000*1.044))*100);
 		console.log(effort);
    return effort;

	}
	else {

		effort = Math.round(((1.5*W + 2*(W + L)*(L/W)^2 + N*(W + L)*(1.5*V^2 + 0.35*V*G)) / (1.5*W + 2*(W + L)*(L/W)^2 + N*(W + L)*(1.5*V^2)) * ((user_elev - trail_elev)/1000*.956))*100);
 		//console.log(effort);
    return effort;

	}
}


//Get User Elevation
function geoSuccess(pos){

	//send url api call for User Elevation to background to avoid CORs restrictions
	chrome.runtime.sendMessage(
    	{from: 'alltrails', subject: 'getElevation', lat: pos.coords.latitude, lon: pos.coords.longitude}, (response) => {
    		// ...also specifying a callback to be called 
    		//from the receiving end (content script).
        console.log(response);
        trailData.user_elevation = Math.round(response.results[0].elevation);
    		//send elevation data to popup.js
    		chrome.runtime.sendMessage({from: 'alltrails', subject: 'user_elevation', data: response});
    });
}


//Get User Location
if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(geoSuccess);
}
else {
  console.log('prompt user for location access');
}


// Listen for messages from the popup.
chrome.runtime.onMessage.addListener((msg, sender, response) => {
  // First, validate the message's structure.
  if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {
    // Collect the necessary data. 

    //Read Trail Data
    if (document.getElementById('main')) {
      var content = document.getElementById('main').childNodes[1].childNodes[1].getAttribute("data-react-props");
      var contentData = JSON.parse(content);
    }

    //Get historical weather
    chrome.runtime.sendMessage(
      {from: 'alltrails', subject: 'getWeather', lat: contentData.initialCenter[0], lon: contentData.initialCenter[1]}, (response) => {
        // ...also specifying a callback to be called 
        //from the receiving end (content script).
        console.log(response);
        histWeather = response.data.weather;
    });


    // Directly respond to the sender (popup), 
    // through the specified callback.
    trailData.name = contentData.initialSelectedObject.name;
    trailData.duration_minutes = contentData.initialSelectedObject.duration_minutes;
    trailData.latitude = contentData.initialCenter[0];
    trailData.longitude = contentData.initialCenter[1];
    trailData.elev_gain = Math.round(contentData.initialSelectedObject.elevation_gain);
    trailData.length = Math.round(contentData.initialSelectedObject.length);
    trailData.elev_min = Math.round(contentData.initialExploreMap.routes[0].lineGeoStats.elevationMin);
    trailData.elev_max = Math.round(contentData.initialExploreMap.routes[0].lineGeoStats.elevationMax);
    trailData.elev_start = Math.round(contentData.initialExploreMap.routes[0].lineGeoStats.elevationStart);
    trailData.elev_end = Math.round(contentData.initialExploreMap.routes[0].lineGeoStats.elevationEnd);
    trailData.bounds = contentData.initialBounds;

    trailData.effort = effort(trailData.user_elevation,trailData.elev_start,trailData.length,trailData.elev_gain);


    //send reply of trail data back to popup.js
    response(trailData);
  }
});


// Inform the background page that 
// this tab should have a page-action.
chrome.runtime.sendMessage({
  from: 'alltrails',
  subject: 'showPageAction',
});

