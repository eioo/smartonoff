const gpio = require('onoff').Gpio;
const colors = require('colors');
const request = require('request');
const express = require('express');
const path = require('path');
const fs = require('fs');
const schedule = require('node-schedule');
const { exec } = require('child_process');

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

process.chdir(__dirname);

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
		log(("Testing relay #" + relayId.toString() + " for 5s").info);

		pins[relayId].write(1, (err, value) => {
			if (err) throw err;

			setTimeout(() => {
				pins[relayId].write(0, (err, value) => {
					if (err) throw err;
				});
			}, 5000);
		});
	});

	socket.on('set limit', (newLimit) => {
		fs.readFile(dataFile, (err, data) => {
			let json = JSON.parse(data);
			json.relays[newLimit.relayId].limit = newLimit.limit;

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
		if (err) {
			if (err.code !== 'ENOENT') {
				throw err;
			}
		}

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

				updateGpioState();
				callback(prices);
			});
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
		if (err) {
			if (err.code === 'ENOENT') {
				return;
			}
		}

		const json = JSON.parse(data);
		const currentPrice = json.prices.hourly[new Date().getHours()].price;
		
		json.relays.forEach((relay, i) => {
			let newState;

			if (!relay.limit || !relay.limit.type) {
				newState = 0;

			} else if (relay.limit.type === 'cheaperThan') {
				newState = (currentPrice < relay.limit.value) ? 1 : 0;

			} else if (relay.limit.type === 'cheapest') {
				let cheapestHours = getCheapestHours(json.prices.hourly, relay.limit.value);
				const found = cheapestHours.includes(new Date().getHours());
				
				newState = (found) ? 1 : 0;
			}
			// Update pin state
			pins[i].read((err, currentState) => {
				if (newState !== currentState) {
	
					pins[i].write(newState, (err) => {
						if (err) throw err;
						
						const state = (newState === 1) ? 'On' : 'Off';
						log(`Updated GPIO | Name: ${relay.name} | State: ${state} | Current Price: ${currentPrice} | Type: ${relay.limit.type} | Value: ${relay.limit.value}`.debug);
					});
				}
			});
		});
	});
}

function openBrowser() {
	const command = 'chromium-browser http://localhost:3000 --start-fullscreen';
	
	exec(command, (err, stdout, stderr) => {
		if (err) {
			return;
		}
	});	
}

function isConnected(callback) {
	require('dns').resolve('www.google.com', (err) => {
		if (!err) {
			callback(true);
		} else {
			callback(false);
		}
	});
}

function openXvkbd() {
	exec('pidof xvkbd', (err, stdout, stderr) => {
		if (!stdout) {
			exec('xrdb ' + path.resolve(__dirname, 'xvkbd-settings'),
				(err, stdout, stderr) => {
				exec('xvkbd');
			});
		}
	});
}

function closeXvkbd() {
	exec('killall xvkbd');
}

function startServer() {
	log('Checking internet connection'.info);

	isConnected((connected) => {
		if (connected) {
			http.listen(httpPort, () => {
				log('Internet connection OK. Server started on port 3000'.info);
			});

			closeXvkbd();

			/* Get prices every day on 0:01 */
			let j = schedule.scheduleJob('0 1 * * *', () => {
				getPrices((prices) => {
					io.sockets.emit('prices', prices);
				});
			});

			// Update GPIO state every hour
			let gpioJ = schedule.scheduleJob('0 * * * *', () => {
				updateGpioState();
			});

			updateGpioState();
			openBrowser();

		} else {
			log("No internet connection. Retrying in 5 seconds.".warn);
			setTimeout(startServer, 5000);

			openXvkbd();
		}
	});
}

startServer();


