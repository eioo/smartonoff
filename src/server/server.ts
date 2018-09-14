import * as express from 'express';
import * as cors from 'cors';
import * as path from 'path';
import { routes } from './routes';
import logger from './logger';

process.on('unhandledRejection', error => {
  logger.fatal('unhandledRejection: ', error.message);
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

app.listen(PORT, () => {
  logger.success(`Server running on: http://${HOST}:${PORT}`);
});
