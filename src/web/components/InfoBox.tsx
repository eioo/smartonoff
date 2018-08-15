import React, { Component } from 'react';
import { Table, Header, Message } from 'semantic-ui-react';
import { getAverage, getMedian } from '../../lib/mathHelper';

interface IInfoBoxProps {
  prices: Array<number>;
}

class InfoBox extends Component<IInfoBoxProps, {}> {
  constructor(props: IInfoBoxProps) {
    super(props);

    this.state = {
      prices: []
    };
  }

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
                { Math.max(...this.props.prices).toFixed(2) }
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                Alhaisin
              </Table.Cell>
              <Table.Cell>
                { Math.min(...this.props.prices).toFixed(2) }
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                Keskiarvo
              </Table.Cell>
              <Table.Cell>
                { getAverage(this.props.prices).toFixed(2) }
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                Mediaani
              </Table.Cell>
              <Table.Cell>
                { getMedian(this.props.prices).toFixed(2) }
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