const express = require("express");
const router = express.Router();

const roleController = require("../controllers/role.controller");

router.get("/", roleController.list_role);
router.get("/:title", roleController.find_one_role);
router.post("/create", roleController.create_role);
router.put("/:title/edit", roleController.update_role);
router.delete("/:title/delete", roleController.delete_role);

module.exports = router;