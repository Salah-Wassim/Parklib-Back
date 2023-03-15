const express = require("express");
const router = express.Router();

const validationStatus_controller = require("../controllers/validationStatus.controller");

router.get("/", validationStatus_controller.List_All_ValidationStatus);
router.get("/:id", validationStatus_controller.List_One_ValidationStatus),
router.post("/create", validationStatus_controller.Create_ValidationStatus);
router.put("/:id/edit", validationStatus_controller.Update_ValidationStatus);
router.delete("/:id/delete", validationStatus_controller.Delete_ValidationStatus);

module.exports = router;