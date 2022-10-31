import express from 'express';
import * as appController from '../controllers/app.controller.js';

const router = express.Router();

router.post('/',appController.verifyNumber );
router.post('/report',appController.reportCode );


export default router;
