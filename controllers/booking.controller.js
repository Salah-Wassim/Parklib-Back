const Booking = require("../models").Booking;
const Post = require('../models').Post;
const ParkingParticulier = require('../models').ParkingParticulier;
const Role = require("../models").Role;
const RoleUser = require("../models").RoleUser;
const HttpStatus = require('../utils/httpStatus.util.js');
const logger = require("../utils/logger.util.js");
const Response = require('../utils/response.util.js');
const { getCache, setCache } = require('../redis/cache')

exports.findAllBooking = async (req, res) => {

    const userIdConnected = req.user.id;

    logger.info(`Fetching all bookings for user with ID ${userIdConnected}`);
    const cachedBooking = await getCache("bookings");
    if(cachedBooking){
        res.status(HttpStatus.OK.code).send(
            new Response(
                HttpStatus.OK.code,
                HttpStatus.OK.message,
                `Bookings cached retrieved`,
                cachedBooking
            )
        );
    }
    else{
        Booking.findAll({
            where : {
                UserId: userIdConnected
            }
        })
        .then(async(data) =>{
            if(data){
                logger.info(`Bookings retrieved for user with ID ${userIdConnected}`);
                await setCache("bookings", data)
                res.status(HttpStatus.OK.code)
                .send(new Response(HttpStatus.OK.code,HttpStatus.OK.message,`Bookings retrieved`, data));
            }
            else{
                logger.warn(`No bookings found for user with ID ${userIdConnected}`);
    
                res.status(HttpStatus.NOT_FOUND.code)
                   .send(new Response(HttpStatus.NOT_FOUND.code,HttpStatus.NOT_FOUND.message, `Bookings not found`, data));
            }
        })    
        .catch(err => {
            logger.error(`Error while retrieving bookings for user with ID ${userIdConnected}: ${err.message}`);
    
            res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
            .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code,HttpStatus.INTERNAL_SERVER_ERROR.message,`Some error occurred while retrieving bookings.`, err));
        });
    }
};

exports.findOneBooking = async (req, res) => {

    const id = req.params.id;
    const userIdConnected = req.user.id;

    const booking = await findOne({where : {id: id}})

    if(userIdConnected !== booking.UserId){
        logger.warn(`Unauthorized access to booking with ID ${id} by user with ID ${userIdConnected}`);

        res.status(HttpStatus.FORBIDDEN.code).send(
            new Response(
                HttpStatus.FORBIDDEN.code,
                HttpStatus.FORBIDDEN.message,
                "You're not the owner of this booking",
            )
        );
    }

    logger.info(`Fetching booking with ID ${id}`);
    const cachedOneBooking = await getCache("oneBooking");
    if(cachedOneBooking){
        res.status(HttpStatus.OK.code).send(
            new Response(
                HttpStatus.OK.code,
                HttpStatus.OK.message,
                `Booking cached retrieved`,
                cachedOneBooking
            )
        );
    }
    else{
        Booking.findOne({
            where : {
                id : id
            }
        })
        .then(async(data) => {
            if(data){
                logger.info(`Booking with ID ${id} retrieved`);
                await setCache("oneBooking", data)
                res.status(HttpStatus.OK.code)
                .send(new Response(HttpStatus.OK.code,HttpStatus.OK.message,`Booking retrieved`, data));
            } else{
                logger.warn(`No booking found with ID ${id}`);
    
                res.status(HttpStatus.NOT_FOUND.code)
                   .send(new Response(HttpStatus.NOT_FOUND.code,HttpStatus.NOT_FOUND.message,`Booking not found`, data));
            }
        })
        .catch((err) => {
            logger.error(`Error while retrieving booking with ID ${id}: ${err.message}`);
    
            res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
            .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code,HttpStatus.INTERNAL_SERVER_ERROR.message,
                `Some error occurred while retrieving bookings.`, err));
        });
    }
};


exports.createBooking = async (req, res) => {

    const userIdConnected = req.user.id

    const {PostId} = req.body

    if (!PostId) {
        logger.warn('The post ID is missing in the body of the request');
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
        logger.warn('The post ID is not a valid number');
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
        logger.warn('The selected ad does not exist');
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
            logger.warn('Content can not be empty!');
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
        logger.warn('You cannot create a booking because you are the owner of the post selected.');
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
        logger.info('Booking created');
        if(response[0] === 0){
            logger.warn('The response returned is empty');
            res.status(HttpStatus.BAD_REQUEST.code).send(
                new Response(
                    HttpStatus.BAD_REQUEST.code,
                    HttpStatus.BAD_REQUEST.message,
                    'The response returned is empty'
                )
            )
        }

    const role = await Role.findOne({ where: { title: "Locataire" } });
    const booking = await Booking.findAll({where : {UserId : userIdConnected}});

    if(booking.length == 1){
        if(role){
            let roleUser = {};
            roleUser = {
                UserId: userIdConnected ? userIdConnected : null,
                RoleId: role.id ? role.id : null
            }
            for(value in roleUser){
                if(!roleUser[value]){
                    logger.warn('Content cannot be empty');
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
                    logger.warn('Any response for RoleUser was returned');
                    res.status(HttpStatus.NOT_FOUND.code).send(
                        new Response(
                            HttpStatus.NOT_FOUND.code,
                            HttpStatus.NOT_FOUND.message,
                            'Any response for RoleUser was returned'
                        )
                    )
                }
                logger.info('Booking and role user is created');
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
                logger.error('An internal error has occurred');
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
            logger.warn(`Any role ${role.title} was found`);
            res.status(HttpStatus.NOT_FOUND.code).send(
                new Response(
                    HttpStatus.NOT_FOUND.code,
                    HttpStatus.NOT_FOUND.message,
                    `Any role ${role.title} was found`
                )
            )
        }
    }
    else{
        logger.info('Booking is created');
        res.status(HttpStatus.CREATED.code).send(
            new Response(
                HttpStatus.CREATED.code,
                HttpStatus.CREATED.message,
                'Booking is created',
                response
            )
        )
    }        
})
    .catch (error => {
        logger.error('Some error occurred while creating the account');
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

    if(userIdConnected !== userBookingId.UserId){
        logger.warn("You're not the owner of this booking");
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
    .then(async (data) => {
        if(data){
            logger.info("Booking deleted");
            const booking = await Booking.findAll({where : {UserId : userIdConnected}})
            if(booking.length == 0){
                const roleUsers = await RoleUser.findAll({where : {UserId : userIdConnected}});
                if(roleUsers){
                    const findRoleId = roleUsers.find(roleUser => roleUser.RoleId === 1);
                    if(findRoleId && findRoleId.RoleId){
                        RoleUser.destroy({where : {RoleId : findRoleId.RoleId}})
                        .then(() => {
                            logger.info("RoleUser deleted");
                            res.status(HttpStatus.NO_CONTENT.code).send(
                                new Response(
                                    HttpStatus.NO_CONTENT.code,
                                    HttpStatus.NO_CONTENT.message, 
                                    )
                                );
                            })
                        }
                        else{
                            logger.warn(`Cannot found RoleUser with this RoleId value ${findRoleId.RoleId}`);
                            res.status(HttpStatus.NOT_FOUND.code).send(
                                new Response(
                                    HttpStatus.NOT_FOUND.code,
                                    HttpStatus.NOT_FOUND.message, 
                                    `Cannot found RoleUser with this RoleId value ${findRoleId.RoleId}`
                                )
                            );
                        }
                    }
                    else{
                        logger.warn(`Cannot found RoleUser with this UserId value ${userIdConnected}`);
                        res.status(HttpStatus.NOT_FOUND.code).send(
                            new Response(
                                HttpStatus.NOT_FOUND.code,
                                HttpStatus.NOT_FOUND.message, 
                                `Cannot found RoleUser with this UserId value ${userIdConnected}`
                            )
                        );
                    }
                }
                else{
                    logger.info("Booking deleted");
                    res.status(HttpStatus.NO_CONTENT.code).send(
                        new Response(
                            HttpStatus.NO_CONTENT.code,
                            HttpStatus.NO_CONTENT.message, 
                        )
                    );
                }
            } 
            else{
                logger.warn("Booking not found");
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
            logger.error("An error occurred while deleting the reservation");
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

