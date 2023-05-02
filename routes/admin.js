const path = require('path');
const rootDir = require('../util/path');
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

// /admin/add-product => GET
router.get("/add-product", adminController.getAddProduct);
router.post("/add-product", adminController.postAddProduct);
// /admin/add-product => GET
router.get('/products', adminController.getProducts);
router.get("/edit-product/:productId", adminController.getEditProduct);
router.post("/edit-product", adminController.postEditProduct);
router.post("/delete-product", adminController.postDeleteProduct);


module.exports = router;

