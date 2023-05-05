// const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require("body-parser");

const app = express();


const errorController = require('./controllers/error');
const mongoConnect = require("./util/database").mongoConnect;
const User = require('./models/user');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use((req, res, next) =>{
    User.findById('64547f87afe3b7ea4424fc91')
    .then(user=>{
        req.user = new User(user.name, user.email, user.cart, user._id);
        next();
    }).catch(err => console.log(err));
});

const ShopRoutes = require("./routes/shop");
const AdminRoutes = require("./routes/admin");
app.use(ShopRoutes);
app.use("/admin", AdminRoutes);

app.use(errorController.get404);

mongoConnect(()=>{
   app.listen(3000);

});