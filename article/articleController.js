const express = require("express");
const router = express.Router();
const Category = require("../category/Category");
const Article = require("../article/Article");
const sluger = require("slugify");

router.get("/admin/articles", (req, res) =>{
    
    Article.findAll({
        include: [{model: Category}],
        order: [['id','DESC']]
    }).then((articlesDB) =>{
        res.render("admin/articles/articles", {articles: articlesDB});
    });
});

router.get("/admin/articles/new", (req, res) =>{
    Category.findAll().then(categories =>{
        res.render("admin/articles/new", {categories: categories});
    });
});

router.post("/articles/save", (req, res) => {
    let title = req.body.title;
    let body = req.body.body;
    let category = req.body.categories;

    if(title != undefined && body != undefined && category != undefined){
        Article.create({
            title: title,
            slug: sluger(title),
            body: body,
            categoryId: category
        }).then(() => {   
            res.redirect("/admin/articles");
        });
    }else{
        res.render("/admin/articles/new");
    };
});

router.post("/articles/delete", (req, res) => {
    let id = req.body.id;

    if(id != undefined && !isNaN(id)){
        Article.destroy({where: {id: id}})
        .then(() => {
            res.redirect("/admin/articles");
        });
    }else{
        res.redirect("/admin/articles");
    };
});

router.get("/admin/articles/edit/:id", (req, res) => {
    let id = req.params.id;
    
    Article.findByPk(id).then(articleDB => {
        if(articleDB != undefined){
            
            Category.findAll().then(categoriesDB => {
                if(categoriesDB != undefined){

                    res.render("admin/articles/edit", {article: articleDB, categories: categoriesDB});
         
                }else{
                    res.redirect("/admin/articles");
                };
           });
        }else{
            res.redirect("/admin/articles");
        };
    }).catch(error => {
        res.redirect("/admin/articles");
    });
});

router.post("/articles/update", (req, res) => {
    let id = req.body.id;
    let title = req.body.title;
    let body = req.body.body;
    let category = req.body.categories;

    Article.update({
        title: title,
        slug: sluger(title),
        body: body,
        categoryId: category
    },{
        where: {id: id}
    }).then(() => {
        res.redirect("/admin/articles");
    });
});

router.get("/:slug", (req, res) =>{
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

router.get("/article/page/:num", (req, res) =>{
    let page = req.params.num;
    let offset = parseInt(page * 3);
    
    if(page <= 0 || isNaN(page)){
        res.redirect("/");
    }
    
    Article.findAndCountAll({
        limit: 3,
        offset: offset,
        order: [['id','DESC']]
    }).then(articles => {
        let next = true;

        if(offset + 3 >= articles.count)
            next = false;

        var result ={
            page: parseInt(page),
            next: next,
            articles: articles
        };

        Category.findAll().then(categories => {
            res.render("admin/articles/page", {result: result, categories: categories});
        }); 
    });
});

module.exports = router;