console.log('init panel');
let apis = [];

const form = document.querySelector('#api-add-form');

form.addEventListener('submit', e => {
  e.preventDefault();
  console.log('submit event');
  const urlElem = document.querySelector('#api-add-url');
  const bodyElem = document.querySelector('#api-add-body');

  apis.push({
    url: urlElem.value,
    body: JSON.stringify(JSON.parse(bodyElem.value)) // todo add try/catch + error message
  });

  urlElem.value = '';
  bodyElem.value = '';

  renderApis();
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
      console.log(
        'received "ready" from content script -> send apis to mock: ' +
          JSON.stringify(apis)
      );
      sendResponse({ apis });
    }
  }
});
