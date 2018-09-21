import { Signale, SignaleOptions, DefaultMethods } from 'signale';

const options = {
  config: {
    displayTimestamp: true,
    displayDate: false,
  },
} as SignaleOptions;

const logger = new Signale(options);

export const iLogger = new Signale({
  interactive: true,
  ...options,
});

export default logger;
