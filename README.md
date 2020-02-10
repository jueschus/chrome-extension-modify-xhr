# chrome-extension-modify-xhr
Chrome Extension to overwrite and modify XHR (XMLHttpRequest)

## Add Extension

- Open chrome://extensions/
- Switch on "Developer mode"
- Click "Load unpacked extension…"
- Select .../chrome-extension-modify-xhr/src

## Use Extension

Open Chrome Devtools and switch to **XHR-Modifier**.
Add `URL` and Response `BODY` (as JSON) for whatever Service Call you like to mock.<br>
Open or Refresh (**!**) the Site where the Response should be mocked, click or navigate to wherever the Service is called -> Response will be replaced with the mocked Body.
