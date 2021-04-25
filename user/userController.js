const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");
const adminAuth = require("../middleware/adminAuth");

router.get("/admin/users/new", (req, res) => {
    res.render("admin/users/new");
});

router.post("/users/save", (req, res) =>{
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;

    if(name != undefined && email != undefined && password != undefined){
        
        User.findOne({where: {email: email}}).then( user => {
            if(user == undefined){

                let salt = bcrypt.genSaltSync(10);
                let hash = bcrypt.hashSync(password, salt);

                User.create({
                    name: name,
                    email: email,
                    password: hash
                }).then(() => {

                    res.redirect("/");
                
                }).catch((error) => {
                    
                    res.redirect("/admin/users/new");
                
                });
            }else{
                res.redirect("/admin/users/new");
            };
        });
    }else{
        res.redirect("/admin/users/new");
    };
});

router.get("/admin/users", adminAuth, (req, res) => {
    
    User.findAll({
        order: [['id','DESC']]
    }).then((usersDB) => {
        res.render("admin/users/users", {users: usersDB});
    });
});

router.post("/users/delete", adminAuth, (req, res) => {
    let id = req.body.id;

    if(!isNaN(id) && id != undefined){
        User.destroy({where: {id: id}})
        .then(() => {
            res.redirect("/admin/users");
        });
    }else{
        res.redirect("/admin/users");
    };
});

router.get("/login", (req, res) => {
    res.render("admin/users/login");
});

router.post("/admin/authenticate", (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({where: {email: email}}).then(user => {
        if(user == undefined){
            res.redirect("/login");
        }else{
            let pass = bcrypt.compareSync(password, user.password);

            if(pass){
                req.session.user = {
                    id: user.id,
                    email: user.email
                };
                
                res.redirect("/");

            }else{
                res.redirect("/login");
            }
        };
    });
});

router.get("/logout", (req, res) => {
    req.session.user = undefined;
    res.redirect("/");
});

module.exports = router;