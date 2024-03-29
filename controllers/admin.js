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
  // Product.create({
  //   title: title,
  //   price: price,
  //   imageUrl: imageUrl,
  //   description: description,
  //   userId: req.user.id
  // })
  console.log(req.user);
  const product = new Product(title, price, description, imageUrl, null, req.user._id);
   product.save().then((result) => {
      console.log(result);
      res.redirect("/admin/products");
    })
    .catch((err) => {console.log(err);});
};

exports.getProducts = (req, res, next) =>{
  Product.fetchAll()
  
  .then(product=>{
     res.render("admin/products", {
       prods: product,
       pageTitle: "Admin Products",
       path: "/admin/products",
     });
  }).catch(err=>{
    console.log(err);
  })
    //  Product.fetchAll((productc) => {
    //    res.render("admin/products", {
    //      prods: productc,
    //      pageTitle: "Admin Products",
    //      path: "/admin/products",
    //    });
    //  });
}


exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if(!editMode){
   return res.redirect('/');
  }
  const prodId = req.params.productId;

  Product.findById(prodId)
  
  .then(product=>{
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      // product: product,
      product: product,
    });
  }).catch(err=> console.log(err));

};

exports.postEditProduct = (req, res, next) =>{
  const prodId = req.body.productId;
  console.log(prodId);
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDescription = req.body.description;
  const product = new Product(
    updatedTitle,
    updatedPrice,
    updatedDescription,
    updatedImageUrl,
    prodId,
    req.user._id
  );

    product.save().then((result) => {
      console.log("Updated Product");
    })
    .catch((err) => console.log(err));

  res.redirect('/admin/products')


}

exports.postDeleteProduct = (req, res, next) =>{
  const prodId = req.body.productId;
  // const product = Product.deleteById(prodId);
    Product.deleteById(prodId)
     .then(() => {
       console.log("Destroyed product");
       res.redirect("/admin/products");
     })
     .catch((err) => console.log(err));


}