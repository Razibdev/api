const path = require('path');
// const rootDir = require("../util/path");
const express = require('express');
const router = express.Router();
const shopController = require("../controllers/shop");
router.get("/", shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/delete');
router.get("/products/:productId", shopController.getProduct);
router.get('/cart', shopController.getCart);
router.post('/cart', shopController.postCart);
router.post('/cart-delete-item', shopController.postCartDeleteProduct);
router.post('/create-order', shopController.postOrder);

router.get('/orders', shopController.getOrder);
router.get('/checkout', shopController.getCheckout);

module.exports = router;