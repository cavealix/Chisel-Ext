//Fetch cleaning process
    function logResult(result) {
    console.log(result);
    
    chrome.runtime.sendMessage(
        {from: 'background', subject: 'elevation', data: result});
  }
  function logError(error) {
    console.log('Looks like there was a problem: \n', error);
  }
  function validateResponse(response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  }
  function readResponseAsJSON(response) {
    return response.json();
  }
  function fetchJSON(pathToResource) {
    fetch(pathToResource) // 1
    .then(validateResponse) // 2
    .then(readResponseAsJSON) // 3
    .then(logResult) // 4
    .catch(logError);
  }

  //fetch api call JSON for content script
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    // First, validate the message's structure.
    if ((msg.from === 'alltrails') && (msg.subject === 'fetchJSON')) {
      console.log(msg);
      var url = "https://maps.googleapis.com/maps/api/elevation/json?locations="+msg.lat+','+msg.lon+"&key=AIzaSyA6vPQadfKIysVDgq0so6T3-OReZbIfBa4";
      console.log(url);
      sendResponse(fetchJSON(url));
    }
  });
  

//run for alltrails
chrome.runtime.onMessage.addListener((msg, sender) => {
  // First, validate the message's structure.
  if ((msg.from === 'alltrails') && (msg.subject === 'showPageAction')) {
    // Enable the page-action for the requesting tab.
    chrome.pageAction.show(sender.tab.id);
  }
});

