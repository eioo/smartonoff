import React, { Component } from 'react';
import { Form, Input } from 'semantic-ui-react';

interface IByPriceProps {
  activeRelay: number | undefined;
}

interface IByPriceState {
  featureActive: boolean;
}

class ByPrice extends Component<IByPriceProps, IByPriceState> {
  constructor(props: IByPriceProps) {
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
    // Get featureActive
  }

  render() {
    return (
      <Form >
        <Form.Group inline>
          <Form.Field>
            <Input
              placeholder='0.00'
              label='c/kWh'
              labelPosition='right' />
          </Form.Field>

          <Form.Checkbox
            label={this.state.featureActive ? 'Käytössä' : 'Pois käytöstä'}
            toggle
            onChange={this.handleToggle} />
        </Form.Group>
      </Form>
    );
  }
}

export default ByPrice;