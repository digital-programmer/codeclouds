const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const adminController = require("../controllers/adminController");

router.get("/", homeController.home);
router.post("/admin/add-place", adminController.updatePlace);
router.use("/users", require("./users"));

module.exports = router;