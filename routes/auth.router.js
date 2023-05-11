const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller.js");

router.post("/register", authController.register);
router.post("/", authController.login);

router.post("/admin", authController.registerAdmin);

module.exports = router;
