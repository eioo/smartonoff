import { Signale, SignaleOptions } from 'signale';

const options = {
  config: {
    displayFilename: true,
    displayTimestamp: true,
    displayDate: false,
  },
} as SignaleOptions;

const logger = new Signale(options);

export default logger;
