const User = require("../models").User;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const constante = require('../utils/constantes.util.js');
const logger = require('../utils/logger.util.js');
const HttpStatus = require('../utils/httpStatus.util.js');
const Response = require('../utils/response.util.js');
require('dotenv').config();

exports.register = (req, res) => {
    if (req.body.password == null || !req.body.email == null || req.body.lastName == null || req.body.firstName == null) {
        res.status(HttpStatus.NO_CONTENT.code)
            .send(new Response(HttpStatus.NO_CONTENT.code,HttpStatus.NO_CONTENT.message,`Content can not be empty!` ));
        return;
    }

    bcrypt.hash(req.body.password, constante.SALT_HASH_KEY).then(hash => {
        // Create a User
        const user = {
           ...req.body,
            password: hash
        };

        logger.info(`${req.method} ${req.originalUrl}, Creating new user.`);
        // Save User in the database
        User.create(user)
            .then(data => {
                    const accessToken = jwt.sign({
                        id: data.id,
                        name: data.lastName+" "+data.firstName,
                        email: data.email
                    }, process.env.SECRET, { expiresIn:process.env.EXPIRES_IN});

                    res.status(HttpStatus.CREATED.code)
                        .send(new Response(HttpStatus.CREATED.code,HttpStatus.CREATED.message,`Account created`, {accessToken}));
                })
            .catch (error => {
                if (error.name === 'SequelizeUniqueConstraintError') {
                    res.status(HttpStatus.FORBIDDEN.code)
                        .send(new Response(HttpStatus.FORBIDDEN.code,HttpStatus.FORBIDDEN.message,`Account already exists` ));
                } else {
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
                        .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code,HttpStatus.INTERNAL_SERVER_ERROR.message,`Some error occurred while creating the account.`));
                }
            });
    });
}

exports.login = (req, res) => {
    if (req.body.password == null || !req.body.email == null) {
        res.status(HttpStatus.NO_CONTENT.code)
            .send(new Response(HttpStatus.NO_CONTENT.code,HttpStatus.NO_CONTENT.message,`Content can not be empty!` ));
        return;
    }

    logger.info(`${req.method} ${req.originalUrl}, Fetching user.`);
    User.findOne({where: {email: req.body.email}})
        .then(user => {
            if (user===null) {
                res.status(HttpStatus.NOT_FOUND.code)
                    .send(new Response(HttpStatus.NOT_FOUND.code,HttpStatus.NOT_FOUND.message,`email or password incorrect`));
                return;
            }

            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (result) {
                    const accessToken = jwt.sign({
                        id: user.id,
                        name: user.lastName+" "+user.firstName,
                        email: user.email
                    }, process.env.SECRET, { expiresIn:process.env.EXPIRES_IN});

                    res.status(HttpStatus.OK.code)
                        .send(new Response(HttpStatus.OK.code,HttpStatus.OK.message,`User retrieved`, {accessToken}));

                }
                else {
                    res.status(HttpStatus.NOT_FOUND.code)
                        .send(new Response(HttpStatus.NOT_FOUND.code,HttpStatus.NOT_FOUND.message,`email or password incorrect`));
                }
            })

        })
        .catch(err => {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code,HttpStatus.INTERNAL_SERVER_ERROR.message,`Some error occurred while retrieving the account.`));
        });
}
