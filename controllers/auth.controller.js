const User = require("../models").User;
const Role = require("../models").Role;
const RoleUser = require("../models").RoleUser;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const constante = require('../utils/constantes.util.js');
const logger = require('../utils/logger.util.js');
const HttpStatus = require('../utils/httpStatus.util.js');
const Response = require('../utils/response.util.js');
require('dotenv').config();

exports.register = async (req, res) => {
    if (req.body.password == null || req.body.email == null) {
        res.status(HttpStatus.NO_CONTENT.code)
            .send(new Response(HttpStatus.NO_CONTENT.code,HttpStatus.NO_CONTENT.message,`Content can not be empty!` ));
        return;
    }

    if (req.body.password.length < 8) {
        res.status(HttpStatus.UNAUTHORIZED.code)
            .send(new Response(HttpStatus.UNAUTHORIZED.code,HttpStatus.UNAUTHORIZED.message,`Password must be at least 8 characters long` ));
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
            .then(async (data) => {
                if(data){
                    console.log('data', data)
                    const accessToken = jwt.sign({
                        id: data.id,
                        email: data.email
                    }, process.env.SECRET, { expiresIn:process.env.EXPIRES_IN});

                    const role = await Role.findOne({ where: { title: "User" } });
                    
                    if(role){
                        let roleUser = {};
                        roleUser = {
                            UserId: data.id ? data.id : null,
                            RoleId: role.id ? role.id : null
                        }
                        for(value in roleUser){
                            if(!roleUser[value]){
                                res.status(HttpStatus.BAD_REQUEST.code).send(
                                    new Response(
                                        HttpStatus.BAD_REQUEST.code,
                                        HttpStatus.BAD_REQUEST.message,
                                        'Content cannot be empty'
                                    )
                                )
                            }
                        }
                        RoleUser.create(roleUser)
                        .then(response => {
                            if(response[0]===0){
                                res.status(HttpStatus.NOT_FOUND.code).send(
                                    new Response(
                                        HttpStatus.NOT_FOUND.code,
                                        HttpStatus.NOT_FOUND.message,
                                        'Any response for RoleUser was returned'
                                    )
                                )
                            }
                            res.status(HttpStatus.CREATED.code).send(
                                new Response(
                                    HttpStatus.CREATED.code,
                                    HttpStatus.CREATED.message,
                                    'RoleUser was created'
                                )
                            )
                        })
                        .catch(err => {
                            console.log("err1", err);
                            res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(
                                new Response(
                                    HttpStatus.INTERNAL_SERVER_ERROR.code,
                                    HttpStatus.INTERNAL_SERVER_ERROR.message,
                                    'An internal error has occurred'
                                )
                            )
                        })
                    }
                    else{
                        res.status(HttpStatus.NOT_FOUND.code).send(
                            new Response(
                                HttpStatus.NOT_FOUND.code,
                                HttpStatus.NOT_FOUND.message,
                                `Any role ${role.title} was found`
                            )
                        )
                    }
                    res.status(HttpStatus.CREATED.code)
                    .send(new Response(HttpStatus.CREATED.code,HttpStatus.CREATED.message,`Account created`, {accessToken}));
                }
                else{
                    res.status(HttpStatus.NOT_FOUND.code).send(
                        new Response(
                            HttpStatus.NOT_FOUND.code,
                            HttpStatus.NOT_FOUND.message,
                            'Any response user was returned'
                        )
                    )
                }
            })
            .catch (error => {
                console.log("error1", error)
                if (error.name === 'SequelizeUniqueConstraintError') {
                    res.status(HttpStatus.CONFLICT.code)
                        .send(new Response(HttpStatus.CONFLICT.code,HttpStatus.CONFLICT.message,`Account already exists` ));
                } else {
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
                        .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code,HttpStatus.INTERNAL_SERVER_ERROR.message,`Some error occurred while creating the account.`));
                }
            });
    });
}

exports.login = (req, res) => {
    if (req.body.password == null || req.body.email == null) {
        res.status(HttpStatus.BAD_REQUEST.code)
            .send(new Response(HttpStatus.BAD_REQUEST.code,HttpStatus.BAD_REQUEST.message,`Content can not be empty!` ));
        return;
    }

    logger.info(`${req.method} ${req.originalUrl}, Fetching user.`);
    User.findOne({where: {email: req.body.email}})
        .then(user => {
            if (user===null) {
                res.status(HttpStatus.UNAUTHORIZED.code)
                    .send(new Response(HttpStatus.UNAUTHORIZED.code,HttpStatus.UNAUTHORIZED.message,`email or password incorrect`));
                return;
            }

            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (result) {
                    const accessToken = jwt.sign({
                        id: user.id,
                        email: user.email
                    }, process.env.SECRET, { expiresIn:process.env.EXPIRES_IN});
                    res.status(HttpStatus.OK.code)
                        .send(new Response(HttpStatus.OK.code,HttpStatus.OK.message,`User retrieved`, {accessToken}));
                }
                else {
                    res.status(HttpStatus.UNAUTHORIZED.code)
                        .send(new Response(HttpStatus.UNAUTHORIZED.code,HttpStatus.UNAUTHORIZED.message,`email or password incorrect`));
                }
            })

        })
        .catch(err => {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code,HttpStatus.INTERNAL_SERVER_ERROR.message,`Some error occurred while retrieving the account.`,{err}));
        });
}
