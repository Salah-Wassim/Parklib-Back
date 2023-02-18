const Booking = require("../models").Booking;
const constante = require('../utils/constantes.util.js');
const HttpStatus = require('../utils/httpStatus.util.js');
const logger = require("../utils/logger.util.js");
const Response = require('../utils/response.util.js');


exports.findAllBooking = (req, res) => {
    Booking.findAll()
    .then(data =>{
        if(data){
            res.status(HttpStatus.OK.code)
            .send(new Response(HttpStatus.OK.code,HttpStatus.OK.message,`Bookings retrieved`, data));
        }
        else{
            res.status(HttpStatus.NOT_FOUND.code)
            .send(new Response(HttpStatus.NOT_FOUND.code,HttpStatus.NOT_FOUND.message));
        }
    })    
    .catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code,HttpStatus.INTERNAL_SERVER_ERROR.message,`Some error occurred while retrieving bookings.`, err));
    })
}

exports.findOneBooking = (req, res) => {

    Booking.findByPk(req.body.id)
        .then((data) => {
                if(data){
                    res.status(HttpStatus.OK.code)
                    .send(new Response(HttpStatus.OK.code,HttpStatus.OK.message,`Bookings retrieved`, data));
                } else{
                    res.status(HttpStatus.NOT_FOUND.code)
                    .send(new Response(HttpStatus.NOT_FOUND.code,HttpStatus.NOT_FOUND.message));
                }
        })
        .catch((err) => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
                .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code,HttpStatus.INTERNAL_SERVER_ERROR.message,`Some error occurred while retrieving bookings.`, err));
        });
}


exports.createBooking = (req, res) => {

    if (req.body.post_id == null || 
        req.body.start_date == null || 
        req.body.end_date == null || 
        req.body.user_id == null ) {
        res.status(HttpStatus.BAD_REQUEST.code)
            .send(new Response(HttpStatus.BAD_REQUEST.code,HttpStatus.BAD_REQUEST.message,`Content can not be empty!` ));
        return
    }
    Booking.create(req.body)
    .then(data => {
        const createBooking = {
            post_id : data.post_id,
            start_date : data.start_date,
            end_date : data.end_date,
            user_id : data.user_id
        }
        logger.info(
            `${req.method} ${req.originalUrl}, Fetching Req bookings.`
        ); 
                res.status(HttpStatus.CREATED.code)
                .send(new Response(HttpStatus.CREATED.code,HttpStatus.CREATED.message,`Account created`, {createBooking}))
              
            })

    .catch (error => {
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(HttpStatus.CONFLICT.code)
                .send(new Response(HttpStatus.CONFLICT.code,HttpStatus.CONFLICT.message,`Booking already exists` ));
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
                .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code,HttpStatus.INTERNAL_SERVER_ERROR.message,`Some error occurred while creating the account`, error));
        }
    });

}


exports.deleteBooking = (req, res) => {
    Booking.destroy({
        where: {
            id: req.body.id
          }
    })
    .then(data => {
        if(data){
            res.status(HttpStatus.NO_CONTENT.code)
                .send(new Response(HttpStatus.NO_CONTENT.code,HttpStatus.NO_CONTENT.message, `Booking has been removed`));
        } else{
            res.status(HttpStatus.NOT_FOUND.code)
            .send(new Response(HttpStatus.NOT_FOUND.code,HttpStatus.NOT_FOUND.message, `Booking not found`));
        }
    })
    .catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code,HttpStatus.INTERNAL_SERVER_ERROR.message,`An error occurred while deleting the reservation`, err));
    }) 
}

// exports.updateBooking = (req, res) => {
//     const updateBooking = {
//         post_id: req.body.post_id
//     }
    
//     Booking.update(
//         updateBooking,
//         { where: { id: req.body.id } }
//     ) 
//     .then(data => {
//         res.status(HttpStatus.OK.code)
//         .send(new Response(HttpStatus.OK.code,HttpStatus.OK.message,`Booking updated`, data));
//     })
//     .catch(err => {
//         res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
//         .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code,HttpStatus.INTERNAL_SERVER_ERROR.message,`An error occurred while update the reservation`, err));
//     }) 

// }

