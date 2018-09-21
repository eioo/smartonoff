const config = {
  host: '192.168.43.94',
  port: '9999',

  // GPIO pin numbers for relays (3 supported)
  relayGPIO: [18, 23, 24],

  // Address to test internet connection against
  dnsLookupHost: 'google.com',

  // Duration for testing relays
  testDuration: 3000,

  // Open browser when server is up
  openBrowser: true,

  // Enables xvkbd / on-screen keyboard if no network is present on startup
  useXvkbd: true,
};

export default config;
