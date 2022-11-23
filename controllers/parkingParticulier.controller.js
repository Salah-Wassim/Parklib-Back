const ParkingParticulierModel = require("../models/parkingParticulier");
// const ParkingParticulier = require("../models").ParkingParticulier;
// import { ParkingParticulier } from "../models";
const constante = require('../utils/constantes.util.js');
const logger = require('../utils/logger.util.js');
const HttpStatus = require('../utils/httpStatus.util.js');
const Response = require('../utils/response.util.js');


exports.findAllParkingParticulier = (req, res) => {
    const isActivated = req.query.isActivated ?? true;

    ParkingParticulierModel.findAll({ where: { isActivated: isActivated }, order: [['createdAt', 'DESC']] })
        .then((data) => {
            const parkingParticulierAllList = data.map(parkingParticulier => {
                return parkingParticulier;
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
            .send(new Response(HttpStatus.NO_CONTENT.code,HttpStatus.NO_CONTENT.message,`Content can not be empty!` ));
        return;
    }

    ParkingParticulierModel.findByPk(id)
        .then(data => {
            
            const parkingParticulier = data ;

            res.status(HttpStatus.OK.code)
                .send(new Response(HttpStatus.OK.code, HttpStatus.OK.message, `Parking retrieved !`, parkingParticulier))
            
        })
        .catch(err => {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
                .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code,HttpStatus.INTERNAL_SERVER_ERROR.message,`Error retrieving parking with id = ${id} `));
        });
}



