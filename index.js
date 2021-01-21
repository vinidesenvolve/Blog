const express = require("express"); //Carregando modulo express
const bodyParser = require("body-parser"); //Carregando modulo body parser
const connection = require("./database/database"); //Carregando objeto conexão

const app = express(); //Instanciando express

//Importando controllers 
const articleController = require("./article/articleController");
const categoryController = require("./category/categoryController");
const userController = require("./user/userController");

//Estanciando model
const Article = require("./article/Article");

//Definindo a View Engine
app.set('view engine','ejs');

//Configurando Body-parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Configurando aquivos estaticos
app.use(express.static('public'));

//Conectando ao BD
connection
    .authenticate()
    .then(() => {
        console.log("BD CONECTADO")
    }).catch((error) => {
        console.log(error)
    });

//Rota home
app.get("/", (req, res) => {
    
    Article.findAll({
        order: [['id','DESC']],
        limit: 3
    }).then(articlesDB =>{
        res.render('index', {articles: articlesDB});
    });
});

//Rota categoria
app.use("/", categoryController);

//Rota artigo
app.use("/", articleController);

//Rota user
app.use("/", userController);

//Abrindo o servidor
app.listen(8080, () =>{
    console.log("NO AR FDP PA PA PA!");
});