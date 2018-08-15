import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';

interface ISelectedRelayProps {
  activeRelay: number | undefined
}

class SelectedRelay extends Component<ISelectedRelayProps, {}> {
  constructor(props: ISelectedRelayProps) {
    super(props);
  }

  render() {
    return (
      <div>
      <Header as='h4'>Valittu rele</Header>
        {
          this.props.activeRelay ? (
            <p>Rele {this.props.activeRelay}</p>
          ) : (
            <div>
              <p>Relettä ei ole valittu.</p>
              <p>Ole hyvä ja valitse rele painamalla vasemmalta löytyviä painikkeita</p>
            </div>
          )
        }
      </div>
    );
  }
}

export default SelectedRelay;