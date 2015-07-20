var prices = {};
var selectedPrice = null;
var selectedId = null;

function updatePrice(tabId) {
  chrome.tabs.sendRequest(tabId, {}, function (price) {
    prices[tabId] = price;
    if (!price) {
      chrome.pageAction.hide(tabId);
    } else {
      chrome.pageAction.show(tabId);
      if (selectedId == tabId) {
        updateSelected(tabId);
      }
    }
  });
}

function updateSelected(tabId) {
  selectedPrice = prices[tabId];
  if (selectedPrice)
    chrome.pageAction.setTitle({ tabId: tabId, title: selectedPrice.formattedPrice });
}

chrome.tabs.onUpdated.addListener(function (tabId, change, tab) {
  if (change.status == "complete") {
    updatePrice(tabId);
  }
});

chrome.tabs.onSelectionChanged.addListener(function (tabId, info) {
  selectedId = tabId;
  updateSelected(tabId);
});

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  updatePrice(tabs[0].id);
});
