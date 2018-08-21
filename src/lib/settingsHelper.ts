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

export function writeSettings(settings: ISettings) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings));
}

export function getSetting(
  obj: any,
  keyName: string,
  emptyVal: string | undefined = ''): string | number | null | boolean {

  const activeRelay = obj.props.settings[obj.props.activeRelay as number];

  return activeRelay ? activeRelay[obj.props.name][keyName] : emptyVal;
}

export function setSetting(
  obj: any,
  keyName: string,
  value: string | number | undefined): void {

  const activeRelay = obj.props.settings[obj.props.activeRelay as number];

  if (activeRelay) {
    activeRelay[keyName] = value;
  }
}