export interface ISettings {
  [id: number]: {
    [name: string]: ICondition
  }
}

export interface ICondition {
  enabled: boolean;
  value: number | null;
}

export interface ISettingProps {
  activeRelay: number | undefined;
  name: string;
  settings: ISettings;
  changeSettings: (newSettings: ISettings) => void;
}

export interface ISettingState {
  featureActive: boolean;
  value?: number;
}