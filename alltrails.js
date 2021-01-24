// Inform the background page that 
// this tab should have a page-action.
chrome.runtime.sendMessage({
  from: 'alltrails',
  subject: 'showPageAction',
});

// Listen for messages from the popup.
chrome.runtime.onMessage.addListener((msg, sender, response) => {
  // First, validate the message's structure.
  if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {
    // Collect the necessary data. 
    // (For your specific requirements `document.querySelectorAll(...)`
    //  should be equivalent to jquery's `$(...)`.)
    var domInfo = {
      total: document.querySelectorAll('*').length,
      inputs: document.querySelectorAll('input').length,
      buttons: document.querySelectorAll('button').length,
    };

    var rootElement = document.getElementById('desktop-header').childNodes[1].getAttribute("data-react-props");
    var rootData = JSON.parse(rootElement);
    console.log(rootData);

    var content = document.getElementById('main').childNodes[1].childNodes[1].getAttribute("data-react-props");
    var contentData = JSON.parse(rootElement);
    console.log(contentData.currentUser.username

    // Directly respond to the sender (popup), 
    // through the specified callback.
    response(domInfo);
  }
});