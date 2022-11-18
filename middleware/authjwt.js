const jwt = require('jsonwebtoken');
const logger = require('../utils/logger.util.js');
const HttpStatus = require('../utils/httpStatus.util.js');
const Response = require('../utils/response.util.js');
require('dotenv').config();

/* Vérification du token */
exports.authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.SECRET, (err, user) => {
            if (err) {
                return res.status(HttpStatus.UNAUTHORIZED.code)
                    .send(new Response(HttpStatus.UNAUTHORIZED.code,HttpStatus.UNAUTHORIZED.message ,`${err.message}`));
            }

            req.user = user;
            next();
        });
    }
    else {
        return res.status(HttpStatus.UNAUTHORIZED.code)
            .send(new Response(HttpStatus.UNAUTHORIZED.code,HttpStatus.UNAUTHORIZED.message ,`Invalid token`));

    }
};
