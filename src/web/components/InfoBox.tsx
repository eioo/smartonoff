import React, { Component } from 'react';
import { Segment, Table, Header, Message } from 'semantic-ui-react';

class InfoBox extends Component {
  render() {
    return (
      <Segment>
        <Header as='h4' style={{ margin: '5px 0px 0px 0px' }}>Hinnat (c/kWh)</Header>

        <Table basic='very' celled collapsing style={{ width: '100%' }}>
          {/*<Table.Header>
            <Table.Row>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell>c/kWh</Table.HeaderCell>
            </Table.Row>
          </Table.Header>*/}

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

        <Message size='mini' style={{ position: 'absolute', bottom: 5, left: 5, right: 5 }}>
          Sähkön hinnat tarjoaa Fortum.fi
        </Message>
      </Segment>
    );
  }
}

export default InfoBox;