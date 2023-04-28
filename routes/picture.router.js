const express = require("express");
const router = express.Router();
const postPicture = require("../controllers/post_picture.controller.js");
const profilePicture = require("../controllers/profile_picture.controller.js");


// Post Picture
router.post("/post/upload", postPicture.uploadPostPicture);
router.get("/post/:id", postPicture.getPostPicture);
router.put("/post/:id", postPicture.updatePostPicture);
router.delete("/post/:id", postPicture.deletePostPicture);

// Profile Picture
router.get("/profile/:id", profilePicture.getProfilePicture);
router.put("/profile/:id", profilePicture.updateProfilePicture);
router.delete("/profile/:id", profilePicture.deleteProfilePicture);




module.exports = router;
