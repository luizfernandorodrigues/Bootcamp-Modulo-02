import express from 'express';
import { promises } from 'fs';
import winston from 'winston';
import accountsRouter from './routes/accounts.js';

const app = express();

global.fileName = 'accounts.json';

const readFile = promises.readFile;
const writeFile = promises.writeFile;

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

global.logger = winston.createLogger({
  level: 'silly',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'my-bank-api.log' }),
  ],
  format: combine(label({ label: 'my-bak-api' }), timestamp(), myFormat),
});

app.use(express.json());
app.use('/account', accountsRouter);

app.listen(3000, async () => {
  try {
    await readFile(global.fileName, 'utf8');
  } catch (err) {
    const initialJson = {
      nextId: 1,
      accounts: [],
    };

    await writeFile(global.fileName, JSON.stringify(initialJson)).catch(
      (err) => {
        console.log(err);
      }
    );
  }
});
