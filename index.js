const express = require("express"); //Carregando modulo express
const bodyParser = require("body-parser"); //Carregando modulo body parser
const connection = require("./database/database"); //Carregando objeto conexão
const app = express(); //Instanciando express
const articleController = require("./article/articleController"); //Importando controller 
const categoryController = require("./category/categoryController"); //Importando controller 
const Article = require("./article/Article");
const Category = require("./category/Category");

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

//Rota principal
app.get("/", (req, res) => {
    
    Article.findAll({
        order: [['id','DESC']]  
    }).then(articlesDB =>{
        res.render('index', {articles: articlesDB});
    });
});

//Rota categoria
app.use("/", categoryController);

//Rota artigo
app.use("/", articleController);

//Rota carregar artigo pela slug
app.get("/:slug", (req, res) =>{
    let slug = req.params.slug;

    Article.findOne({
        where: {
            slug: slug
        }
    }).then(articleDB => {
        if(articleDB != undefined){
        
            res.render("article", {article: articleDB});
        
        }else{
            res.redirect("/");
        }
    }).catch(error =>{
        res.redirect("/");
    });
});

app.get("/article/page/:num", (req, res) =>{
    let page = req.params.num;
    let offset = 0;

    if(!isNaN(page) || page > 1){
        offset = page * 3;
    }

    Article.findAndCountAll({
        limit: 3,
        offset: offset         
    }).then(articles => {

        let next;

        if(offset + 3 >= articles.count){
            next = false;
        }else{
            next = true;
        };

        var result ={
            next: next,
            articles: articles
        };

        Category.findAll().then(categories => {
            res.render("admin/articles/page", {result: result, categories: categories});
        }); 
    });
});
 
//Abrindo o servidor
app.listen(8080, () =>{
    console.log("NO AR FDP PA PA PA!");
});