export interface ISettingsForm {
  name: string;
  helpText?: string;
  controls: Array<IFormControl>;
}

export interface IFormControl {
  name: string;
  inputProps?: object;
  label?: string;
  radioButtonProps?: Array<object>;
}

export interface ISettings {
  [relayID: string]: {
    [conditionID: string]: ICondition;
  };
}

export interface ICondition {
  [key: string]: number | boolean | string | null;
}
