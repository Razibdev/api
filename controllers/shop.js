const Product = require("../models/product");
// const Cart = require('../models/cart');
// const Order = require('../models/order');

exports.getProducts =(req, res, next) => {
  Product.fetchAll()
    .then((product) => {
        res.render("shop/product-list", {
          prods: product,
          pageTitle: "All Products",
          path: "/products",
        });
    })
    .catch((err) => {
      console.log(err);
    });
};


exports.getProduct = (req, res, next) =>{
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product?.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) =>{
  Product.fetchAll().then(product =>{
    res.render("shop/index", {
      prods: product,
      pageTitle: "Shop",
      path: "/",
    });
  }).catch(err=>{
    console.log(err);
  });

};

exports.getCart = (req, res, next) =>{

  req.user.getCart()
  .then(products =>{
          res.render("shop/cart", {
            path: "/cart",
            pageTitle: "My Cart",
            products: products,
          });
    }).catch(err=>console.log(err));

};

exports.postCart = (req, res, next) =>{
  const prodId = req.body.productId;
  Product.findById(prodId).then(product=>{
    return req.user.addToCart(product);
  }).then(result=>{
    // console.log(result);
    res.redirect("/cart");
  }).catch(err => console.log(err))

  // console.log(prodId);
  // Product.findById(prodId, (product)=>{
  //   Cart.addProduct(prodId, product.price);
  // })
  // let fetchCart;
  // let newQuantity = 1;
  // req.user.getCart().then(cart=>{
  //   fetchCart = cart;
  //   return cart.getProducts({where:{id:prodId}});
  // }).then(products=>{
  //   let product;
  //   if(products.length > 0){
  //     product = products[0];
  //   }
    
  //   if(product){
  //     const oldQuantity = product.cartItem.quantity;
  //     newQuantity = oldQuantity+1;
  //     return product;
  //   }
  //   return Product.findByPk(prodId)
    
  // })
  // .then(product=>{
  //    return fetchCart.addProduct(product, {
  //      through: { quantity: newQuantity },
  //    });
  // })
  // .then(()=>{
  //   res.redirect("/cart");
  // }).catch(err=>console.log(err));

} 

exports.getOrder = (req, res, next) => {
  req.user.getOrders()
    .then(orders=>{
      res.render("shop/order", {
        path: "/orders",
        pageTitle: "My Order",
        orders: orders 
      });
    })
    .catch(err=>console.log(err));
  
};


exports.getCheckout = (req, res, next) =>{
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};

exports.postOrder = (req, res, next) =>{
 
  req.user.addOrder()
  .then(result=>{
         res.redirect("/orders");
      }).catch(err=>{
        console.log(err);
      });
}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  req.user
    .deleteItemFromCart(prodId)
    
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));

  // Product.findById(prodId, product=>{
  //   Cart.deleteProduct(prodId, product.price);
  //   res.redirect('/cart')
  // })


};
