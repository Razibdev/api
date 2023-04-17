const path = require('path');
// const rootDir = require("../util/path");
const express = require('express');
const router = express.Router();
const productsController = require("../controllers/products");
router.get("/", productsController.getProducts);

module.exports = router;