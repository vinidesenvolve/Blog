const express = require("express");
const router = express.Router();
const Category = require("./Category");
const sluger = require("slugify");

router.get("/categories", (req, res) => {
    res.send("Categories");
});

router.get("/admin/categories/new", (req, res) => {
    res.render("../views/admin/categories/new");
});

router.post("/categories/save", (req, res) =>{
    let title = req.body.title;

    if(title != undefined){
        Category.create({
            title: title,
            slug: sluger(title)
        }).then(() => {
            res.redirect("/");
        });
    }else{
        res.render("/admin/categories/new");
    };
});

router.get("/admin/categories", (req, res) =>{
    Category.findAll().then(categoriesDB => {
        res.render("../views/admin/categories/categories", 
        {categories: categoriesDB})
    });
});

router.post("/categories/delete", (req, res) => {
    let id = req.body.id;

    if(!isNaN(id) && id != undefined){

        Category.destroy({where: { id: id }})
        .then(() => {
            res.redirect("/admin/categories")
        });

    }else{
        res.redirect("/admin/categories");
    };
});

module.exports = router;