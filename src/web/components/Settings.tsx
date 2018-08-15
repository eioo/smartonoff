import React, { Component } from 'react';
import { Segment, Button, Label, ButtonProps, Tab, Grid, Transition } from 'semantic-ui-react';
import SelectedRelay from './SelectedRelay';
import ByPrice from './settings/ByPrice';
import ByCheapest from './settings/ByCheapest';
import ByTemperature from './settings/ByTemperature';

interface ISettingsState {
  activeRelay: number | undefined;
  testingRelay: boolean;
}

const tabs = [
  {
    name: 'Hinnan mukaan',
    component: ByPrice
  },
  {
    name: 'Halvimmat',
    component: ByCheapest
  },
  {
    name: 'Lämpötila',
    component: ByTemperature
  }
];

class Settings extends Component<{}, ISettingsState> {
  constructor(props: {}) {
    super(props);
    
    this.state = {
      activeRelay: undefined,
      testingRelay: false,
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
    const buttons = [1,2,3].map(i => (
      <Button
        id={i}
        key={i}
        basic={this.state.activeRelay !== i}
        onClick={this.handleSelectRelay}>
        Rele {i}
      </Button>
    ));

    return buttons;
  }

  createTabs() {
    const panes = tabs.map(tab => {
      return {
        menuItem: tab.name,
        render: () => {
          return (
            <Tab.Pane>
              <tab.component activeRelay={this.state.activeRelay} />
            </Tab.Pane>
          )
        }
      }
    });

    return <Tab panes={panes} style={{ marginTop: '10px' }} />
  }
  
  render() {
    return (
      <Segment>
        <Grid>
          <Grid.Column width={12}>
            <Button
              color='green'
              disabled={!this.state.activeRelay}
              icon='save'
              label='Tallenna' />
            
            <Button
              color='yellow'
              disabled={!this.state.activeRelay}
              icon='lightning'
              label='Testaa'
              loading={this.state.testingRelay}
              onClick={this.handleTestRelay}
              style={{ marginRight: '10px' }} />
            
            {this.createRelayButtons()}
            {
              !this.state.activeRelay ?
              <Label pointing='left' color='purple'>Valitse rele</Label> :
              null
            }
            {this.createTabs()}
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