
function getMedian(arr) {
    arr.sort((a, b) => a - b);
    let lowMiddle = Math.floor((arr.length - 1) / 2);
    let highMiddle = Math.ceil((arr.length - 1) / 2);
    let median = (arr[lowMiddle] + arr[highMiddle]) / 2;
    return median;
}

function getAverage(arr) {
    let sum = arr.reduce((previous, current) => current += previous);
    let avg = sum / arr.length;
    return avg;
}

function isNumber(num) {
    return !isNaN(num);
}

function getActiveHours(limit) {
    return pricesTemp.prices.hourly.filter(price => price.price <= limit)
        .map((elem) => {
            return elem.hour;
        })
        .sort((a, b) => {
            return a - b;
        });
}

function getCheapestHours(howMany, returnSorted=true) {
    let cheapest = pricesTemp.prices.hourly
        .concat() // Copy array
        .sort((a,b) => {
            return (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0);
        })
        .slice(0, howMany);

    if (returnSorted) {
        cheapest = cheapest.map((price) => {
            return parseFloat(price.hour);
        })
        .sort((a, b) => {
            return a - b;
        });
    }

    return cheapest;
}