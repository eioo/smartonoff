import React, { Component } from 'react';
import { Container, Grid } from 'semantic-ui-react';

import Chart from './Chart';
import Settings from './Settings';
import { fetchPrices, fetchSettings } from '../../lib/apiHelper';
import { ISettings } from '../../lib/types';

interface IAppState {
  prices: Array<number>;
  settings: ISettings;
}

class App extends Component<{}, IAppState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      prices: [],
      settings: {}
    };
  }

  async componentDidMount() {
    const prices = await fetchPrices();
    const settings = await fetchSettings();

    this.setState({ prices, settings });
  }

  render() {
    return (
      <Container style={{ marginTop: '20px'}}>
        <Grid stretched>
          <Grid.Row>
            <Grid.Column width={16}>
              <Chart prices={this.state.prices} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16}>
              <Settings settings={this.state.settings} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

export default App;