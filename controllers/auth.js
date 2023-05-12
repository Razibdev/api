const crypto = require('crypto');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey('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');


exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if(message.length > 0){
    message = message[0];
  }else{
    message = null;
  }
  console.log(req.get('Cookie'));
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message
  });
};


exports.getSignup = (req, res, next) => {

   let message = req.flash("error");
   if (message.length > 0) {
     message = message[0];
   } else {
     message = null;
   }

  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
  });
};

exports.postSignup = (req, res, next) =>{
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    User.findOne({email:email})
    .then(userDoc=>{
      if(userDoc){
         req.flash("error", "E-mail exists already. please pick a different one");
        return res.redirect('/signup');
      }
      return bcrypt
        .hash(password, 12)
        .then((hashPassowrd) => {
          const user = new User({
            name: username,
            email: email,
            password: hashPassowrd,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
         return sgMail.send({
           to: email,
           from: "razibhossen8566@gmail.com",
           subject: "Signup Succeeded",
           html: "<h1>you successfully signed up!</h1>",
         });

           
        }).catch(err=>{
          console.log(err);
        });
       
    }).catch(err=>{
      console.log(err);
    });

}




exports.postLogin = (req, res, next) => {

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email: email}).then(user=>{
    if(!user){
      req.flash('error', 'Invalid Email Or Password')
      return res.redirect('/login');
    }
    bcrypt.compare(password, user.password).then(doMatch=>{
      if(doMatch){
         req.session.isLoggedIn = true;
         req.session.user = user;
         res.setHeader("Content-Type", "application/json");
        return req.session.save((err) => {
           console.log(user);
           res.redirect('/');
         });
      }
       req.flash("error", "Invalid Email Or Password");
      res.redirect('/login');
    }).catch(err=>{
      console.log(err);
      return res.redirect('/login');
    })
  })


    // req.session.isLoggedIn = true;
    
    //Expires=10/10/2023; Max-age=10;HttpOnly
    //Secure //request send by https://

  // res.redirect('/');
};
exports.postLogout = (req, res, next) => {
  // req.session.isLoggedIn = true;
  req.session.destroy((err) => {
    res.redirect("/"); // will always fire after session is destroyed
  });
  //Expires=10/10/2023; Max-age=10;HttpOnly
  //Secure //request send by https://

  // res.redirect("/");
};




exports.getReset = (req, res, next) =>{
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset",
  });
};


exports.postReset = (req, res, next) =>{
  const email = req.body.email;
  crypto.randomBytes(32, (err, buffer) =>{
    if(err){
      console.log(err);
      return res.redirect('/');
    }

    const token = buffer.toString('hex');
    User.findOne({email: email})
    .then(user=>{
      if(!user){
        return res.redirect('/reset')
      }
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      return user.save();

    }).then(result=>{
      res.redirect('/');
       return sgMail.send({
         to: email,
         from: "razibhossen8566@gmail.com",
         subject: "Password reset",
         html:`
         <p>Tou requested a password reset</p>
         <p>Click this <a href="http://localhost:3000/reset/${token}">Link</a> to set a new password</p>
         `,
       });
    }).catch(err=>{
      console.log(err);
    })
  })
};

exports.getNewPassword = (req, res, next) =>{
  const token  = req.params.token;
  User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
  .then(user=>{
     res.render("auth/new-password", {
       path: "/reset",
       pageTitle: "New Password",
       userId: user._id.toString(),
       passwordToken: token

     });
  })
  .catch(err=>{
    console.log(err);
  })
  
};

exports.postNewPassword = (req, res, next) =>{
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;
  User.findOne({resetToken: passwordToken, resetTokenExpiration: {$gt : Date.now()}, _id: userId})
  .then(user=>{
    resetUser = user;
    return bcrypt.hash(newPassword, 12)
  }).then(hashPassowrd =>{
    resetUser.password = hashPassowrd;
    resetUser.resetToken = undefined;
    resetUser.resetTokenExpiration = undefined;
   return resetUser.save();
  })
  .then(result=>{
    return res.redirect('/login');
  })
  .catch(err=>{
    console.log(err);
  })


}
