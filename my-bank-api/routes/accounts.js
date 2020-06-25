import express from 'express';
import { promises } from 'fs';

const router = express.Router();

const readFile = promises.readFile;
const writeFile = promises.writeFile;

router.post('/', async (req, res) => {
  let account = req.body;

  try {
    let data = await readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);
    account = { id: json.nextId++, ...account };

    json.accounts.push(account);

    await writeFile(global.fileName, JSON.stringify(json));

    res.end();

    logger.info(`POST /account - ${JSON.stringify(json)}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.get('/', async (_, res) => {
  try {
    let data = await readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);
    delete json.nextId;
    res.send(json);
  } catch (error) {
    res.status(400).send({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    let data = await readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);

    const account = json.accounts.find(
      (account) => account.id === parseInt(req.params.id, 10)
    );

    if (account) {
      res.send(account);
    } else {
      res.end();
    }
  } catch (error) {
    res.status(400).send({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    let data = await readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);

    let accounts = json.accounts.filter(
      (account) => account.id !== parseInt(req.params.id, 10)
    );
    json.accounts = accounts;

    await writeFile(global.fileName, JSON.stringify(json));
  } catch (error) {
    res.status(400).send({ error: err.message });
  }
});

router.put('/', async (req, res) => {
  try {
    let newAccount = req.body;
    let data = await readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);
    let oldIndex = json.accounts.findIndex(
      (account) => account.id === newAccount.id
    );

    json.accounts[oldIndex] = newAccount;

    await writeFile(global.fileName, JSON.stringify(json));
    res.end();
  } catch (error) {
    res.status(400).send({ error: err.message });
  }
});

router.post('/deposit', async (req, res) => {
  try {
    let params = req.body;
    let data = await readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);
    let index = json.accounts.findIndex((account) => account.id === params.id);
    json.accounts[index].balance += params.value;
    await writeFile(global.fileName, JSON.stringify(json));
    res.send(json.accounts[index]);
  } catch (error) {
    res.status(400).send({ error: err.message });
  }
});

export default router;
