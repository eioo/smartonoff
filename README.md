# Smart On/Off

Can turn relays on / off based on current electricity prices (Fortum.fi), temperature or many other options. Works with Raspberry Pi!

### Requirements

Required packages:
* `node.js` and `npm`
* `chromium-browser`

### Installing & Running

You need to be connected to internet. Ethernet and wireless both work.

```
npm install
npm start
```

### LCD Display

The screen I'm using: [RB-LCD-7-2](https://www.conrad.de/de/raspberry-pi-display-modul-rb-lcd-7-2-raspberry-pi-banana-pi-cubieboard-pcduino-1543962.html)

Add text below to `/boot/config.txt` to set display mode correctly.

```
max_usb_current=1
hdmi_group=2
hdmi_mode=87
hdmi_cvt 1024 600 60 6 0 0 0
hdmi_drive=1
```

### Start on boot

To autostart the script on boot, add following command to `~/.config/lxsession/LXDE-pi/autostart`

@lxterminal -e "/dir/to/smartonoff/start.sh"
