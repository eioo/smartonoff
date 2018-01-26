let socket = io();
let chart;
let pricesTemp;

function createChart(goals = []) {
    let yLimit = 0;

    if (pricesTemp.limit.type === 'cheapestPrices') {
        if (pricesTemp.limit.value) {
            let cheapest = getCheapestHours(pricesTemp.limit.value, returnSorted = false);
            yLimit = cheapest[cheapest.length - 1].price;
        }
    
    } else if (pricesTemp.limit.type === 'under') {
        yLimit = pricesTemp.limit.value;
    }


    const options = {
        element: 'price-chart',
        data: pricesTemp.prices,

        xkey: 'hour',
        ykeys: ['price'],
        labels: ['Price'],

        hideHover: 'auto',
        hoverCallback: (index, options, content, row) => {
            return `<h4>Klo ${row.hour}:00</h4><strong>Hinta:</strong> ${row.price.toFixed(2)} snt/kWh`;    
        },

        parseTime: false,
        resize: true,
        xLabelMargin: 5,
        
        goals: goals,
        goalLineColors: ['#ff0000'],
        checkYValues: "lteg", // Lower than / equal (<=)
        yValueCheck: yLimit,
        yValueCheckColor: "#F47474"
    };

    return new Morris.Line(options);
}

function updateChart() {
    
}

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
    return pricesTemp.prices.filter(price => price.price <= limit)
        .map((elem) => {
            return elem.hour;
        })
        .sort((a, b) => {
            return a - b;
        });
}

function getCheapestHours(howMany, returnSorted=true) {
    let cheapest = pricesTemp.prices
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

function clickHandler() {
    $('#btn-set-limit').click((event) => {
        event.preventDefault();
        
        const newValue = $('#settings-limit-input').val();

        if (isNumber(newValue)) {
            const newLimit = {
                type: 'under',
                value: parseFloat(newValue)
            };

            socket.emit('set limit', newLimit);
            pricesTemp.limit = newLimit;

            // Update UI
            if (newLimit.value > 0) {
                showNotification('Rajoitus asetettu! (' + newLimit.value + ' snt/kWh)');
            } else {
                showNotification('Rajoitus poistettu käytöstä', 'danger');
            }

            updateUI();
        } else {
            showNotification('Arvo ei kelpaa!', 'danger');
        }
    });

    $(document).on('change', '#hour-selector', () => {
        const newLimit = {
            type: 'cheapestPrices',
            value: parseFloat($('#hour-selector').val())
        };

        socket.emit('set limit', newLimit);
        pricesTemp.limit = newLimit;

        if (newLimit.value > 0) {
            showNotification('Rajoitus asetettu! (' + $('#hour-selector').val() + ' halvinta)');
        } else {
            showNotification('Rajoitus poistettu käytöstä', 'danger');
        }
        updateUI();
    });
}

function showNotification(text, style = 'info') {
    const newHtml = `
            <div style='display: none;' class='notification alert alert-fixed alert-${style}'>
                ${text}
            </div>
        `;

    if ($('.notification').length == 0) {
        // Create new element
        $('body').append(newHtml);
    } else {
        // Replace existing
        $('.notification ').replaceWith(newHtml);
    }

    $('.notification ').fadeIn(500, () => {
        setTimeout(() => {
            $('.notification ').fadeOut(500, () => {
                $('.notification ').remove();
            });
        }, 2500);
    });
}


function updateUI() {
    // Pricelimit changed
    if (pricesTemp.limit.type === 'under') {
        if (pricesTemp.limit.value !== chart.options.goals) {
            if (pricesTemp.limit.value > 0) {
                chart.options.yValueCheck = pricesTemp.limit.value;
                chart.options.goals = [pricesTemp.limit.value];
            } else {
                chart.options.yValueCheck = 0;
                chart.options.goals = [];
            }
        }

        chart.redraw();

    } else if (pricesTemp.limit.type === 'cheapestPrices') {
        let yLimit = 0;

        if (pricesTemp.limit.value) {
            let cheapest = getCheapestHours(pricesTemp.limit.value, returnSorted = false);
            yLimit = cheapest[cheapest.length - 1].price;
        }
        
        chart.options.yValueCheck = yLimit;
        chart.options.goals = [];
        
        chart.redraw();
    }
      
      /* Infobox */
    const pricesWithoutHours = pricesTemp.prices.map((price) => { return price.price });

    const highest = Math.max(...pricesWithoutHours).toFixed(2);
    const lowest  = Math.min(...pricesWithoutHours).toFixed(2);
    const median  = getMedian(pricesWithoutHours).toFixed(2);
    const average = getAverage(pricesWithoutHours).toFixed(2);

    $('#info-highest-price').html(highest + ' snt/kWh');
    $('#info-lowest-price').html(lowest + ' snt/kWh');
    $('#info-median-price').html(median + ' snt/kWh');
    $('#info-average-price').html(average + ' snt/kWh');

    /* Settings */
    const priceLimitInput       = $('#settings-limit-input');
    const priceLimitElement     = $('#settings-limit');
    const activeHoursElement    = $('#settings-active-hours');

    const tempValue = pricesTemp.limit.value;

    if (pricesTemp.limit.type === 'under') {
        // Nykyinen rajoitus
        if (pricesTemp.limit.value > 0) {
            priceLimitElement.html(tempValue.toFixed(2) + ' snt/kWh');
            priceLimitInput.val(tempValue.toFixed(2));
        } else {
            priceLimitElement.html('Ei asetettu');
        }

        // Aktiiviset tunnit
        const activeHours = getActiveHours(tempValue).join(', ');
    
        if (activeHours) {
            activeHoursElement.html(activeHours);
        } else {
            activeHoursElement.html('Ei aktiivinen');
        }
    } else if(pricesTemp.limit.type === 'cheapestPrices') {
        // Nykyinen rajoitus
        if (pricesTemp.limit.value > 0) {
            priceLimitElement.html(pricesTemp.limit.value + ' halvinta tuntia');
        } else {
            priceLimitElement.html('Ei asetettu');
        }

        // Aktiiviset tunnit
        const activeHours = getCheapestHours(tempValue).join(', ');
        
        if (activeHours) {
            activeHoursElement.html(activeHours);
        } else {
            activeHoursElement.html('Ei aktiivinen');
        }
    } else {
        priceLimitElement.html('Ei asetettu');
        activeHoursElement.html('Ei aktiivinen');
    }

}

function socketHandler() {
    socket.on('prices', (prices) => {
        pricesTemp = prices;
        
        if (!chart) {
            if (pricesTemp.limit.type === 'under') {
                chart = createChart([pricesTemp.limit.value])
            } else {
                chart = createChart();
            }
        }

        updateUI();
    });
}

$(() => {
    socketHandler();
    clickHandler();
});