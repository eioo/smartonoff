import config from '../../config';
import { exec } from 'child_process';
import * as path from 'path';
import logger from './logger';

const XVKBD_SETTINGS = path.join(__dirname, '../../scripts/xvkbd-settings');

export function openBrowser(): void {
  if (!config.openBrowser) return;

  logger.info('Opening browser');

  exec(
    `chromium-browser http://${config.host}:${config.port} --start-fullscreen`,
    (err, stdout, stderr) => {
      if (err) {
        logger.warn('Browser could not be opened');
        return;
      }

      logger.success('Browser opened');
    }
  );
}

export function openOnScreenKeyboard(): void {
  if (!config.useXvkbd) return;

  exec('pidof xvkbd', (err, stdout, stderr) => {
    if (stdout) {
      return;
    }

    logger.info('Opening on-screen keyboard');

    exec(`xrdb ${XVKBD_SETTINGS}`, () => {
      exec('xvkbd');
    });
  });
}

export function closeOnScreenKeyboard(): void {
  if (!config.useXvkbd) return;

  logger.info('Closing on-screen keyboard');
  exec('killall xvkbd');
}
