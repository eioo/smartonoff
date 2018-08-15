import React, { Component } from 'react';
import { Container, Grid } from 'semantic-ui-react';

import Chart from './Chart';
import Settings from './Settings';

class App extends Component {
  render() {
    return (
      <Container style={{ marginTop: '20px'}}>
        <Grid stretched>
          <Grid.Row>
            <Grid.Column width={16}>
              <Chart />
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