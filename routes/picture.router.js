const express = require("express");
const router = express.Router();
const picture = require("../controllers/picture.controller.js");


router.post("/upload", picture.uploadPicture);
router.get("/:id", picture.getPicture);
router.put("/:id", picture.updatePicture);
router.delete("/:id", picture.deletePicture);



module.exports = router;
