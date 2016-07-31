function init() {
    var price = chrome.extension.getBackgroundPage().selectedPrice;

    if (price)
        displayPriceDetails(price);
}

function displayPriceDetails(priceInfo) {
    document.getElementById('shippingPriceLabel').textContent = "ჩამოტანის ღირებულება:";
    document.getElementById('shippingPrice').textContent = priceInfo.price.toFixed(2) + " USD";

    var weightDescription = "წონა: " + priceInfo.metricWeight.toFixed(2) + " კგ. ";

    weightDescription += priceInfo.weightType == 0 ? "(რეალური)" : "(მოცულობითი)";

    document.getElementById('shippingWeight').textContent = weightDescription;

    var otherWeight = priceInfo.weightType == 0 ? priceInfo.dimension : priceInfo.shipping;
    var otherPriceDescription;

    if (otherWeight) {
        otherPriceDescription = otherWeight.weightType == 0 ? "რეალური" : "მოცულობითი";
        otherPriceDescription += " წონა: ";
        otherPriceDescription += otherWeight.metricWeight.toFixed(2);
        otherPriceDescription += " კგ. ჩამოტანის ღირებულება: ";
        otherPriceDescription += otherWeight.price.toFixed(2);
        otherPriceDescription += " USD";
    } else {
        otherPriceDescription = priceInfo.weightType == 0 ? "მოცულობითი" : "რეალური";
        otherPriceDescription += " წონა უცნობია";
    }

    document.getElementById('otherWeightInfo').textContent = otherPriceDescription;
}

window.onload = init;
