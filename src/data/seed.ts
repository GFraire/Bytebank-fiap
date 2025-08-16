const fs = require("fs");
const path = require("path");

// Dados para popular o JSON Server
const data = {
  users: [
    {
      id: 1,
      name: "Gabriel Freire de Araújo",
      balance: 0,
    },
    {
      id: 2,
      name: "Lana Carrero",
      balance: 0,
    },
  ],
  transactions: [],
};

// Caminho para o arquivo db.json
const dbPath = path.resolve(__dirname, "../db.json");

// Salva os dados no arquivo db.json
fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

console.log("✅ Banco de dados populado com sucesso!");
