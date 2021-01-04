const Sequelize = require("sequelize");
const connection = require("../database/database");
const Category = require("../category/Category");

const Article = connection.define('articles', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

//Definindo relacionamentos dos modelos
Article.belongsTo(Category); //1-1
Category.hasMany(Article); //1-N

Article.sync({force: false});

module.exports = Article;