# Smart On/Off

Can turn relays on / off based on current electricity prices. Works with Raspberry Pi!

Currently only [Fortum.fi](http://fortum.fi/) electricity prices are supported.

![Smart On/Off](https://raw.githubusercontent.com/Kallu609/smartonoff/master/assets/preview.png)

## Requirements

Required packages:

- `node.js` and `npm`
- `xvkbd` unix package
- `chromium-browser`

## Installing & Running

You need to be connected to internet. Ethernet and wireless both work.

First of all, start by going to `src/config.ts` and modify it up to your needs.

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

Running:

`npm run server` OR `yarn server`

Build and run:

`npm start` OR `yarn start`

Development environment:

`npm run dev` or `yarn dev`

### Setupping LCD Display (optional)

The screen I'm using: [RB-LCD-7-2](https://www.conrad.de/de/raspberry-pi-display-modul-rb-lcd-7-2-raspberry-pi-banana-pi-cubieboard-pcduino-1543962.html)

Add text below to `/boot/config.txt` to set display mode correctly.

```
max_usb_current=1
hdmi_group=2
hdmi_mode=87
hdmi_cvt 1024 600 60 6 0 0 0
hdmi_drive=1
```

I use addon called [Virtual Keyboard](https://chrome.google.com/webstore/detail/virtual-keyboard/pflmllfnnabikmfkkaddkoolinlfninn) to enable touch keyboard on Chromium. Recommended zoom level with my displays resolution is 120%.

### Start on boot (optional)

To autostart the script on boot, add following command to `~/.config/lxsession/LXDE-pi/autostart`

`@lxterminal -e "/PATH/TO/smartonoff/scripts/start.sh"`

Run these commands to make node available for root if getting error when using NVM installation of node:

````n=$(which node)
n=${n%/bin/node}
chmod -R 755 $n/bin/*
sudo cp -r $n/{bin,lib,s```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
````
