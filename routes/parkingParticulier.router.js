const express = require("express");
const parkingParticulierController = require('../controllers/parkingParticulier.controller');

require('dotenv').config();

const router = express.Router();


router.get("/", parkingParticulierController.findAllParkingParticulier);
router.get("/:id", parkingParticulierController.findOneParkingParticulier);
router.get("/user/:id", parkingParticulierController.findOneParkingParticulierByUser);
router.post("/add", parkingParticulierController.addParkingParticulier);
router.delete("/:id", parkingParticulierController.deleteParkingParticulier);
router.put("/:id", parkingParticulierController.updateParkingParticulier);
router.post("/search", parkingParticulierController.findActivatedParkingParticulierByParams);

// export default router;
module.exports = router;
