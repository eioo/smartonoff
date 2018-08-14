import React, { Component } from 'react';
import { Segment, Button, Label, ButtonProps, Tab } from 'semantic-ui-react';

interface ISettingsState {
  selectedRelay: number,
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
      selectedRelay: 0,
      testingRelay: false
    }
  }

  handleSelectRelay = (e: React.MouseEvent, data: ButtonProps) => {
    e.preventDefault();
    this.setState({
      selectedRelay: data.id
    });
  }

  handleTestRelay = (e: React.MouseEvent, data: ButtonProps) => {
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
          basic={this.state.selectedRelay !== i}
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
      </Segment>
    );
  }
}

export default Settings;