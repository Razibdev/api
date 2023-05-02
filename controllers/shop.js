const Product = require("../models/product");
// const Cart = require('../models/cart');
// const Order = require('../models/order');

exports.getProducts =(req, res, next) => {
  Product.findAll()
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
  Product.findByPk(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) =>{
  Product.findAll().then(product =>{
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
  .then(cart=>{
    return cart.
    getProducts().then(products =>{
          res.render("shop/cart", {
            path: "/cart",
            pageTitle: "My Cart",
            products: products,
          });
    }).catch(err=>console.log(err));
  })
  .catch(err=> console.log(err))
  // Cart.getCarts(cart=>{
  //   const cartProduct = [];
  //   Product.fetchAll(products=>{
  //     for(product of products){
  //       const cartProductData = cart.products.find(prod=> prod.id === product.id);
  //       if (cartProductData) {
  //         cartProduct.push({ productData: product, qty: cartProductData.qty});
  //       }
  //     }

      // res.render("shop/cart", {
      //   path: "/cart",
      //   pageTitle: "My Cart",
      //   products: cartProduct,
      // });
  //   });
      
  // });



};

exports.postCart = (req, res, next) =>{
  const prodId = req.body.productId;
  // console.log(prodId);
  // Product.findById(prodId, (product)=>{
  //   Cart.addProduct(prodId, product.price);
  // })
  let fetchCart;
  let newQuantity = 1;
  req.user.getCart().then(cart=>{
    fetchCart = cart;
    return cart.getProducts({where:{id:prodId}});
  }).then(products=>{
    let product;
    if(products.length > 0){
      product = products[0];
    }
    
    if(product){
      const oldQuantity = product.cartItem.quantity;
      newQuantity = oldQuantity+1;
      return product;
    }
    return Product.findByPk(prodId)
    
  })
  .then(product=>{
     return fetchCart.addProduct(product, {
       through: { quantity: newQuantity },
     });
  })
  .then(()=>{
    res.redirect("/cart");
  }).catch(err=>console.log(err));

} 

exports.getOrder = (req, res, next) => {
  req.user.getOrders({include:['products']})
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
  let fetchedCart;
  req.user.getCart().then(cart=>{
    fetchedCart = cart;
    return cart.getProducts();
      }).then(products=>{
        return req.user.createOrder()
              .then(order=>{
                order.addProducts(products.map(product=>{
                  product.orderItem = {quantity: product.cartItem.quantity};
                  return product;
                }))
              })
              .catch(err=> console.log(err))
      }).then(order=>{

      }).then(result=>{
       return fetchedCart.setProducts(null);
       
      }).then(result=>{
         res.redirect("/orders");
      }).catch(err=>{
        console.log(err);
      });
}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  req.user.getCart()
  .then(cart=>{
    return cart.getProducts({where:{id:prodId}});
  }).then(products=>{
    const product = products[0];
    return product.cartItem.destroy();

  }).then(result=>{
    res.redirect('/cart');
  }).catch(err=> console.log(err));

  // Product.findById(prodId, product=>{
  //   Cart.deleteProduct(prodId, product.price);
  //   res.redirect('/cart')
  // })


};
