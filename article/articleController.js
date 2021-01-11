const express = require("express");
const router = express.Router();
const Category = require("../category/Category");
const Article = require("../article/Article");
const sluger = require("slugify");

router.get("/admin/articles", (req, res) =>{
    Article.findAll({
        include: [{model: Category}]
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

    Article.create({
        title: title,
        slug: sluger(title),
        body: body,
        categoryId: category
    }).then(() => {   
        res.redirect("/admin/articles");
    });
});

router.post("/articles/delete", (req, res) => {});

router.get("/articles/edit/:id", (req, res) => {});

router.post("/articles/update", (req, res) => {});

module.exports = router;