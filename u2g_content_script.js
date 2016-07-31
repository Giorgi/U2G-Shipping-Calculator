if (window == top) {
    chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
        sendResponse(findWeight());
    });
}

Weights = {
    pound: 0.453,
    ounce: 0.0283,
}

var findWeight = function () {
    var foundWeightNode;
    var foundDimensionsNode;
    var shippingWeightRegex = /shipping weight: ([0-9.]+) ([a-z]+)/i;
    var dimensionsRegex = /product dimensions:[ \s]*([0-9.]+)[ x]+([0-9.]+)[ x]+([0-9.]+) ([a-z]+)/im;
    var shippingWeightRegex2 = /shipping weight[ \s]*([0-9.]+) ([a-z]+)/i;
    var dimensionsRegex2 = /product dimensions[ \s]*([0-9.]+)[ x]+([0-9.]+)[ x]+([0-9.]+) ([a-z]+)/im;
    var node = document.body;
    var done = false;

    while (!done) {
        done = true;
        for (var i = 0; i < node.childNodes.length; ++i) {
            var child = node.childNodes[i];
            if (child.textContent.match(shippingWeightRegex)) {
                node = child;
                foundWeightNode = node;
                done = false;
                break;
            }
        }
    }

    var node = document.body;
    var done = false;

    while (!done) {
        done = true;
        for (var i = 0; i < node.childNodes.length; ++i) {
            var child = node.childNodes[i];
            if (child.textContent.match(dimensionsRegex)) {
                node = child;
                foundDimensionsNode = node;
                done = false;
                break;
            }
        }
    }

    var shippingWeight;
    var dimensionWeight;

    if (foundWeightNode) {
        var match = shippingWeightRegex.exec(foundWeightNode.textContent);
        if (match && match.length) {
            shippingWeight = extractShippingWeight(match);
        } else {
            console.log("bad initial match: " + foundWeightNode.textContent);
        }
    }

    if (foundDimensionsNode) {
        var match = dimensionsRegex.exec(foundDimensionsNode.textContent);
        if (match && match.length) {
            dimensionWeight = extractDimensionWeight(match);
        } else {
            console.log("bad initial match: " + foundDimensionsNode.textContent);
        }
    }

    if (!foundDimensionsNode && !foundWeightNode) {
        var elements = document.getElementsByClassName('prodDetTable');

        for (var i = 0; i < elements.length; i++) {
            var text = elements[i].textContent;
            var dimensionsMatch = dimensionsRegex2.exec(text);
            var shippingWeightMatch = shippingWeightRegex2.exec(text);

            if (!dimensionWeight && dimensionsMatch && dimensionsMatch.length) {
                dimensionWeight = extractDimensionWeight(dimensionsMatch);
            }

            if (!shippingWeight && dimensionsMatch && dimensionsMatch.length) {
                shippingWeight = extractShippingWeight(shippingWeightMatch);
            }

            if (dimensionWeight && shippingWeight) {
                break;
            }
        }
    }

    var result = {
        shipping: shippingWeight,
        dimension: dimensionWeight
    };

    if (shippingWeight && dimensionWeight) {
        if (shippingWeight.price > dimensionWeight.price) {
            buildWeightInfo(result, shippingWeight);
        } else {
            buildWeightInfo(result, dimensionWeight);
        }
    } else {
        var weight = shippingWeight || dimensionWeight;

        if (weight) {
            buildWeightInfo(result, weight);
        } else {
            return null;
        }
    }

    return result;
}

function buildWeightInfo(target, source) {
    target.weightType = source.weightType;
    target.metricWeight = source.metricWeight;
    target.price = source.price;
    target.formattedPrice = "USA2Georgia Shipping Price: " + target.price.toFixed(2) + " USD";
}

function extractDimensionWeight(match) {
    var dimensionWeight = {
        weightType: 1,
        weight: Number(match[1]) * Number(match[2]) * Number(match[3]) / 166,
    };

    dimensionWeight.metricWeight = dimensionWeight.weight * Weights["pound"];
    dimensionWeight.price = dimensionWeight.metricWeight * 8;

    return dimensionWeight;
}

function extractShippingWeight(match) {
    var shippingWeight = {
        weightType: 0,
        weight: Number(match[1]),
        unit: match[2].toLowerCase().replace(/s+$/g, ''),
    };

    shippingWeight.metricWeight = shippingWeight.weight * Weights[shippingWeight.unit];
    shippingWeight.price = shippingWeight.metricWeight * 8;

    return shippingWeight;
}
