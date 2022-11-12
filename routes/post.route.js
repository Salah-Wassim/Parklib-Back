const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const post_controller = require('../controllers/post.controller');

router.get('/', post_controller.list_post);
router.post('/', post_controller.create_post);
router.put('/:id', post_controller.edit_post);
router.get('/:id', post_controller.details_post);
router.get('search/:search', post_controller.search_post);

module.exports = router;