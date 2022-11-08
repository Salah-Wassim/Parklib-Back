const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

/**
 * IMPORTATION DES ROUTES
 */
const appRouter = require("./routes/app.router.js");
const authRouter = require("./routes/auth.router.js");
const userRouter = require("./routes/user.router.js");

/**
 * IMPORTATION DES MIDDLEWARES
 */
const authenticateJWT = require("./middleware/authjwt.js").authenticateJWT;

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.urlencoded({ extended: true }))

app.use(express.static(__dirname+'/public'));
app.use('/profile_picture', express.static('profile_picture'));
app.use('/post_picture', express.static('post_picture'));

/**
 * ROUTES
 */
app.use('/verification',appRouter);
app.use('/auth', authRouter);
app.use('/users',authenticateJWT, userRouter);

app.listen(process.env.PORT,process.env.HOST, () => {
    console.log(`Server is running at http://${process.env.HOST}:${process.env.PORT}`);
});

module.exports = app;
