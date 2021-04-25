const express = require("express"); //Carregando modulo express
const connection = require("./database/database"); //Carregando objeto conexão
const session = require("express-session");//Carregando bibiotleca de sessões
const app = express(); //Instanciando express

//Importando controllers 
const articleController = require("./article/articleController");
const categoryController = require("./category/categoryController");
const userController = require("./user/userController");

//Estanciando model
const Article = require("./article/Article");

//Definindo a View Engine
app.set('view engine','ejs');

//Configurando a sessão
app.use(session({
    secret: "3456uhft6789okji90pkjhy67ug", 
    cookie: {maxAge: 30000},
    resave: true,
    saveUninitialized: true
}));

//Indentificar Request Object como string ou array
app.use(express.urlencoded({extended: true}));
//Indentificar Request Object como JSON Object
app.use(express.json());

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
const server = app.listen(8080, () =>{
    console.log(`Server is on at ${server.address().port}`);
});