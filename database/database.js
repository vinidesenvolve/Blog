//Definindo a objeto de conexão com o Banco de Dadosconst Sequelize = require("sequelize");
const Sequelize = require('sequelize');

const connection = new Sequelize('Blog','root','qwer', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;