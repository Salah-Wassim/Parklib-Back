const express = require("express");
const parkingParticulierController = require('../controllers/parkingParticulier.controller');

require('dotenv').config();

const router = express.Router();


router.get("/", parkingParticulierController.findAllParkingParticulier);
router.get("/:id", parkingParticulierController.findOneParkingParticulier);

// export default router;
module.exports = router;
