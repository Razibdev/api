const path = require('path');
const rootDir = require("../util/path");
const express = require('express');
const router = express.Router();
const AdminData = require('./admin');

router.get("/", (req, res, next) => {
  // console.log("In the middleware", AdminData.products);
  // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
  const products = AdminData.products;
  res.render("shop", { prods: products, pageTitle: "Shop", path: "/" });
});

module.exports = router;