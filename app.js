const express = require("express");
const cors = require("cors");
const ip = require("ip");
const logger = require("./utils/logger.util.js");
const HttpStatus = require("./utils/httpStatus.util.js");
const Response = require("./utils/response.util.js");
const Http = require('http');
const SocketIo = require('socket.io');
const SocketIoService = require('./services/socketIo.service.js');

const parkingParticulierRouter = require("./routes/parkingParticulier.router.js");

require("dotenv").config();

global.__basedir = __dirname;

/**
 * IMPORTATION DES ROUTES
 */

const appRouter = require("./routes/app.router.js");
const authRouter = require("./routes/auth.router.js");
const userRouter = require("./routes/user.router.js");
const bookingRouter = require("./routes/booking.router.js");
const postRouter = require("./routes/post.router.js");
const roleRouter = require("./routes/role.router");
const pictureRouter = require("./routes/picture.router.js");
const validationStatusRouter = require("./routes/validationStatus.router");

/**
 * IMPORTATION DES MIDDLEWARES
 */

const authenticateJWT = require("./middleware/authjwt.js").authenticateJWT;
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({origin:'*'}));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(express.static(__dirname+'/public'));
app.use('/profile_picture', express.static('profile_picture'));
app.use('/post_picture', express.static('post_picture'));

/**
 * IO
 */

const server = Http.Server(app);
const io = SocketIo(server, {
    transports:['websocket'],
    cors: {
        origin: `http://${ip.address()}:${PORT}`
    }
});

new SocketIoService(io);
io.on('connection', (socket) => {
    console.log("socket", socket)
    // Gestion des connexions Socket.IO
    socket.on('parkingAdded', (parking) => {
        console.log("parking", parking)
        io.emit('newParking', parking);
    });
})

/**
 * ROUTES
 */

app.use('/parking-particulier', parkingParticulierRouter);
app.use('/annonce', postRouter);
app.use('/picture',pictureRouter);
app.use('/validation-status', validationStatusRouter);
app.use('/bookings',bookingRouter);
app.use('/verification',appRouter);
app.use('/auth', authRouter);
app.use('/users',userRouter);
app.use('/role',roleRouter);
app.get("/", (req, res) => res.send(new Response(HttpStatus.OK.code,HttpStatus.OK.message ,`Welcome to the Parklib's API, v1.0.0`,{apiDocs:`http://${ip.address()}:${PORT}/api-docs`})));
app.all("*", (req, res) => res.status(HttpStatus.NOT_FOUND.code).send(new Response(HttpStatus.NOT_FOUND.code,HttpStatus.NOT_FOUND.message ,`This route does not exist`)));

server.listen(PORT, () => {
    logger.info(`Server is running at http://${ip.address()}:${PORT}`);
});

module.exports = server
