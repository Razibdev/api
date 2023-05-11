// const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require("body-parser");

const app = express();
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
// const mongoConnect = require("./util/database").mongoConnect;
const User = require('./models/user');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use((req, res, next) =>{
    User.findById('6454f3cfa6c0730ab68aabfc')
    .then(user=>{
        req.user = user;
        next();
    }).catch(err => console.log(err));
});

const ShopRoutes = require("./routes/shop");
const AdminRoutes = require("./routes/admin");
const AuthRoutes = require('./routes/auth.js');
app.use("/admin", AdminRoutes);
app.use(ShopRoutes);
app.use(AuthRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://razibhossen8566:Razib121159mna@cluster0.h00dxpn.mongodb.net/nodejs_complete?retryWrites=true&w=majority"
  )
//   .connect("mongodb://localhost:27017/nodejs_complete")
  .then(result=>{
    console.log('connected');
    User.findOne().then(user=>{
        if(!user){
             const user = new User({
               name: "Razib Hossen",
               email: "razib@gamil.com",
               cart: {
                 items: [],
               },
             });
             user.save();
        }
    })
   app.listen(3000);

  }).catch(err=>{
    console.log(err);
  })