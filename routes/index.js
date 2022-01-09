const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const adminController = require("../controllers/adminController");
const userController = require("../controllers/userController");

router.get("/", homeController.home);
router.post("/admin/add-place", adminController.updatePlace);
router.post("/user/add-place", userController.findPlace);
router.use("/users", require("./users"));

module.exports = router;