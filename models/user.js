const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;
class User{
    constructor(username, email, cart, id){
        this.name = username;
        this.email = email;
        this.cart = cart; // { item: []}
        this._id = id;
    }

    save(){
        const db = getDb();
       return db.collection('users')
        .insertOne(this)
        .then()
        .catch(err=> console.log(err));
    }

    addToCart(product){

        const cartProductIndex = this.cart.items.findIndex(cp=>{
            return cp.productId.toString() == product._id.toString();
        });

        console.log(cartProductIndex);
        let newQuantity = 1;
        const updatedCartItem = [...this.cart.items];
        
        if(cartProductIndex >= 0){
            newQuantity = this.cart.items[cartProductIndex].quantity +1;
        updatedCartItem[cartProductIndex].quantity = newQuantity;

        }else{
            updatedCartItem.push({
              productId: new mongodb.ObjectId(product._id),
              title: product.title,
              price: product.price,
              quantity: newQuantity,
            });
        }

        

        const updatedCart = { items: updatedCartItem };

        const db = getDb();
        return db.collection('users').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: {cart: updatedCart}});

    }

    getCart(){
        const db = getDb();
        const productIds = this.cart.items.map(i =>{
            return i.productId;
        })
       return db.collection('products').find({_id: {$in: productIds}}).toArray().then(products =>{
        return products.map(p=>{
            const pp = this.cart.items.find((i) => {
              return i.productId.toString() == p._id.toString();
            });

            return {...p,price: pp.price, quantity: pp.quantity
        };
        }); 
       }).catch(err=> console.log(err));
    }


    deleteItemFromCart(productsId){
        const updatedCartItems = this.cart.items.filter(item=>{
            return item.productId.toString() != productsId.toString();
        });

        const db = getDb();
       return db.collection('users').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: {cart: {items: updatedCartItems}}});
    }

    addOrder(){
        const db = getDb();
        const order ={
            items: this.cart.items,
            user:{
                _id: new mongodb.ObjectId(this._id),
                name: this.name,
                email: this.email     
            }
        }
        return db
          .collection("orders")
          .insertOne(order)
          .then((result) => {
            this.cart = { items: [] };
            return db
              .collection("users")
              .updateOne(
                { _id: new mongodb.ObjectId(this._id) },
                { $set: { cart: { items: [] } } }
              );
          });
    }

    getOrders(){
        const db = getDb();
        return db.collection('orders')
            .find({'user._id': new mongodb.ObjectId(this._id)})
            .toArray();
    }

    static findById(userId){
        const db = getDb();
        return db.collection('users').findOne({_id: new mongodb.ObjectId(userId)}).then(user=>{
            console.log(user);
            return user;
        }).catch(err=> console.log(err));
        // .next();
    }



}

module.exports = User;