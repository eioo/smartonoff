import * as cors from 'cors';
import * as express from 'express';
import * as path from 'path';
import * as relayController from './relayController';
import { routes } from './routes';
import logger from './logger';
import { waitForConnection } from './connectionCheck';

process.on('unhandledRejection', err => {
  logger.fatal(`unhandledRejection: ${err.message}`);
});

const HOST = 'localhost';
const PORT = '9999';
const DIST_FOLDER = path.join(__dirname, '../../dist');

const app = express();

logger.info('Starting up server');

app.use(cors());
app.use(express.json());
app.use(express.static(DIST_FOLDER));

routes(app);
listen();

function listen(): void {
  waitForConnection(() => {
    relayController.initialize();

    app.listen(PORT, () => {
      logger.success(`Server running on: http://${HOST}:${PORT}`);
    });
  });
}
