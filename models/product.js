const fs = require('fs');
const path = require('path');
// const products = []; //1

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
    constructor(t){
        this.title = t;
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
          products.push(this);
              fs.writeFile(p, JSON.stringify(products), (err)=>{
                  console.log(err);
              })
        });

    }

    static fetchAll(cb){
         getProductFromFile(cb);
        // return products;
    }
}