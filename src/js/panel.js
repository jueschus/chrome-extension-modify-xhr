console.log('init panel');
let apis = [];

const form = document.querySelector('#api-add-form');

form.addEventListener('submit', e => {
  e.preventDefault();
  console.log('submit event');
  const urlElem = document.querySelector('#api-add-url');
  const bodyElem = document.querySelector('#api-add-body');

  try {
    apis.push({
      url: urlElem.value,
      body: JSON.stringify(JSON.parse(bodyElem.value))
    });

    urlElem.value = '';
    bodyElem.value = '';

    document.querySelector('#refresh-warning').style.display = 'block';
    renderApis();
  } catch (e) {
    alert(`submitted data is not valid, please check again!`);
  }
});

renderApis = () => {
  const tableBodyElem = document.querySelector('tbody');
  let tableBodyStr = '';
  apis.forEach(elem => {
    tableBodyStr += `<tr><td>${elem.url}</td><td>${elem.body}</td></tr>`;
    // TODO add X to remove entry from table
  });
  tableBodyElem.innerHTML = tableBodyStr;
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.name === 'xhr-modifier') {
    if (request.cmd === 'ready') {
      console.log(`content script is "ready" -> send mocking apis...`);
      document.querySelector('#refresh-warning').style.display = 'none';
      sendResponse({ apis });
    }
  }
});

document.querySelector('#refresh-button').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.executeScript(tabs[0].id, {
      code: 'window.location.reload();'
    });
  });
});
