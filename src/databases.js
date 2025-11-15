// Importa o módulo de leitura de arquivos padrão do Node (não usado diretamente aqui, mas pode ser útil)
import { read } from "node:fs"

// Importa a versão baseada em Promises do módulo 'fs' (file system)
// Essa versão permite usar async/await ou .then/.catch sem callbacks
import fs from "node:fs/promises"

// Define o caminho absoluto do arquivo de banco de dados (db.json)
// A função new URL garante que o caminho seja resolvido corretamente, mesmo em módulos ES
const databasePath = new URL("../db.json", import.meta.url)

// Exporta a classe 'Database' como padrão do módulo
export default class Database {

  // Campo privado (#database)
  // Usado para armazenar os dados do banco em memória (objeto JS)
  #database = {}

  // O construtor é executado automaticamente ao instanciar a classe
  constructor() {
    // Tenta ler o arquivo db.json
    fs.readFile(databasePath, "utf-8")
      .then(data => {
        // Se o arquivo existir e tiver conteúdo, faz o parse do JSON e carrega em memória
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        // Caso o arquivo não exista ou ocorra erro de leitura,
        // cria o arquivo vazio chamando o método privado #persist()
        this.#persist()
      })
  }

  // Método privado responsável por salvar os dados em disco
  #persist() {
    // Converte o objeto #database em string JSON e grava no arquivo db.json
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  // Método público para buscar todos os registros de uma tabela
  select(table) {
    // Retorna o conteúdo da tabela solicitada ou um array vazio se ela não existir
    const data = this.#database[table] ?? []
    return data
  }

  // Método público para inserir dados em uma tabela
  insert(table, data) {
    // Verifica se a tabela já existe e é um array
    if (Array.isArray(this.#database[table])) {
      // Se existir, adiciona o novo registro
      this.#database[table].push(data)
    } else {
      // Caso contrário, cria a tabela como um novo array contendo o primeiro item
      this.#database[table] = [data]
    }

    // Após inserir, salva o novo estado do banco em disco
    this.#persist()

    // Retorna o registro inserido
    return data
  }
}
