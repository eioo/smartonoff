const config = {
  host: 'localhost',
  port: '9999',

  // GPIO pin numbers for relays (3 supported)
  gpio: [0, 0, 0],

  // Address to test internet connection against
  dnsLookupHost: '1.1.1.1',

  // Duration for testing relays
  testDuration: 3000,
};

export default config;
