import React, { Component } from 'react';
import { Table, Header, Message } from 'semantic-ui-react';

class InfoBox extends Component {
  render() {
    return (
      <div>
        <Header as='h4' style={{ margin: '5px 0px 0px 0px' }}>Hinnat (c/kWh)</Header>

        <Table basic='very' celled collapsing style={{ width: '100%' }}>
          <Table.Body>
            <Table.Row>
              <Table.Cell>
                Korkein
              </Table.Cell>
              <Table.Cell>
                0.00
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                Alhaisin
              </Table.Cell>
              <Table.Cell>
                0.00
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                Mediaani
              </Table.Cell>
              <Table.Cell>
                0.00
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                Keskiarvo
              </Table.Cell>
              <Table.Cell>
                0.00
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>

        <Message size='mini' style={{ position: 'absolute', bottom: 10, left: 10, right: 10 }}>
          Sähkön hinnat tarjoaa Fortum.fi
        </Message>
      </div>
    );
  }
}

export default InfoBox;