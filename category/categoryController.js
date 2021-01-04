const express = require("express");
const router = express.Router();

router.get("/categories", (req, res) => {
    res.send("Categories");
});

router.get("/admin/categories/new", (req, res) => {
    res.render("../views/admin/categories/new");
});

module.exports = router;
