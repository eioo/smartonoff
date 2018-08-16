import * as fs from 'fs';
import * as path from 'path';

const SETTINGS_FILE = path.join(__dirname, 'settings.json');
const SETTINGS_FILE_DEFAULT = path.join(__dirname, 'defaultSettings.json');

export function readSettings() {
  const exists = fs.existsSync(SETTINGS_FILE);

  if (!exists) {
    const defaultSettings = fs.readFileSync(SETTINGS_FILE_DEFAULT);  
    fs.writeFileSync(SETTINGS_FILE, defaultSettings);
    return JSON.parse(defaultSettings.toString());
  }

  const settings = fs.readFileSync(SETTINGS_FILE);
  return JSON.parse(settings.toString());
}