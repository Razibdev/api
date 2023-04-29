const Product = require("../models/product");
exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "add Product",
    path: "/admin/add-product",
    formsCss: true,
    productCss: true,
    activeAddProduct: true,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title       = req.body.title;
  const imageUrl    = req.body.imageUrl;
  const description = req.body.description;
  const price       = req.body.price;
  const product = new Product(null,title, imageUrl, description, price);
  product.save();
  res.redirect("/");
};

exports.getProducts = (req, res, next) =>{
     Product.fetchAll((productc) => {
       res.render("admin/products", {
         prods: productc,
         pageTitle: "Admin Products",
         path: "/admin/products",
       });
     });
}


exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if(!editMode){
   return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId, product=>{
    if(!product){
      return res.redirect('/');
    }
     res.render("admin/edit-product", {
       pageTitle: "Edit Product",
       path: "/admin/edit-product",
       editing: editMode,
       product: product
     });
  })

 
};

exports.postEditProduct = (req, res, next) =>{
  const prodId = req.body.productId;
  console.log(prodId);
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDescription = req.body.description;
  const updatedProduct = new Product(prodId, updatedTitle, updatedImageUrl, updatedDescription, updatedPrice);
  updatedProduct.save();
  res.redirect('/admin/products')


}

exports.postDeleteProduct = (req, res, next) =>{
  const prodId = req.body.productId;
  const product = Product.deleteById(prodId);
  res.redirect("/admin/products");

}