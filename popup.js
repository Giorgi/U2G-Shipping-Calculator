function init() {
  var price = chrome.extension.getBackgroundPage().selectedPrice;

  if (price)
    displayPriceDetails(price);
}

function displayPriceDetails(priceInfo) {
  document.getElementById('shippingPriceLabel').textContent = "ჩამოტანის ღირებულება:";
  document.getElementById('shippingPrice').textContent = priceInfo.price.toFixed(2) + " USD";

  var weight = "წონა: " + priceInfo.metricWeight.toFixed(2) + " კგ. ";

  weight = weight.concat(priceInfo.weightType == 0 ? "(რეალური)" : "(მოცულობითი)")

  document.getElementById('shippingWeight').textContent = weight;
}

window.onload = init;
