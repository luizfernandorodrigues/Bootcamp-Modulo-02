import express from 'express';
import { promises } from 'fs';
import gradeRouter from './routes/grades.js';

const app = express();

global.fileName = 'grades.json';

const readFile = promises.readFile;
const writeFile = promises.writeFile;

app.use(express.json());

app.use('/grade', gradeRouter);

app.listen(3000, async () => {
  console.log('API started..');
});
