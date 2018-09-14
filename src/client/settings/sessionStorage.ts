import { ISettings, ISaveData } from '../../lib/types';

export function getSessionSettings(): ISettings {
  const settingsString = sessionStorage.getItem('settings');
  const json = JSON.parse(settingsString || '{}');

  return json as ISettings;
}

export function setSessionSetting(setting: ISaveData): void {
  const settings = getSessionSettings();
  const valuesExist = Object.values(setting.values).filter(x => x).length > 0;

  const newSettings = (() => {
    if (!valuesExist) {
      delete settings[setting.settingID];
      return settings;
    }

    return {
      ...settings,
      [setting.relayID]: {
        [setting.settingID]: {
          ...setting.values,
        },
      },
    };
  })();

  sessionStorage.setItem('settings', JSON.stringify(newSettings));
}

export function getSessionPrices(): Array<number> {
  const prices = sessionStorage.getItem('prices');
  return JSON.parse(prices || '[]');
}
