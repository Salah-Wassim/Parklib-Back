const express = require("express");
const router = express.Router();
const comment = require("../controllers/comment.controller.js");
const authenticateJWT = require("../middleware/authjwt.js").authenticateJWT;


router.post("/create", authenticateJWT, comment.createComment);
router.put("/:id", authenticateJWT, comment.updateComment);
router.get('/:userId', comment.findAllCommentsByUserId);
router.delete("/:id", authenticateJWT, comment.deleteComment);



module.exports = router;
