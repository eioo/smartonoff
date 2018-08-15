import React, { Component } from 'react';
import { Container, Grid } from 'semantic-ui-react';

import Chart from './Chart';
import Settings from './Settings';
import { fetchPrices } from '../../lib/apiHelper';

interface IAppState {
  prices: Array<number>
}

class App extends Component<{}, IAppState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      prices: []
    };
  }

  async componentDidMount() {
    const prices = await fetchPrices();
    this.setState({ prices });
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
              <Settings />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

export default App;