import * as express from 'express';
import * as cors from 'cors';
import { routes } from './routes';

process.on('unhandledRejection', error => {
  console.log('unhandledRejection: ', error.message);
});

const HOST = 'localhost';
const PORT = '9999';

const app = express();

app.use(cors());
app.use(express.json());

routes(app);

app.listen(PORT, () => {
  console.log(`API server listening on: http://${HOST}:${PORT}`);
});
