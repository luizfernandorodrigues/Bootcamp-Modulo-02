import express from 'express';
import { promises } from 'fs';

const lerArquivo = promises.readFile;
const gravarArquivo = promises.writeFile;
const nomeArquivoEstados = 'Estados.json';
const nomeArquivoCidades = 'Cidades.json';

let listaDeEstados = [];
let listaDeCiades = [];

const app = express();
app.use(express.json());

app.listen(3000, async () => {
  await lerArquivoEstados();
  await lerArquivoCidades();
  await gravarEstadosComAsCidades();
});

quantidadeCidadePelaUf('PR');
verificarOsCincoEstadosComMaisCidades();

async function lerArquivoEstados() {
  try {
    const listaEstadosLocal = await lerArquivo(nomeArquivoEstados, 'utf8');
    listaDeEstados = JSON.parse(listaEstadosLocal);
  } catch (error) {
    console.log('Erro no método lerArquivoEstados ' + error);
  }
}

async function lerArquivoCidades() {
  try {
    const listaCidadeLocal = await lerArquivo(nomeArquivoCidades, 'utf8');
    listaDeCiades = JSON.parse(listaCidadeLocal);
  } catch (error) {
    console.log('Erro no método lerArquivoCidades ' + error);
  }
}

async function gravarEstadosComAsCidades() {
  try {
    listaDeEstados.forEach((estado) => {
      let estadoId = estado.ID;
      let sigla = estado.Sigla;

      let arquivoCidadeTemp = [];

      arquivoCidadeTemp = listaDeCiades.filter(
        (cidade) => cidade.Estado === estadoId
      );

      arquivoCidadeTemp.sort((a, b) => {
        if (a.Nome.length < b.Nome.length) return -1;
        if (a.Nome.length > b.Nome.length) return 1;

        return a.Nome.localeCompare(b.Nome);
      });

      gravarArquivo(
        `./Estados/${sigla}.json`,
        JSON.stringify(arquivoCidadeTemp)
      );
    });
  } catch (error) {
    console.log('Erro no método gravarEstadosComAscidades ' + error);
  }
}

async function quantidadeCidadePelaUf(uf) {
  let cidadesPorEstado = await lerArquivo(`./Estados/${uf}.json`, 'utf8');
  let data = JSON.parse(cidadesPorEstado);

  let quantidadeCidadePorEstado = [];

  quantidadeCidadePorEstado.push({ UF: uf, quantidade: data.length });

  console.log(`Quantidade de cidade do estado ${uf} = ${data.length}`);

  return data.length;
}

async function cidadeMaiorNome(uf) {
  let cidades = await lerArquivo(`./Estados/${uf}.json`, 'utf8');
  let data = JSON.parse(cidades);

  let nomeMaior = data[data.length - 1];

  return nomeMaior;
}

async function cidadeMenorNome(uf) {
  let cidades = await lerArquivo(`./Estados/${uf}.json`, 'utf8');
  let data = JSON.parse(cidades);

  let nomeMenor = data[0];

  return nomeMenor;
}

async function verificarOsCincoEstadosComMaisCidades() {
  try {
    listaDeEstados = await lerArquivo(nomeArquivoEstados, 'utf8');
    let data = JSON.parse(listaDeEstados);

    let estadosComQuantidadeCidade = [];
    let estadosComCidadeMaiorMenorNome = [];
    let estadosComCidadeMenorNome = [];

    for (const estado of data) {
      const quantidadeDeCidades = await quantidadeCidadePelaUf(estado.Sigla);
      estadosComQuantidadeCidade.push({
        UF: estado.Sigla,
        quantidade: quantidadeDeCidades,
      });

      const nome = await cidadeMaiorNome(estado.Sigla);
      estadosComCidadeMaiorMenorNome.push({
        descricao: `${nome.Nome} - ${estado.Sigla}`,
      });

      const MenorNome = await cidadeMenorNome(estado.Sigla);
      estadosComCidadeMenorNome.push({
        descricao: `${MenorNome.Nome} - ${estado.Sigla}`,
      });
    }

    estadosComQuantidadeCidade.sort((a, b) => {
      return b.quantidade - a.quantidade;
    });

    let estadoFiltradoMaisCidades = estadosComQuantidadeCidade.slice(0, 5);
    let estadoFiltradoComMenosCidades = estadosComQuantidadeCidade.slice(
      estadosComQuantidadeCidade.length - 5
    );
    console.log(estadoFiltradoMaisCidades);
    console.log(estadoFiltradoComMenosCidades);
    console.log(estadosComCidadeMaiorMenorNome);
    console.log(estadosComCidadeMenorNome);

    estadosComCidadeMaiorMenorNome.sort((a, b) => {
      if (a.descricao.length < b.descricao.length) return -1;
      if (a.descricao.length > b.descricao.length) return 1;

      return a.descricao.localeCompare(b.descricao);
    });

    estadosComCidadeMenorNome.sort((a, b) => {
      if (a.descricao.length < b.descricao.length) return -1;
      if (a.descricao.length > b.descricao.length) return 1;

      return a.descricao.localeCompare(b.descricao);
    });

    console.log(
      estadosComCidadeMaiorMenorNome[estadosComCidadeMaiorMenorNome.length - 1]
    );

    console.log(estadosComCidadeMenorNome[0]);
  } catch (error) {
    console.log('Erro no metodo verificarOsCincoEstadosComMaisCidades' + error);
  }
}
