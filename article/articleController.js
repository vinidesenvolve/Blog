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
        res.render("../views/admin/articles/articles", {articles: articlesDB});
    });
});

router.get("/admin/articles/new", (req, res) =>{
    Category.findAll().then(categories =>{
        res.render("../views/admin/articles/new", {categories: categories});
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

                    res.render("../views/admin/articles/edit", {article: articleDB, categories: categoriesDB});
         
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

router.post("/articles/update", (req, res) => {});

module.exports = router;