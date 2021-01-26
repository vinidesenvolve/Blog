const express = require("express");
const router = express.Router();
const Category = require("./Category");
const sluger = require("slugify");
const adminAuth = require("../middleware/adminAuth");

router.post("/categories/save", adminAuth, (req, res) =>{
    let title = req.body.title;

    if(title != undefined){
        Category.create({
            title: title,
            slug: sluger(title)
        }).then(() => {
            res.redirect("/admin/categories");
        });
    }else{
        res.render("admin/categories/new");
    };
});

router.get("/admin/categories", adminAuth, (req, res) =>{
    Category.findAll().then(categoriesDB => {
        res.render("admin/categories/categories", 
        {categories: categoriesDB})
    });
});

router.post("/categories/delete", adminAuth, (req, res) => {
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

router.get("/admin/categories/edit/:id", adminAuth, (req, res) =>{
    let id = req.params.id;

    Category.findByPk(id).then(category =>{
        if(category != undefined){
            res.render("admin/categories/edit", {category: category});
        }else{
            res.redirect("/admin/categories");
        };
    }).catch(error => {
            res.redirect("/admin/categories");
    });
});

router.post("/admin/update", adminAuth, (req, res) =>{
    let id = req.body.id;
    let title = req.body.title;

    Category.update({
        title: title,
        slug: sluger(title)
    },{
        where: {id: id}
    }).then(() => {
        res.redirect("/admin/categories")
    });
});

module.exports = router;