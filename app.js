import express from "express";
import * as dotenv from "dotenv";
import appRouter from "./routes/app.router.js";
import bodyParser from "body-parser";

const app = express();

dotenv.config();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const postRouter = require('./routes/post.route');

app.use('verification',appRouter);
app.use('/annonce', postRouter);




app.listen(process.env.PORT,process.env.HOST, () => {
    console.log(`Server is running at http://${process.env.HOST}:${process.env.PORT}`);
});
