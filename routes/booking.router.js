const express = require("express");
const router = express.Router();
const reservation = require("../controllers/booking.controller.js");
const authenticateJWT = require("../middleware/authjwt.js").authenticateJWT;

router.get("/", reservation.findAllBooking);
router.get("/find/:id", reservation.findOneBooking);
router.post("/create", authenticateJWT, reservation.createBooking);
router.delete("/:id/delete", authenticateJWT, reservation.deleteBooking);
// router.put("/update", reservation.updateBooking);


module.exports = router;
