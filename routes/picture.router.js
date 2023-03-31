const express = require("express");
const router = express.Router();
const postPicture = require("../controllers/post_picture.controller.js");


// Post Picture
router.post("/post/upload", postPicture.uploadPostPicture);
router.get("/post/:id", postPicture.getPostPicture);
router.put("/post/:id", postPicture.updatePostPicture);
router.delete("/post/:id", postPicture.deletePostPicture);



module.exports = router;
