const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/authController");

router.get("/sign-up", authController.signUp);
router.get("/sign-in", authController.signIn);
router.post("/create-user", authController.create);
// use passport as a middleware to authenticate and create session
router.post("/create-session", passport.authenticate("local", { failureRedirect: "/users/sign-in" }), authController.createSession);
// passport to destroy session
router.get("/sign-out", authController.destroySession);

module.exports = router;