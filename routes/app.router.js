const express = require('express');

const appController = require('../controllers/app.controller');

const router = express.Router();

router.post('/',appController.verifyNumber );
router.post('/report',appController.reportCode );


module.exports = router;
