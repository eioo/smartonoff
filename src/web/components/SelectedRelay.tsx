import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';

class SelectedRelay extends Component {
  render() {
    return (
      <div>
        <Header as='h4'>Valittu rele</Header>
        <p>Relettä ei ole valittu.</p>
        <p>Ole hyvä ja valitse rele painamalla vasemmalta löytyviä painikkeita</p>
      </div>
    );
  }
}

export default SelectedRelay;