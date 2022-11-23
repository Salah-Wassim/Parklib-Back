const express = require("express");
const parkingParticulierController = require('../controllers/parkingParticulier.controller');

require('dotenv').config();

const router = express.Router();


router.get("/", parkingParticulierController.findAllParkingParticulier);
router.get("/:id", parkingParticulierController.findOneParkingParticulier);
router.post("/add", parkingParticulierController.addParkingParticulier);
router.delete("/:id", parkingParticulierController.deleteParkingParticulier);
router.put("/:id", parkingParticulierController.updateParkingParticulier);

// export default router;
module.exports = router;
