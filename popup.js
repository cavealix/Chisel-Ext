// Update the relevant fields with the new data.
const setDOMInfo = info => {
  document.getElementById('trail_name').textContent = info.trailName;
  document.getElementById('latitude').textContent = info.initialCenter[0];
  document.getElementById('longitude').textContent = info.initialCenter[1];
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
    console.log(msg);
    document.getElementById('elevation').textContent = msg.data.results[0].elevation;
  }
});