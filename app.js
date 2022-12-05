const express = require('express');             
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const appRouter = require('./routes/app.router');
const postRouter = require('./routes/post.route');

const app = express();

dotenv.config();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use('verification',appRouter);
app.use('/annonce', postRouter);


app.listen(process.env.PORT, () => {
    console.log('Service is litenning on ' + process.env.PORT);
});
