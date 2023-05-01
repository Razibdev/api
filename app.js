// const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require("body-parser");

const app = express();


const errorController = require('./controllers/error');

const db = require('./util/database');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', 'views');

const ShopRoutes = require("./routes/shop");
const AdminRoutes = require("./routes/admin");
app.use(ShopRoutes);
app.use("/admin", AdminRoutes);

app.use(errorController.get404);







// const server = http.createServer(app);
// server.listen(3000);
app.listen(3000);