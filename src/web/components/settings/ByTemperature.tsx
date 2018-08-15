import React, { Component } from 'react';

interface IByTemperatureProps {
  activeRelay: number | undefined;
}

class ByTemperature extends Component<IByTemperatureProps, {}> {
  constructor(props: IByTemperatureProps) {
    super(props);
  }

  render() {
    return (
      <div>
        WIP
      </div>
    );
  }
}

export default ByTemperature;