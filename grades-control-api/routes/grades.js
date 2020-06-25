import express from 'express';
import { promises, write, read } from 'fs';

const router = express.Router();
const readFile = promises.readFile;
const writeFile = promises.writeFile;

router.get('/', async (req, res) => {
  try {
    res.end('GET ALL ouvindo');
  } catch (error) {
    console.log('Ocorreu um erro no GET: ' + error.message);
  }
});

router.post('/', async (req, res) => {
  let grade = req.body;

  try {
    let data = await readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);
    grade.timestamp = new Date();
    grade = { id: json.nextId++, ...grade };

    json.grades.push(grade);

    await writeFile(global.fileName, JSON.stringify(json));

    res.send(grade);
    res.end();
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    let id = parseInt(req.params.id, 10);
    let newGrade = req.body;
    let data = await readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);
    let oldIndex = json.grades.findIndex((grade) => grade.id === id);

    if (!oldIndex) {
      res.status(400).send({ error: 'Nenhum registro encontrado.' });
      res.end();
    }

    let newObject = {
      id: json.grades[oldIndex].id,
      student: newGrade.student,
      subject: newGrade.subject,
      type: newGrade.type,
      value: newGrade.value,
      timestamp: json.grades[oldIndex].timestamp,
    };

    json.grades[oldIndex] = newObject;

    await writeFile(global.fileName, JSON.stringify(json));
    res.send('Registro alterado com sucesso.');
    res.end();
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    let data = await readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);

    let grades = json.grades.filter(
      (grade) => grade.id !== parseInt(req.params.id, 10)
    );

    json.grades = grades;

    await writeFile(global.fileName, JSON.stringify(json));
    res.send('Registro excluido com sucesso !');
    res.end();
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    let data = await readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);

    const grade = json.grades.find(
      (grade) => grade.id === parseInt(req.params.id)
    );

    if (!grade) {
      res.send('Nenhum registro encontrado !');
      res.end();
    }

    res.send(grade);
    res.end();
  } catch (error) {}
  res.status(400).send({ error: error.message });
});

router.post('/sum', async (req, res) => {
  try {
    let student = req.body;
    let data = await readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);

    const grades = json.grades.filter(
      (grade) =>
        grade.student === student.student && grade.subject === student.subject
    );

    let sum = 0;

    grades.forEach((element) => {
      sum += element.value;
    });

    res.send(`A soma é: ${sum}`);

    res.end();
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.post('/average', async (req, res) => {
  try {
    let parameter = req.body;
    let data = await readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);

    const result = json.grades.filter(
      (grade) =>
        grade.subject === parameter.subject && grade.type === parameter.type
    );

    let sum = 0;

    result.forEach((element) => {
      sum += element.value;
    });

    let average = sum / result.length;

    res.send(`A média é: ${average}`);

    res.end();
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.post('/highest-value', async (req, res) => {
  try {
    let parameter = req.body;
    let data = await readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);

    const result = json.grades.filter(
      (grade) =>
        grade.subject === parameter.subject && grade.type === parameter.type
    );

    result.sort((a, b) => {
      return b.value - a.value;
    });

    res.send(result.slice(0, 3));

    res.end();
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

export default router;
