const Product = require("../models/product");

exports.getAddProduct = (req, res, next) =>{
    res.render('add-product', {
        pageTitle: 'add Product',
        path: '/admin/add-product',
        formsCss: true,
        productCss: true,
        activeAddProduct: true
    });
}

exports.postAddProduct = (req, res, next) => {
    const product = new Product(req.body.title);
    product.save();
    res.redirect("/");
};

exports.getProducts =(req, res, next) => {
  // console.log("In the middleware", AdminData.products);
  // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
//   const products = AdminData.products;
//   res.render("shop", { prods: products, pageTitle: "Shop", path: "/" });
Product.fetchAll(productc =>{
  res.render("shop", {
    prods: productc,
    pageTitle: "Shop",
    path: "/",
    hasProducts: productc.length > 0,
    activeShop: true,
    productCSS: true,
  });
});


};