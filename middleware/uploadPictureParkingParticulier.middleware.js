// const util = require("util");
// const multer = require("multer");
// const constantes = require("../utils/constantes.util");
// const maxSize = constantes.MAX_SIZE;

// let storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, __basedir + "/public/post_picture/parking_particulier");
//   },
//   filename: (req, file, cb) => {
//     console.log(file.originalname);
//     cb(null, file.originalname);
//   },
// });

// let uploadFile = multer({
//   storage: storage,
//   limits: { fileSize: maxSize },
// }).single("file");

// let uploadFileMiddleware = util.promisify(uploadFile);
// module.exports = uploadFileMiddleware;
