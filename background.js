function customMailtoUrl() {
    if (window.localStorage == null)
      return "";
    if (window.localStorage.customMailtoUrl == null)
      return "";
    return window.localStorage.customMailtoUrl;
  }
  
  function executeMailto(tab_id, subject, body, selection) {
    var default_handler = customMailtoUrl().length == 0;
  
    var action_url = "mailto:?"
        if (subject.length > 0)
          action_url += "subject=" + encodeURIComponent(subject) + "&";
  
    if (body.length > 0) {
      action_url += "body=" + encodeURIComponent(body);
  
      
      if (selection.length > 0) {
        action_url += encodeURIComponent("\n\n") +
            encodeURIComponent(selection);
      }
    }
  
    if (!default_handler) {
      
      var custom_url = customMailtoUrl();
      action_url = custom_url.replace("%s", encodeURIComponent(action_url));
      console.log('Custom url: ' + action_url);
      chrome.tabs.create({ url: action_url });
    } else {
      
      console.log('Action url: ' + action_url);
      chrome.tabs.update(tab_id, { url: action_url });
    }
  }
  
  chrome.runtime.onConnect.addListener(function(port) {
    var tab = port.sender.tab;
  
    
    port.onMessage.addListener(function(info) {
      var max_length = 1024;
      if (info.selection.length > max_length)
        info.selection = info.selection.substring(0, max_length);
      executeMailto(tab.id, info.title, tab.url, info.selection);
    });
  });
  
  
  chrome.browserAction.onClicked.addListener(function(tab) {

    if (tab.url.indexOf("http:") != 0 &&
        tab.url.indexOf("https:") != 0) {
      executeMailto(tab.id, "", tab.url, "");
   } else {
      chrome.tabs.executeScript(null, {file: "content_script.js"});
    }
  });
  
    
  
  