const { DataTypes } = require("sequelize");
const conexao = require("../DB/conn");
const Usuario = require("./usuarioModel");
const modelService = require("../services/modelService");

const Candidato = conexao.define("Candidato", {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dataNascimento: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  cpf: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  telefone: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  cidadeNaturalidade: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  endereco: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  obsStatus: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  curriculo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    get() {
      return modelService.formataData(this.getDataValue("createdAt"));
    },
  },
});

Usuario.hasMany(Candidato, {
  onDelete: "CASCADE",
});
Candidato.belongsTo(Usuario);

Candidato.sync()
  //.sync({ force: true })
  .then(() => console.log("Tabela Candidato Sincronizada com sucesso!"))
  .catch((err) =>
    console.log("erro ao sincronizar a tabela Candidato: " + err)
  );

module.exports = Candidato;
