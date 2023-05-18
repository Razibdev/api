const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const csrf = require("csurf");
const flash = require('connect-flash');
const multer = require('multer');

const fileStorage = multer.diskStorage({
  destination: (req, file, cb)=>{
    cb(null, 'images')
  },
  filename: (req, file, cb) =>{
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  }
});

const fileFilter = (req, file, cb) =>{
  if(file.mimetype == 'image/png' || file.mimetype == 'image/png', file.mimetype == 'image/jpeg'){
    cb(null, true);
  }else{
    cb(null, false);
  }
}

const errorController = require("./controllers/error");
const User = require("./models/user");

const MongoDBStore = require("connect-mongodb-session")(session);
const MONGODB_URI =
  "mongodb+srv://razibhossen8566:Razib121159mna@cluster0.h00dxpn.mongodb.net/nodejs_complete?retryWrites=true&w=majority";

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use(express.static(path.join(__dirname, "public")));
app.use('/images',express.static(path.join(__dirname, "images")));

app.set("view engine", "ejs");
app.set("views", "views");

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
const csrfProtection = csrf();
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

const ShopRoutes = require("./routes/shop");
const AdminRoutes = require("./routes/admin");
const AuthRoutes = require("./routes/auth.js");
app.use("/admin", AdminRoutes);
app.use(ShopRoutes);
app.use(AuthRoutes);

app.use(errorController.get404);
app.use('/500',errorController.get500);

// app.use((error, req, res, next)=>{
//   // res.status(error.httpStatusCode).render('')
//   if(error){
//   return res.redirect("/500");

//   }
//   next();
// })

mongoose
  // .connect(MONGODB_URI)
    .connect("mongodb://localhost:27017/nodejs_complete")
  .then((result) => {
    console.log("connected");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
