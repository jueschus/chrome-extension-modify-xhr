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

    showReloadWarning();
    renderApis();
  } catch (e) {
    alert(`submitted data is not valid, please check again!`);
  }
});

renderApis = () => {
  const tableBodyElem = document.querySelector('tbody');
  let tableBodyStr = '';
  apis.forEach((elem, idx) => {
    // prettier-ignore
    tableBodyStr += `<tr>` +
                      `<td style="font-weight: bold;" id="del-line-${idx}"><span class="badge badge-pill badge-danger" style="cursor: pointer;">X</span></td>` +
                      `<td>${elem.url}</td>` +
                      `<td>${elem.body}</td>` +
                    `</tr>`;
  });
  tableBodyElem.innerHTML = tableBodyStr;

  addDelListeners();
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.name === 'xhr-modifier') {
    if (request.cmd === 'ready') {
      console.log(`content script is "ready" -> send mocking apis...`);
      hideReloadWarning();
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

function showReloadWarning() {
  document.querySelector('#refresh-warning').style.display = 'block';
}

function hideReloadWarning() {
  document.querySelector('#refresh-warning').style.display = 'none';
}

function addDelListeners() {
  document.querySelectorAll('td[id*=del-line-]').forEach(elem => {
    elem.addEventListener('click', event => {
      const id = event.target.id.substring(9);
      apis.splice(id, 1);
      renderApis();
      showReloadWarning();
    });
  });
}
