// const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require("body-parser");

const app = express();

const ShopRoutes = require('./routes/shop');
const AdminData = require('./routes/admin');


app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.set('views', 'views');
app.use(ShopRoutes);
app.use("/admin", AdminData.routes);


app.use((req, res, next)=>{
    // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
    res.status(404).render('404', {pageTitle: 'Page not found'});
});







// const server = http.createServer(app);
// server.listen(3000);
app.listen(3000);