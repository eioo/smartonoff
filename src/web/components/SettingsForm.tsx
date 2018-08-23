import React, { Component, SyntheticEvent } from 'react';
import { Form, Input, Label, InputOnChangeData } from 'semantic-ui-react';
import { IFormControl, ISettings } from '../../lib/types';
import _ from 'lodash';

interface IFormProps {
  id: number;
  name: string;
  helpText: string;
  controls: Array<IFormControl>;
  settings: ISettings;
  activeRelay: number;
}

interface IFormState {
  enabled: boolean;
  value?: number;
}

class SettingsForm extends Component<IFormProps, IFormState> {
  constructor(props: IFormProps) {
    super(props);

    this.state = {
      enabled: false,
    };
  }

  getSetting = (key: string) => {
    try {
      return this.props.settings[this.props.activeRelay][this.props.name][key];
    } catch (e) {
      return;
    }
  };

  changeSettings = (
    condition: string,
    key: string,
    value: string | number | boolean | null
  ) => {
    if (!this.props.activeRelay) return;

    const { settings } = this.props;
    const relayKey = this.props.activeRelay.toString();

    settings[relayKey] = _.merge(settings[relayKey], {
      [condition]: {
        [key]: value,
      },
    });

    console.log(this.props.settings);
  };

  handleToggle = () => {
    this.setState({
      enabled: !this.state.enabled,
    });

    this.changeSettings(this.props.name, 'enabled', this.state.enabled);
  };

  handleChange = (e: SyntheticEvent<Element>, data: InputOnChangeData) => {
    this.changeSettings(this.props.name, data.name, data.value);
  };

  createInputs = () => {
    return this.props.controls.map((control, index) => {
      return (
        <Form.Group key={index}>
          <Form.Field>
            {control.label ? <label>{control.label}</label> : null}
            {control.radioButtonProps ? (
              control.radioButtonProps.map((props, index) => {
                return <Form.Radio key={index} {...props} />;
              })
            ) : (
              <Input
                id={this.props.id}
                name={control.name}
                onChange={this.handleChange}
                {...control.inputProps}
              />
            )}
          </Form.Field>
        </Form.Group>
      );
    });
  };

  createForm = () => {
    return (
      <Form widths="equal">
        <Form.Group>
          <Label>{this.props.helpText}</Label>
        </Form.Group>

        {this.createInputs()}

        <Form.Group>
          <Form.Checkbox
            label={this.state.enabled ? 'Käytössä' : 'Pois käytöstä'}
            toggle
            checked={this.state.enabled}
            onChange={this.handleToggle}
          />
        </Form.Group>
      </Form>
    );
  };

  componentDidMount() {
    const enabled = !!this.state.enabled;
    this.setState({ enabled });
  }

  render() {
    return this.createForm();
  }
}

export default SettingsForm;
