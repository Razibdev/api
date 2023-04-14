const path = require('path');
const rootDir = require('../util/path');
const express = require('express');
const router = express.Router();

const productc = [];
router.get("/add-product", (req, res, next) => {

  // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
  res.render('add-product', {pageTitle: 'Add Product', path: '/admin/add-product'});
});

router.post("/add-product", (req, res, next) => {
  console.log(req.body);
  productc.push({ title: req.body.title });
  res.redirect("/");
});

exports.routes = router;
exports.products = productc
