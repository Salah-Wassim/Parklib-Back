const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const upload = multer();
const ip = require("ip");
const logger = require("./utils/logger.util.js");
const HttpStatus = require("./utils/httpStatus.util.js");
const Response = require("./utils/response.util.js");


require("dotenv").config();


const parkingParticulierRouter = require("./routes/parkingParticulier.router.js");

const app = express();


app.use(cors({origin:'*'}));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
//app.use(upload.array()); // for parsing multipart/form-data



app.use('/parking-particulier', parkingParticulierRouter);

app.get("/", (req, res) => res.send(new Response(HttpStatus.OK.code,HttpStatus.OK.message ,`Welcome to the Parklib's API, v1.0.0`)));
app.all("*", (req, res) => res.status(HttpStatus.NOT_FOUND.code).send(new Response(HttpStatus.NOT_FOUND.code,HttpStatus.NOT_FOUND.message ,`This route does not exist`)));


// app.listen(process.env.PORT,process.env.HOST, () => {
//     console.log(`Server is running at http://${process.env.HOST}:${process.env.PORT}`);
// });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    logger.info(`Server is running at http://${ip.address()}:${PORT}`);
});

module.exports = app;
