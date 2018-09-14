# Smart On/Off

Can turn relays on / off based on current electricity prices. Works with Raspberry Pi!

Currently only [Fortum.fi](http://fortum.fi/) electricity prices are supported.

## Requirements

Required packages:

- `node.js` and `npm`
- `xvkbd` unix package
- `chromium-browser`

## Installing & Running

You need to be connected to internet. Ethernet and wireless both work.

### Setupping LCD Display

The screen I'm using: [RB-LCD-7-2](https://www.conrad.de/de/raspberry-pi-display-modul-rb-lcd-7-2-raspberry-pi-banana-pi-cubieboard-pcduino-1543962.html)

Add text below to `/boot/config.txt` to set display mode correctly.

```
max_usb_current=1
hdmi_group=2
hdmi_mode=87
hdmi_cvt 1024 600 60 6 0 0 0
hdmi_drive=1
```

I use addon called [Virtual Keyboard](https://chrome.google.com/webstore/detail/virtual-keyboard/pflmllfnnabikmfkkaddkoolinlfninn) to enable touch keyboard on chrome. Recommended zoom level is 120%

### Building

If you use `npm`, run these commands:

```
npm install
npm run build
```

If you use `yarn`, run these commands:

```
yarn install
yarn build
```

### Running the application

To build and run:

`npm start` OR `yarn start`

If you only want to run the app, do:

`npm run server` OR `yarn server`

To start development environment, run:

`npm run dev` or `yarn dev`

### Start on boot

To autostart the script on boot, add following command to `~/.config/lxsession/LXDE-pi/autostart`

`@lxterminal -e "/PATH/TO/smartonoff/start.sh"`
