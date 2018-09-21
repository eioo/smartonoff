import * as dns from 'dns';
import logger from './logger';
import config from '../../config';
import {
  closeOnScreenKeyboard,
  openOnScreenKeyboard,
} from './processController';

let firstTry = true;

export function waitForConnection(callback: Function): void {
  dns.lookup(config.dnsLookupHost, err => {
    if (err) {
      if (firstTry) {
        logger.error('No internet connection. Waiting until connected');
        firstTry = false;
        openOnScreenKeyboard();
      }

      setTimeout(() => {
        waitForConnection(callback);
      }, 2500);

      return;
    }

    !firstTry && closeOnScreenKeyboard();
    callback();
  });
}
