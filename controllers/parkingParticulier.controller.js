const ParkingParticulier = require("../models/ParkingParticulier");
// const ParkingParticulier = require("../models").ParkingParticulier;
// import { ParkingParticulier } from "../models";
const constante = require('../utils/constantes.util.js');
const logger = require('../utils/logger.util.js');
const HttpStatus = require('../utils/httpStatus.util.js');
const Response = require('../utils/response.util.js');
const { Op } = require("sequelize");

exports.findAllParkingParticulier = (req, res) => {
    const isActivated = req.query.isActivated ?? true;
    logger.info(`${req.method} ${req.originalUrl}, Fetching ALL parkings particuliers.`);
    ParkingParticulier.findAll({ where: { isActivated: isActivated }, order: [['createdAt', 'DESC']] })
        .then((data) => {
            const parkingParticulierAllList = data.map(parking => {
                return parking;
            }) 
            res.status(HttpStatus.OK.code)
                .send(new Response(HttpStatus.OK.code, HttpStatus.OK.message, `ParkingParticuliers retrieved`, parkingParticulierAllList));
        }).catch((err) => {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
                .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code,HttpStatus.INTERNAL_SERVER_ERROR.message,`Some error occurred while retrieving parkings`));
        });
}

exports.findOneParkingParticulier = (req, res) => {
    const id = req.params.id;
    if (id==null) {
        res.status(HttpStatus.NO_CONTENT.code)
            .send(new Response(HttpStatus.NO_CONTENT.code,HttpStatus.NO_CONTENT.message,`Id can not be empty!` ));
        return;
    }
    logger.info(`${req.method} ${req.originalUrl}, Fetching parking #${id}.`);
    ParkingParticulier.findByPk(id)
        .then(data => {
            res.status(HttpStatus.OK.code)
                .send(new Response(HttpStatus.OK.code, HttpStatus.OK.message, `Parking retrieved !`, data))    
        })
        .catch(err => {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
                .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code,HttpStatus.INTERNAL_SERVER_ERROR.message,`Error retrieving parking with id = ${id} `));
        });
}



