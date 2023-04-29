const Product = require("../models/product");
const Cart = require('../models/cart');

exports.getProducts =(req, res, next) => {
  // console.log("In the middleware", AdminData.products);
  // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
//   const products = AdminData.products;
//   res.render("shop", { prods: products, pageTitle: "Shop", path: "/" });
Product.fetchAll(productc =>{
  res.render("shop/product-list", {
    prods: productc,
    pageTitle: "All Products",
    path: "/products"
  });
});

};


exports.getProduct = (req, res, next) =>{
  const prodId = req.params.productId;
  Product.findById(prodId, product =>{
   res.render("shop/product-detail", {
     product: product,
     pageTitle: product.title,
     path: "/products",
   });
  });
  // res.redirect('/');
};

exports.getIndex = (req, res, next) =>{
  Product.fetchAll((productc) => {
    res.render("shop/index", {
      prods: productc,
      pageTitle: "Shop",
      path: "/"
    });
  });
};

exports.getCart = (req, res, next) =>{
  Cart.getCarts(cart=>{
    const cartProduct = [];
    Product.fetchAll(products=>{
      for(product of products){
        const cartProductData = cart.products.find(prod=> prod.id === product.id);
        if (cartProductData) {
          cartProduct.push({ productData: product, qty: cartProductData.qty});
        }
      }

      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "My Cart",
        products: cartProduct,
      });
    });
      
  });
};

exports.postCart = (req, res, next) =>{
  const prodId = req.body.productId;
  console.log(prodId);
  Product.findById(prodId, (product)=>{
    Cart.addProduct(prodId, product.price);
  })
  res.redirect('/cart');

} 

exports.getOrder = (req, res, next) => {
  res.render("shop/order", {
    path: "/orders",
    pageTitle: "My Order",
  });
};


exports.getCheckout = (req, res, next) =>{
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product=>{
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart')
  })
};
