exports.getLogin = (req, res, next) => {
  console.log(req.get('Cookie'));
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.isLoggedIn
  });
};

exports.postLogin = (req, res, next) => {
    res.isLoggedIn = true;
    res.setHeader('Set-Cookie', 'isLoggedIn=true');
    //Expires=10/10/2023; Max-age=10;HttpOnly
    //Secure //request send by https://

  res.redirect('/');
};
