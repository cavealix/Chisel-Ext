// Update the relevant fields with the new data.
const setDOMInfo = trailData => {
  document.getElementById('trail_name').textContent = trailData.name;
  document.getElementById('latitude').textContent = trailData.latitude;
  document.getElementById('longitude').textContent = trailData.longitude;
  document.getElementById('elev_gain').textContent = Math.round(trailData.elev_gain*3.28084) + 'ft';
  document.getElementById('length').textContent = (trailData.length*0.000621371).toFixed(2) + 'mi';
  document.getElementById('user_elevation').textContent = Math.round(trailData.user_elevation*3.28084) +'ft';
  document.getElementById('effort').textContent = trailData.effort+'%';
  document.getElementById('feels_like').textContent = (trailData.effort/100 * trailData.length*0.000621371).toFixed(2) + 'mi';

  document.getElementById('start_elev').textContent = trailData.elev_start;
  document.getElementById('end_elev').textContent = trailData.elev_end;
  document.getElementById('max_elev').textContent = trailData.elev_max;
  document.getElementById('min_elev').textContent = trailData.elev_min;
};

// Once the DOM is ready...
window.addEventListener('DOMContentLoaded', () => {
  // ...query for the active tab...
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, tabs => {
    // ...and send a request for the DOM info...
    chrome.tabs.sendMessage(
        tabs[0].id,
        {from: 'popup', subject: 'DOMInfo'},
        // ...also specifying a callback to be called 
        //    from the receiving end (content script).
        setDOMInfo);
  });
});


/*let map;
const NEW_ZEALAND_BOUNDS = {
  north: -34.36,
  south: -47.35,
  west: 166.28,
  east: -175.81,
};

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    restriction: {
      latLngBounds: NEW_ZEALAND_BOUNDS,
      strictBounds: false,
    },
    zoom: 7,
  });
}*/

//receive user elevation
/*chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  // First, validate the message's structure.
    console.log(msg);
  if ((msg.from === 'alltrails') && (msg.subject === 'user_elevation')) {
    document.getElementById('user_elevation').textContent = Math.round(msg.data.results[0].elevation);
  }
});


//receive trail elevation
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  // First, validate the message's structure.
    console.log(msg);
  if ((msg.from === 'alltrails') && (msg.subject === 'trail_elevation')) {
    document.getElementById('trail_elevation').textContent = Math.round(msg.data.results[0].elevation);
  }
});*/

function metersToMiles ( distance ) {

  return distance*0.000621371;

}

function milesToMeters ( distance ) {

  return distance*1609.34;

}