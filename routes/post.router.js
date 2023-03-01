const express = require('express');
const router = express.Router();
const authenticateJWT = require("../middleware/authjwt").authenticateJWT;

const post_controller = require('../controllers/post.controller');

router.get('/', post_controller.list_post);
router.post('/', authenticateJWT, post_controller.create_post);
router.put('/:id', authenticateJWT, post_controller.edit_post);
router.put('/:id/edit-validation-status', post_controller.update_validationStatus_post);
router.get('/:id', post_controller.details_post);
router.get('/parkingParticulier/:id', post_controller.list_post_by_parkingParticulier);
router.get('search/:search', post_controller.search_post);
router.delete('/:id', authenticateJWT, post_controller.delete_post)

module.exports = router;