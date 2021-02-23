let processButton = document.getElementById('process');
let charsInput = document.getElementById('chars');
let resultsTextarea = document.getElementById('result');
let progressDiv = document.getElementById('progress');

let metadata = {};



processButton.onclick = (element) => {
  chrome.runtime.sendMessage({type: 'startProcess', data: charsInput.value });

  setInterval(() => {
    chrome.runtime.sendMessage({type: 'getUpdate'}, function({status, searchKeys, metadata} = {}) {
      resultsTextarea.value = JSON.stringify(searchKeys, null, 2);

      let i = 0;
      if (status === 'generatingKeys') {
        i = metadata.currentTerm / metadata.terms;
      } else if (status === 'counting') {
        i = metadata.currentCount / metadata.totalCount;
      }

      progressDiv.setAttribute('style', "width: " + (i * 100) + "%;")

    });
  }, 1000);
}


