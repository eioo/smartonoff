const gpio = require('onoff').Gpio;
const colors = require('colors');
const request = require('request');
const express = require('express');
const path = require('path');
const fs = require('fs');
const schedule = require('node-schedule');

const priceUrl = 'https://fortum.heydaypro.com/tarkka/graph.php';
const dataFile = 'prices.json';
const httpPort = 3000;

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const pins = [
    new gpio(14, 'out'),
    new gpio(15, 'out'),
    new gpio(18, 'out')
];

colors.setTheme({
	'warn':'yellow',
	'info':'green',
	'debug':'cyan',
	'error':'red'
});

app.use(express.static('public'));

io.on('connection', (socket) => {
	log('User connected'.debug);

	socket.on('get prices', () => {
		getPrices((prices) => {
			socket.emit('prices', prices);	
		});	
	});

	// Turns relay on for 2.5s for test purposes
	socket.on('test relay', (relayId) => {
		log(("Testing relay #" + relayId.toString() + " for 2.5s").info);

		pins[relayId].write(1, (err, value) => {
			if (err) throw err;

			setTimeout(() => {
				pins[relayId].write(0, (err, value) => {
					if (err) throw err;
				});
			}, 2500);
		});
	});

	socket.on('set limit', (limit) => {
		log((`Limit changed | Type: ${limit.type} | Value: ${limit.value}`).debug);

		fs.readFile(dataFile, (err, data) => {
			console.log(data);
			let json = JSON.parse(data);
			json.limit = limit;

			fs.writeFile(dataFile, JSON.stringify(json), (err) => {
				if (err) throw err;
				
				getPrices((prices) => {
					socket.broadcast.emit('prices', prices);
				});

				updateGpioState();
			});
		});
	});

	socket.on('disconnect', () => {
		log('User disconnected'.debug)
	});
});

function log(text) {
	let time = new Date();
	let hms =  `${ ('0' + time.getHours()).slice(-2) }:${ ('0' + time.getMinutes()).slice(-2) }:${ ('0' + time.getSeconds()).slice(-2) }`;
	
	let output = (`[${ hms }]`) + ' ' + text;
		
	console.log(output);
}

function getPrices(callback) {
	let prices = [];

	// Load prices from file
	fs.readFile(dataFile, (err, data) => {
		if (err) throw err;

		const dateStr = new Date().toLocaleDateString('FI-fi');

		// Try to parse file
		try {
			callback(JSON.parse(data));
		} catch (err) {
			log('Fetching prices...'.info);

			request(priceUrl, (error, response, body) => {
				let data;

				data = body.split('data.addRows(')[1];
				data = data.split(');')[0];

				let regex = /\'(\d+)\', ([\d\.]+)/g;
				let match = regex.exec(data);

				while (match != null) {
					const hour = parseInt(match[1]);
					const price = parseFloat(match[2]);

					prices.push({
						price: price, hour: hour
					});

					match = regex.exec(data);
				}
				
				let newJson = {
					prices: {
						lastUpdated: dateStr,
						hourly: prices
					},
					relays: []
				}
				
				for (let i = 0; i < pins.length; i++) {
					let relay = "Rele " + (i + 1).toString();

					newJson.relays.push({
						name: relay,
						enabled: false,
						limit: {
							type: null,
							Value: null
						}
					});
				}
					

				fs.writeFile(dataFile, JSON.stringify(newJson), (err) => {
					if (err) throw err;
					log('Prices fetched succesfully!'.info);
				});

				callback(prices);
			});
		}
	});
}

function isConnected(callback) {
	require('dns').resolve('www.google.com', (err) => {
		if (!err) {
			callback();
		} else {
			log('No internet connection! Please connect to Ethernet or Wi-Fi network. Exiting...'.error);
			process.exit()
		}
	});
}

function getCheapestHours(prices, howMany) {
    return prices
        .sort((a,b) => {
            return (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0);
        })
        .slice(0, howMany)
        .map((price) => {
            return parseFloat(price.hour);
        })
        .sort((a, b) => {
            return a - b;
        });
}

function updateGpioState() {
	fs.readFile(dataFile, (err, data) => {
		if (err) throw err;

		const json = JSON.parse(data);
		const currentPrice = json.prices.hourly[new Date().getHours()].price;
		
		/*let newState;

		if (!json.limit) {
			newState = 0;

		} else if (json.limit.type === 'under') {
			newState = (currentPrice < json.limit.value) ? 1 : 0;

		} else if (json.limit.type === 'cheapestPrices') {
			let cheapestHours = getCheapestHours(json.prices, json.limit.value);
			const found = cheapestHours.includes(new Date().getHours());
			
			newState = (found) ? 1 : 0;
		}
		*/
		
		/* Only needed for production
		output.read((err, currentState) => {
			if (newState !== currentState) {

				output.write(newState, (err) => {
					if (err) throw err;
					
					const state = (newState === 1) ? 'On' : 'Off';
					log(`Updated GPIO | State: ${state} | Current Price: ${currentPrice} | Type: ${json.limit.type} | Value: ${json.limit.value}`.debug);
				});
			}
		});
		*/

	});
}

log('Checking internet connection'.info);

isConnected(() => {
	http.listen(httpPort, () => {
		log('Internet connection OK. Server started on port 3000'.info);
	});

	/* Get prices every day on 0:01 */
	let j = schedule.scheduleJob('0 1 * * *', () => {
		getPrices((prices) => {
			io.sockets.emit('prices', prices);
		});
	});

	// Turn gpio on / off every hour on 0:00
	let gpioJ = schedule.scheduleJob('0 * * * *', () => {
		updateGpioState();
	});
});

