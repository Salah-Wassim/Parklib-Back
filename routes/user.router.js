const express = require("express");
const multer = require("multer");
const constants = require("../utils/constantes.util.js");
const Response = require("../utils/response.util.js");
const HttpStatus = require("../utils/httpStatus.util.js");
const logger = require("../utils/logger.util.js");
require('dotenv').config();
const authenticateJWT = require("../middleware/authjwt.js").authenticateJWT;

const router = express.Router();

const storage = multer.diskStorage({
    destination:(req, file, cb) =>{
        cb(null, __basedir+'/public/profile_picture')
    },
    filename:(req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        cb(null, file.fieldname + '-' + uniqueSuffix+ext)
    }
});
const uploadFile = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
             cb(null, true);
        }else{
            cb(new Error( 'Only .png, .jpg and .jpeg format allowed!'),false);
        }
    },
    limits: {
        fileSize: constants.MAX_SIZE,//2MB
    }
});

let upload = uploadFile.single('picture');

const userController = require("../controllers/user.controller.js");

router.get("/", (req, res) => {
    userController.findAllUser(req, res)
});
router.get("/:id", userController.findOneUser);
router.put("/:id", authenticateJWT, userController.updateUser);
router.put("/:id/reset-password", authenticateJWT, userController.updatePassword);
router.delete("/:id", authenticateJWT, userController.deleteUser);
router.put('/restore/:id', authenticateJWT, userController.restoreUserDeleted)
router.put("/:id/profile", authenticateJWT, (req, res) => {
    logger.info("uploading profile picture");
    upload(req, res, (err) => { 

        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            if(err.code === 'LIMIT_FILE_SIZE'){
                logger.error("File size is too large. Max limit: 2MB");
                return res.status(HttpStatus.BAD_REQUEST.code)
                    .send(new Response(HttpStatus.BAD_REQUEST.code,HttpStatus.BAD_REQUEST.message ,`File size is too large. Max limit: 2MB`));
            }

            if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                logger.error("Too many files to upload.");
                return res.status(HttpStatus.BAD_REQUEST.code)
                    .send(new Response(HttpStatus.BAD_REQUEST.code,HttpStatus.BAD_REQUEST.message ,`Too many files to upload.`));
            }

            if (err.code === 'LIMIT_PART_COUNT') {
                logger.error("Too many parts");
                return res.status(HttpStatus.BAD_REQUEST.code)
                    .send(new Response(HttpStatus.BAD_REQUEST.code,HttpStatus.BAD_REQUEST.message ,`Too many parts`));
            }
        }
        if (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
                .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code,HttpStatus.INTERNAL_SERVER_ERROR.message, `${err.message}`));
            return;
        }

        userController.updateProfilePicture(req, res);
    });
});

module.exports = router;
