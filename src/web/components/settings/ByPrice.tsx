import React, { Component } from 'react';
import { Form, Input, Label } from 'semantic-ui-react';
import { getSetting, setSetting } from '../../../lib/settingsHelper';
import { ISettingProps, ISettingState } from '../../../lib/types';

class ByPrice extends Component<ISettingProps, ISettingState> {
  constructor(props: ISettingProps) {
    super(props);

    this.state = {
      featureActive: false
    }
  }

  handleToggle = () => {
    this.setState({
      featureActive: !this.state.featureActive
    })
  }

  componentDidMount() {
    this.setState({
      value: getSetting(this, 'value') as number
    });
  }

  render() {
    console.log(getSetting(this, 'value'));
    
    return (
      <Form >
        <Form.Group inline>
          <Form.Field>
            <Input
              placeholder={0.00}
              label='c/kWh'
              labelPosition='right'
              value={ this.state.value }
              onChange={ (e: React.FormEvent<HTMLInputElement>) => {
                const newValue = (e.target as HTMLInputElement).value;
                setSetting(this, 'value', newValue);
              }} />
          </Form.Field>

          <Form.Checkbox
            label={this.state.featureActive ? 'Käytössä' : 'Pois käytöstä'}
            checked={ !!getSetting(this, 'enabled') }
            toggle
            onChange={this.handleToggle} />
        </Form.Group>
        <Label>Kytkee releen päälle hinnan alittaessa asetetun arvon.</Label>
      </Form>
    );
  }
}

export default ByPrice;