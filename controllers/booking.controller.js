const Booking = require("../models").Booking;
const Post = require('../models').Post;
const ParkingParticulier = require('../models').ParkingParticulier;
const Role = require("../models").Role;
const RoleUser = require("../models").RoleUser;
const HttpStatus = require('../utils/httpStatus.util.js');
const logger = require("../utils/logger.util.js");
const Response = require('../utils/response.util.js');

exports.findAllBooking = async (req, res) => {

    const userIdConnected = req.user.id

    Booking.findAll({
        where : {
            UserId: userIdConnected
        }
    })
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

exports.findOneBooking = async (req, res) => {

    const id = req.params.id;

    const userIdConnected = req.user.id

    const booking = await Booking.findOne({
        where : {
            id: id
        }
    })

    if(userIdConnected !== booking.UserId){
        res.status(HttpStatus.FORBIDDEN.code).send(
            new Response(
                HttpStatus.FORBIDDEN.code,
                HttpStatus.FORBIDDEN.message,
                "You're not the owner of this booking"
            )
        )
    }

    Booking.findOne({
        where : {
            id : id
        }
    })
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

    const start_date = req.body.start_date;
    const end_date = req.body.end_date;

    let booking = {};

    booking = {
        PostId : post.id ? post.id : null,
        start_date : start_date ? start_date : "",
        end_date : end_date ? end_date : "",
        UserId : userIdConnected ? userIdConnected : null
    }

    for(let value in booking){
        if(!booking[value]){
            res.status(HttpStatus.BAD_REQUEST.code).send(
                new Response(
                    HttpStatus.BAD_REQUEST.code,
                    HttpStatus.BAD_REQUEST.message,
                    `Content can not be empty!` 
                )
            );
        }
    }

    const parkingParticulier = await ParkingParticulier.findOne({
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

    Booking.create(booking)
    .then(async (response) => {
        console.log(response)
        if(response[0] === 0){
            res.status(HttpStatus.BAD_REQUEST.code).send(
                new Response(
                    HttpStatus.BAD_REQUEST.code,
                    HttpStatus.BAD_REQUEST.message,
                    'The response returned is empty'
                )
            )
        }

        const role = await Role.findOne({ where: { title: "Locataire" } });
                    
        if(role){
            let roleUser = {};
            roleUser = {
                UserId: userIdConnected ? userIdConnected : null,
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
            .then(data => {
                if(data[0]===0){
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
                        'Booking and role user is created',
                        response
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
    })
    .catch (error => {
        console.log("error", error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(HttpStatus.CONFLICT.code).send(
                new Response(
                    HttpStatus.CONFLICT.code,
                    HttpStatus.CONFLICT.message,
                    `Booking already exists` 
                )
            );
        } 
        else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(
                new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.code,
                    HttpStatus.INTERNAL_SERVER_ERROR.message,
                    `Some error occurred while creating the account`, 
                    error
                )
            );
        }
    });
}

exports.deleteBooking = async (req, res) => {
    const id = req.params.id;

    const userIdConnected = req.user.id;

    const userBookingId = await Booking.findOne({
        where : {
            id : id
        }
    });

    console.log("userBookingId", userBookingId);
    console.log("userIdConnected", userIdConnected)

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
            res.status(HttpStatus.NO_CONTENT.code).send(
                new Response(
                    HttpStatus.NO_CONTENT.code,
                    HttpStatus.NO_CONTENT.message, 
                    `Booking has been removed`
                )
            );
        } 
        else{
            res.status(HttpStatus.NOT_FOUND.code).send(
                new Response(
                    HttpStatus.NOT_FOUND.code,
                    HttpStatus.NOT_FOUND.message, 
                    `Booking not found`
                )
            );
        }
    })
    .catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(
            new Response(
                HttpStatus.INTERNAL_SERVER_ERROR.code,
                HttpStatus.INTERNAL_SERVER_ERROR.message,
                `An error occurred while deleting the reservation`, err
            )
        );
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

