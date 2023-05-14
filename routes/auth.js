const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { check, body } = require("express-validator");

router.get("/login", authController.getLogin);
router.post(
  "/login",
  [
    check("email")
      .isEmail()
      .withMessage("Please Enter a Valid Email")
      .normalizeEmail().trim(),
    body(
      "password",
      "Please Enter password with only numbe and text with minimum 5 character"
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
  ],
  authController.postLogin
);

router.get("/signup", authController.getSignup);
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please Enter a Valid Email")
      .custom((value, { req }) => {
        if (value === "test@test.com") {
          throw new Error("This Email Address is forbiden");
        }
        return true;
      }).normalizeEmail().trim(),
    body(
      "password",
      "Please Enter password with only numbe and text with minimum 5 character"
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),

    body("confirmPassword").custom((value, { req })=>{
        if(value != req.body.password){
            throw new Error("The password doesn't match");
        }
        return true;
    }),
  ],
  authController.postSignup
);

router.get("/reset/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);

router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);

router.post("/logout", authController.postLogout);
module.exports = router;
