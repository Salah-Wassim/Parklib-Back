const express = require("express");
const router = express.Router();

const roleController = require("../controllers/role.controller");

router.get("/", roleController.list_role);
router.get("/:title", roleController.find_one_role);
router.get('/:title/users', roleController.findOne_role_by_user)
router.post("/create", roleController.create_role);
router.put("/:title/edit", roleController.update_role);
router.delete("/:title/delete", roleController.delete_role);

module.exports = router;