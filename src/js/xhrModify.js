let apis = [];

function injectScript() {
  const oldScript = document.querySelector('#xhrModifyScript');
  if (oldScript) {
    oldScript.parentNode.removeChild(oldScript);
  }
  const xhrOverrideScript = document.createElement('script');
  xhrOverrideScript.type = 'text/javascript';
  xhrOverrideScript.id = 'xhrModifyScript';
  xhrOverrideScript.innerHTML = `
  (function() {
    console.log('inject xhrModifyScript');
    const apis = ${JSON.stringify(apis)};
    const getApi = function(url) {
      return apis.find(elem => url.indexOf(elem.url) !== -1);
    }

    const XHR = XMLHttpRequest.prototype;
    Object.defineProperty(XHR, 'response', {
        writable: true
    });
    const send = XHR.send;
    const open = XHR.open;
    XHR.open = function(method, url) {
        this.url = url; // the request url
        return open.apply(this, arguments);
    }
    XHR.send = function() {
        this.onreadystatechange = function() {
          if (this.readyState === 4 && getApi(this.url)) {
            const api = getApi(this.url);
            this.response = api.body;
            console.log('set response to ' + JSON.stringify(api.body));
          }
        };
        return send.apply(this, arguments);
    };
  })();
  `;
  document.head.prepend(xhrOverrideScript);
}

function checkForDOMAndInjectScript() {
  if (document.body && document.head) {
    injectScript();
  } else {
    requestIdleCallback(checkForDOMAndInjectScript);
  }
}

chrome.runtime.sendMessage({ name: 'xhr-modifier', cmd: 'ready' }, response => {
  if (!chrome.runtime.lastError) {
    if (response && response.apis && response.apis.length) {
      console.log('received apis: ' + JSON.stringify(response.apis));
      apis = response.apis;
      checkForDOMAndInjectScript();
    }
  }
});
