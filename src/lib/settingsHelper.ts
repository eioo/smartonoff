import * as fs from 'fs';
import * as path from 'path';
import { ISettings } from './types';

const SETTINGS_FILE = path.join(__dirname, 'settings.json');

export function readSettings(): ISettings {
  const exists = fs.existsSync(SETTINGS_FILE);

  if (!exists) {
    fs.writeFileSync(SETTINGS_FILE, '{}');
  }

  const settings = fs.readFileSync(SETTINGS_FILE);
  return JSON.parse(settings.toString());
}

export function writeSettings(settings: ISettings): void {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings));
}
