import { Gpio } from 'onoff';

const g = new Gpio(18, 'out');

g.writeSync(0);
