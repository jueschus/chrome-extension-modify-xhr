chrome.devtools.panels.create(
  "Response-Modifier",
  null,
  "/html/panel.html",
  () => {
    chrome.devtools.inspectedWindow.eval(
      `console.log('Response-Modifier created');`
    );
  }
);
