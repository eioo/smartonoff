import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';
import { ISaveData, ISettings } from '../lib/types';
import { updateRelayStates } from './relayController';

const SETTINGS_FILE = path.join(__dirname, 'settings.json');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const exists = util.promisify(fs.exists);

export async function saveSetting(data: ISaveData): Promise<void> {
  const fileExists = await exists(SETTINGS_FILE);
  const settings = await (async () => {
    if (fileExists) {
      const fileContent = (await readFile(SETTINGS_FILE)).toString();
      return JSON.parse(fileContent);
    }

    await writeFile(SETTINGS_FILE, '{}');
    return {};
  })();

  const valuesExist = Object.values(data.values).filter(x => x).length > 0;

  const json = (() => {
    if (!valuesExist) {
      delete settings[data.relayID];
      return settings;
    }

    const newSetting = {
      [data.relayID]: {
        [data.settingID]: data.values,
      },
    };

    const merged = {
      ...settings,
      ...newSetting,
    };

    return merged;
  })();

  await writeFile(SETTINGS_FILE, JSON.stringify(json));
  updateRelayStates();
}

export async function getSettings(): Promise<ISettings> {
  const fileExists = await exists(SETTINGS_FILE);

  if (fileExists) {
    const fileContent = (await readFile(SETTINGS_FILE)).toString();

    try {
      return JSON.parse(fileContent);
    } catch (e) {}
  }

  await writeFile(SETTINGS_FILE, '{}');
  return {};
}
