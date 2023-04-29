const fs = require('fs');
const path = require('path');
// const products = []; //1
const Cart = require('./cart');

 const p = path.join(
   path.dirname(process.mainModule.filename),
   "data",
   "products.json"
 );

const getProductFromFile = (cb) =>{
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return cb([]);
      }else{
          return cb(JSON.parse(fileContent));
      }
    });
}
module.exports = class Product{
    constructor(id, title, imageUrl, description, price){
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save(){
        // products.push(this); //1
        // const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

        // fs.readFile(p, (err, fileContent)=>{
        //     console.log(fileContent);
        //     let products = [];
        //     if(!err){
        //         products = JSON.parse(fileContent);
        //     }
        //     products.push(this);
        //     fs.writeFile(p, JSON.stringify(products), (err)=>{
        //         console.log(err);
        //     })
        // })

      

        getProductFromFile(products=>{
          if(this.id){
            const existingProductIndex = products.findIndex(prod => prod.id === this.id);
            const updatedProduct = [... products];
            updatedProduct[existingProductIndex] = this;
             fs.writeFile(p, JSON.stringify(updatedProduct), (err) => {
               console.log(err);
             });
          }else{
              this.id = Math.random().toString();
            products.push(this);

            fs.writeFile(p, JSON.stringify(products), (err) => {
              console.log(err);
            });
          }
          
        });

    }

    static deleteById(id){
       getProductFromFile((products) => {
        //  const productIndex = products.findIndex((p) => p.id === id);
        const product = products.find(prod=> prod.id === id);

          const updatedProducts = products.filter((p) => p.id !== id);

            fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
              if(!err){
                Cart.deleteProduct(id, product.price)
              }
            });
        
       });
    }

    static fetchAll(cb){
         getProductFromFile(cb);
        // return products;
    }


    static findById(id, cb){
      getProductFromFile(products =>{
        const product = products.find(p=> p.id === id);
        cb(product);
      });
    }
}