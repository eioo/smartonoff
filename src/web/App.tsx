import React, { Component } from 'react';
import { Container, Grid } from 'semantic-ui-react';

import Chart from './components/Chart';
import InfoBox from './components/InfoBox';
import Settings from './components/Settings';
import SelectedRelay from './components/SelectedRelay';

class App extends Component {
  render() {
    return (
      <Container style={{ marginTop: '20px'}}>

        <Grid stretched>
          <Grid.Row>
            <Grid.Column width={12}>
              <Chart />
            </Grid.Column>
            <Grid.Column width={4}>
              <InfoBox />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={12}>
              <Settings />
            </Grid.Column>
            <Grid.Column width={4}>
              <SelectedRelay />
            </Grid.Column>
          </Grid.Row>
        </Grid>
          
      </Container>
    );
  }
}

export default App;