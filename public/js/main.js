let socket = io();
let chart;
let pricesTemp;

function createChart() {
    const options = {
        element: 'price-chart',
        data: pricesTemp.prices.hourly,

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
        
        goals: [],
        goalLineColors: ['#ff0000'],
        xValueCheck: [],
        xValueCheckColor: '#F47474'
    };

    return new Morris.Line(options);
}

function updateRelayInfo(relay) {
    const $limitLabel       = $('#relay-info #limit');
    const $activeHoursLabel = $('#relay-info #active-hours');

    if (relay.limit.type === 'cheaperThan') {
        if (relay.limit.value) {
            $limitLabel.html(relay.limit.value.toFixed(2) + ' snt/kWh');
            
            const activeHours = getActiveHours(relay.limit.value).join(', ');
            if (activeHours) {
                $activeHoursLabel.html(activeHours);
            } else {
                $activeHoursLabel.html('Ei aktiivisia tunteja');
            }

            chart.options.goals = [relay.limit.value];
            chart.options.xValueCheck = getActiveHours(relay.limit.value);
            chart.redraw();
        } else {
            chart.options.goals = [];
            chart.options.xValueCheck = [];
            chart.redraw();
        }
    }
    else if (relay.limit.type === 'cheapest') {
        if (relay.limit.value === 1) {
            $limitLabel.html('Vain halvin tunti');
        } else {
            $limitLabel.html(relay.limit.value + ' halvinta tuntia');
        }
        
        $activeHoursLabel.html(getCheapestHours(relay.limit.value, true).join(', '));
        chart.options.goals = [];
        chart.options.xValueCheck = getCheapestHours(relay.limit.value);
        chart.redraw();
    }
    else {
        $limitLabel.html('Ei asetettu');
        $activeHoursLabel.html('Ei aktiivinen');

        chart.options.goals = [];
        chart.options.xValueCheck = [];
        chart.redraw();
    }
}

function selectRelay(relayId) {
    const $btn              = $(`.btn-relay[data-relay-id='${relayId}']`);
    const $relayName        = $('#relay-info-name');

    const relay = pricesTemp.relays[relayId];

    $('.btn-relay').removeClass('active');
    $('#relay-info-none').hide();
    $('#relay-info').show();
    $('.tab-content :input').attr('disabled', false);

    $relayName.html('(' + relay.name + ')');
    $btn.addClass('active');

    updateRelayInfo(relay);
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
    const pricesOnly = pricesTemp.prices.hourly.map((price) => { return price.price });

    $('#stats #highest-price').html(Math.max(...pricesOnly).toFixed(2) + ' snt/kWh');
    $('#stats #lowest-price') .html(Math.min(...pricesOnly).toFixed(2) + ' snt/kWh');
    $('#stats #median-price') .html(getMedian(pricesOnly).toFixed(2) + ' snt/kWh');
    $('#stats #average-price').html(getAverage(pricesOnly).toFixed(2) + ' snt/kWh');
}

function removeRelayLimit(relayId) {
    const newLimit = {
        type: null,
        value: null
    }

    socket.emit('set limit', { relayId: relayId, limit: newLimit });

    const relay = pricesTemp.relays[relayId];
    relay.limit = newLimit;
    updateRelayInfo(relay);

    chart.options.goals = [];
    chart.options.xValueCheck = [];
    chart.redraw();
}

function clickHandler() {
    $('#btn-save').click((event) => {
        event.preventDefault();
        
        const selectedRelay = $('.btn-relay.active').index();
        
        if (selectedRelay === -1) {
            showNotification('<strong>Tallentaminen epäonnistui</strong><br>Mitään relettä ei ole valittu', 'danger');
            return;
        }
        
        const limitType = $('.tab-content .active').attr('data-limit-type');

        if (limitType === 'cheaperThan') {
            let limitValue = $("#settings-form #cheaper-than").val();

            if (!isNumber(limitValue)) {
                showNotification('<strong>Tallentaminen epäonnistui</strong><br>Syöttämäsi arvo ei kelpaa.', 'danger');
                return;
            }

            limitValue = parseFloat(limitValue);

            if (limitValue) {
                const newLimit = {
                    type: "cheaperThan",
                    value: limitValue
                }

                socket.emit('set limit', { relayId: selectedRelay, limit: newLimit });
                
                const relay = pricesTemp.relays[selectedRelay];
                relay.limit = newLimit;
                updateRelayInfo(relay);

                chart.options.goals = [limitValue];
                chart.options.xValueCheck = getActiveHours(limitValue);
                chart.redraw();
            } else {
                removeRelayLimit(selectedRelay);
            }

            showNotification('<strong>Tallentaminen onnistui</strong>', 'success');
            
        } else if (limitType === 'cheapest') {
            let limitValue = $('#settings-form #cheapest').val();

            if (limitValue == 0 || !limitValue) {
                console.log('removing relay limit');
                removeRelayLimit(selectedRelay);
            } else {
                const newLimit = {
                    type: "cheapest",
                    value: limitValue
                }

                socket.emit('set limit', { relayId: selectedRelay, limit: newLimit });
                
                const relay = pricesTemp.relays[selectedRelay];
                relay.limit = newLimit;
                updateRelayInfo(relay);

                chart.options.goals = [];
                chart.options.xValueCheck = getCheapestHours(limitValue);
                chart.redraw();
            }
            
            showNotification('<strong>Tallentaminen onnistui</strong>', 'success');

        } else if (limitType === 'temperature') {
            // TODO
        }
    });

    $('#btn-test').click(() => {
        const selectedRelay = $('.btn-relay.active').index();
        
        if (selectedRelay === -1) {
            showNotification('<strong>Testaaminen epäonnistui</strong><br>Mitään relettä ei ole valittu', 'danger');
            return;
        }
        
        socket.emit('test relay', selectedRelay);
        showNotification('<strong>Testaaminen onnistui</strong><br>Rele ' + (selectedRelay + 1) + ' kytketään päälle 5 sekunniksi.', 'info');
    });

    $('.btn-relay').click(function() {
        selectRelay($(this).attr('data-relay-id'));
    });

    // Reset form content when tab changes
    $("a[data-toggle='tab']").on('shown.bs.tab', function (e) {
        $('#settings-form')[0].reset();
    });
}


function socketListener() {
    socket.on('prices', (prices) => {
        pricesTemp = prices;

        if (!chart) {
            chart = createChart();
        }

        updateUI();
    });
}

$(() => {
    socket.emit('get prices');
    $('.tab-content :input').attr('disabled', true);

    socketListener();
    clickHandler();
});