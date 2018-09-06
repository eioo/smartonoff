export interface ISaveData {
  relayID: number;
  settingName: string;
  values: {
    [key: string]: number | string;
  };
}

export interface ISettings {
  [relayID: string]: {
    [settingName: string]: {
      [value: string]: number | string;
    };
  };
}
