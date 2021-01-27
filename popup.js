// Update the relevant fields with the new data.
const setDOMInfo = trailData => {
  document.getElementById('trail_name').textContent = trailData.name;
  document.getElementById('latitude').textContent = trailData.latitude;
  document.getElementById('longitude').textContent = trailData.longitude;
  document.getElementById('elev_gain').textContent = trailData.elev_gain;
  document.getElementById('length').textContent = trailData.length;
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

//fetch api call JSON for content script
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  // First, validate the message's structure.
  if ((msg.from === 'background') && (msg.subject === 'elevation')) {
    document.getElementById('elevation').textContent = msg.data.results[0].elevation;
  }
});