const Booking = require("../models").Booking;
const Post = require('../models').Post;
const ParkingParticulier = require('../models').ParkingParticulier;
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

exports.createBooking = async (req, res) => {

    const userIdConnected = req.user.id

    const {PostId} = req.body

    if (!PostId) {
        res.status(HttpStatus.BAD_REQUEST.code).send(
            new Response(
                HttpStatus.BAD_REQUEST.code,
                HttpStatus.BAD_REQUEST.message,
                "The post ID is missing in the body of the request"
            )
        );
    }
  
    const parsePostId = parseInt(PostId);
    if (isNaN(parsePostId)) {
        res.status(HttpStatus.BAD_REQUEST.code).send(
            new Response(
                HttpStatus.BAD_REQUEST.code,
                HttpStatus.BAD_REQUEST.message,
                "The post ID is not a valid number"
            )
        );
    }

    const post = await Post.findByPk(parsePostId);
    if (!post) {
        res.status(HttpStatus.NOT_FOUND.code).send(
            new Response(
                HttpStatus.NOT_FOUND.code,
                HttpStatus.NOT_FOUND.message,
                "The selected ad does not exist"
            )
        );
    }

    if (
        req.body.start_date == null || 
        req.body.end_date == null || 
        req.body.UserId == null ) {
        res.status(HttpStatus.BAD_REQUEST.code)
            .send(new Response(HttpStatus.BAD_REQUEST.code,HttpStatus.BAD_REQUEST.message,`Content can not be empty!` ));
        return
    }

    const parkingParticulier = ParkingParticulier.findOne({
        where : {
            id : post.ParkingParticulierId
        }
    })

    if(userIdConnected === parkingParticulier.UserId){
        res.status(HttpStatus.FORBIDDEN.code).send(
            new Response(
                HttpStatus.FORBIDDEN.code,
                HttpStatus.FORBIDDEN.message,
                "You cannot create a booking because you are the owner of the post selected."
            )
        )
    }

    Booking.create(req.body)
    .then(data => {
        const createBooking = {
            PostId : post.id,
            start_date : data.start_date,
            end_date : data.end_date,
            UserId : userIdConnected
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
    const id = req.params.id;

    const userIdConnected = req.user.id;

    const userBookingId = Booking.findOne({
        where : {
            id : id
        }
    });

    if(userIdConnected !== userBookingId.UserId){
        res.status(HttpStatus.FORBIDDEN.code).send(
            new Response(
                HttpStatus.FORBIDDEN.code,
                HttpStatus.FORBIDDEN.message,
                'You\'re not the owner of this booking'
            )
        )
    }

    Booking.destroy({
        where: {
            id: id
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

