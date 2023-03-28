const express = require("express");
const router = express.Router();
const postPicture = require("../controllers/post_picture.controller.js");


router.post("/upload", postPicture.uploadPostPicture);
router.get("/:id", postPicture.getPostPicture);
router.put("/:id", postPicture.updatePostPicture);
router.delete("/:id", postPicture.deletePostPicture);



module.exports = router;
