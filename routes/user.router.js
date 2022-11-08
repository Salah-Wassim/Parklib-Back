const express = require("express");
const multer  = require('multer')
require('dotenv').config();

const router = express.Router();

const storage = multer.diskStorage({
    destination:(req, file, cb) =>{
        cb(null, './public/profile_picture')
    },
    filename:(req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        cb(null, file.fieldname + '-' + uniqueSuffix+ext)
    }
})
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
             cb(null, true);
        }else{
            cb(new Error('Only .png, .jpg and .jpeg format allowed!'),false);
        }
    },
    limits: {
        fileSize: 5000000,//5MB
        fieldNameSize: 300,
        files: 1,
        fields: 1
    }
})

const userController = require("../controllers/user.controller.js");

router.get("/", userController.findAll);
router.get("/:id", userController.findOne);
router.put("/:id",upload.single('picture'), userController.update);
router.put("/:id/reset-password", userController.updatePassword);
router.delete("/:id", userController.delete);

module.exports = router;
