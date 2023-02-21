const express = require("express");
const parkingParticulierController = require('../controllers/parkingParticulier.controller');
const authenticateJWT = require("../middleware/authjwt.js").authenticateJWT;

require('dotenv').config();

const router = express.Router();


router.get("/", parkingParticulierController.findAllParkingParticulier);
router.get("/:id", parkingParticulierController.findOneParkingParticulier);
router.get("/user/:id", parkingParticulierController.findAllParkingParticulierByUser);
router.post("/add", authenticateJWT, parkingParticulierController.addParkingParticulier);
router.delete("/:id", authenticateJWT, parkingParticulierController.deleteParkingParticulier);
router.put("/:id", authenticateJWT, parkingParticulierController.updateParkingParticulier);
router.post("/search", parkingParticulierController.findActivatedParkingParticulierByParams);
router.put('/:id/restore', authenticateJWT, parkingParticulierController.restoreParkingDeleted)

// export default router;
module.exports = router;
