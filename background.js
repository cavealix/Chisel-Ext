//make API fetch and return as json
async function fetchJSON(pathToResource) {
  const res = await fetch(pathToResource); // 1
  //error handling
  if(res.ok){
    //console.log(res.json());
    return res.json();
  }
  else {
    console.log('Error with API fetch at '+pathToResource);
  }
}

//fetch Google Elevation API call JSON for content script
chrome.runtime.onMessage.addListener((msg, sender, response) => {
  // First, validate the message's structure.
  console.log(msg);
  if ((msg.from === 'alltrails') && (msg.subject === 'getElevation')) {
    var url = "https://maps.googleapis.com/maps/api/elevation/json?locations="+msg.lat+','+msg.lon+"&key=AIzaSyA6vPQadfKIysVDgq0so6T3-OReZbIfBa4";
    //request API fetch, wait to be fulfilled, then return result as original message response
    fetchJSON(url).then(response);  
    return true; 
  }
  else if ((msg.from === 'alltrails') && (msg.subject === 'getWeather')) {
    //build api call url
    //send to fetchJSON
    var d = new Date();
    var year = d.getFullYear()-1;
    var thisMonth = d.getMonth();
    var nextMonth = thisMonth+1;
    if (nextMonth == 13){
      nextMonth = 1
    }
    var date = d.getDate();

    var startDate = year+'-'+thisMonth+'-'+date;
    var endDate = year+'-'+nextMonth+'-'+date;

    var url = "https://api.worldweatheronline.com/premium/v1/past-weather.ashx?key=e39102d79fc74df3800213258211002&q="+msg.lat+","+msg.lon+"&format=json&date="+startDate+"&enddate="+endDate;
    //console.log(url);
    fetchJSON(url).then(response);
    return true;
  }
});
  

//show popup for alltrails.com
chrome.runtime.onMessage.addListener((msg, sender, response) => {
  // First, validate the message's structure.
  if ((msg.from === 'alltrails') && (msg.subject === 'showPageAction')) {
    // Enable the page-action for the requesting tab.
    chrome.pageAction.show(sender.tab.id);
  }
});

