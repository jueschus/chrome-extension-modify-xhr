chrome.devtools.panels.create('XHR-Modifier', null, '/html/panel.html', () => {
  chrome.devtools.inspectedWindow.eval(`console.log('XHR-Modifier created');`);
});
