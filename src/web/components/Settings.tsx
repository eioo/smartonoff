import React, { Component } from 'react';
import { Segment, Button, Label, ButtonProps, Tab, Grid } from 'semantic-ui-react';
import SelectedRelay from './SelectedRelay';

interface ISettingsState {
  activeRelay: number | undefined,
  testingRelay: boolean
}

const tabPanes = [
  { menuItem: 'Hinnan mukaan', render: () => <Tab.Pane>Hinta</Tab.Pane> },
  { menuItem: 'Halvimmat', render: () => <Tab.Pane>Tab 2 Content</Tab.Pane> },
  { menuItem: 'Lämpötila', render: () => <Tab.Pane>Tab 3 Content</Tab.Pane> },
];

class Settings extends Component<{}, ISettingsState> {
  constructor(props: {}) {
    super(props);
    
    this.state = {
      activeRelay: undefined,
      testingRelay: false
    }
  }

  handleSelectRelay = (e: React.MouseEvent, data: ButtonProps) => {
    e.preventDefault();
    this.setState({
      activeRelay: data.id
    });
  }

  handleTestRelay = (e: React.MouseEvent) => {
    e.preventDefault();

    this.setState({
      testingRelay: true
    });
    
    setTimeout(() => {
      this.setState({
        testingRelay: false
      })
    }, 3000);
  }

  createRelayButtons() {
    const buttons = [];

    for (let i = 1; i < 4; i++) {
      buttons.push(
        <Button
          id={i}
          key={i}
          basic={this.state.activeRelay !== i}
          onClick={this.handleSelectRelay}>
          Rele {i}
        </Button>
      );
    }

    return buttons;
  }

  render() {
    return (
      <Segment>
        <Grid>
          <Grid.Column width={12}>
            <Button
              icon='save'
              color='green'
              label='Tallenna' />
            
            <Button
              icon='lightning'
              color='yellow'
              label='Testaa'
              loading={this.state.testingRelay}
              onClick={this.handleTestRelay}
              style={{ marginRight: '8px' }} />
            
            {this.createRelayButtons()}

            <Label pointing='left'>Valittu rele</Label>
            <Tab panes={tabPanes} style={{ marginTop: '10px' }}/>
          </Grid.Column>
          <Grid.Column width={4} stretched>
            <SelectedRelay activeRelay={this.state.activeRelay} />
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}

export default Settings;