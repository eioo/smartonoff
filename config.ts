const config = {
  host: '192.168.43.94',
  port: '9999',

  // GPIO pin numbers for relays (3 supported)
  relayGPIO: [14, 15, 18],

  // Address to test internet connection against
  dnsLookupHost: '1.1.1.1',

  // Duration for testing relays
  testDuration: 3000,
};

export default config;
