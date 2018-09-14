import * as dns from 'dns';
import logger from './logger';
import config from 'config';

let showError = true;

export function waitForConnection(callback: Function): void {
  dns.lookup(config.dnsLookupHost, err => {
    if (err) {
      if (showError) {
        logger.error('No internet connection. Waiting until connected');
        showError = false;
      }

      setTimeout(() => {
        waitForConnection(callback);
      }, 2500);

      return;
    }

    callback();
  });
}
