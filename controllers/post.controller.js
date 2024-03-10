const ParkingParticulier = require('../models').ParkingParticulier;
const Post  = require('../models').Post;
const ValidationStatus = require("../models").ValidationStatus;
const User = require("../models").User;
const Picture = require("../models").Picture;
const HttpStatus = require("../utils/httpStatus.util.js");
const Response = require("../utils/response.util.js");
const { getCache, setCache } = require('../redis/cache')

const logger = require("../utils/logger.util.js");

exports.list_post = async (req, res, next) => {
    try {
        const cachedPost = await getCache('posts');
        if (cachedPost) {
            res.status(HttpStatus.OK.code).send(
                new Response(
                    HttpStatus.OK.code,
                    HttpStatus.OK.message,
                    `Posts cached retrieved`,
                    cachedPost
                )
            );
        } else {
            const data = await Post.findAll({
                order: [
                    ['price', 'DESC']
                ],
                include: [
                    {
                        model: ParkingParticulier,
                    },
                    {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName', 'phone', 'email', 'picture']
                    },
                    {
                        model: Picture
                    }
                ]
            });
            if (data) {
                await setCache('posts', data)
                res.status(HttpStatus.OK.code).send(
                    new Response(
                        HttpStatus.OK.code,
                        HttpStatus.OK.message,
                        `All posts are retrieved`,
                        data,
                    )
                );
            } else {
                res.status(HttpStatus.NOT_FOUND.code).send(
                    new Response(
                        HttpStatus.NOT_FOUND.code,
                        HttpStatus.NOT_FOUND.message,
                    )
                )
            }
        }
    } catch (err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(
            new Response(
                HttpStatus.INTERNAL_SERVER_ERROR.code,
                HttpStatus.INTERNAL_SERVER_ERROR.message,
                "Some error occurred while retrieving posts"
            )
        )
    }
};

exports.list_one_post = (req, res) => {
    const id = req.params.id;

    if (!id) {
        res.status(HttpStatus.BAD_REQUEST.code).send(
            new Response(
                HttpStatus.BAD_REQUEST.code,
                HttpStatus.BAD_REQUEST.message,
                `Id can not be empty!`
            )
        );
    }

    Post.findOne({
        where : {
            id : id
        },
        include: [
            {
                model: ParkingParticulier,
            },
            {
                model: Picture,
            }
        ]
    })
    .then(data => {     
        if(data){
            res.status(HttpStatus.OK.code).send(
                new Response(
                    HttpStatus.OK.code,
                    HttpStatus.OK.message,
                    `Post are retrieved`,
                    data,
                )
            );
        }    
    })
    .catch(err => {
        console.error(err);
        if(err.name === "'SequelizeUniqueConstraintError'"){
            res.status(HttpStatus.NOT_FOUND.code).send(
                new Response(
                    HttpStatus.NOT_FOUND.code,
                    HttpStatus.NOT_FOUND.message,
                )
            )
        }
        else{
            res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(
                new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.code,
                    HttpStatus.INTERNAL_SERVER_ERROR.message,
                )
            )
        }
    })
}

exports.list_post_by_parkingParticulier = async (req, res, next) => {
    const cachedPostByParking = await getCache('postsByParking');
    if(cachedPostByParking){
        res.status(HttpStatus.OK.code).send(
            new Response(
                HttpStatus.OK.code,
                HttpStatus.OK.message,
                `Post by parking cached retrieved`,
                cachedPostByParking
            )
        );
    }
    else{
        Post.findAll({
            order : [
                ['price', 'DESC']
            ],
            include: [
                {
                    model: ParkingParticulier,
                    where: {
                        id: req.params.id
                    }
                },
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName', 'phone', 'email', 'picture']
                },
                {
                    model: Picture
                }
            ]
        })
        .then(async(data) => {     
            if(data){
                await setCache('postsByParking', data)
                res.status(HttpStatus.OK.code).send(
                    new Response(
                        HttpStatus.OK.code,
                        HttpStatus.OK.message,
                        `All post by parking are retrieved`,
                        data,
                    )
                );
            }    
        })
        .catch(err => {
            console.error(err);
            if(err.name === "'SequelizeUniqueConstraintError'"){
                res.status(HttpStatus.NOT_FOUND.code).send(
                    new Response(
                        HttpStatus.NOT_FOUND.code,
                        HttpStatus.NOT_FOUND.message,
                    )
                )
            }
            else{
                res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(
                    new Response(
                        HttpStatus.INTERNAL_SERVER_ERROR.code,
                        HttpStatus.INTERNAL_SERVER_ERROR.message,
                    )
                )
            }
        })
    }
}

exports.list_post_by_user = async (req, res, next) => {
    const cachedPostByUser = await getCache('postsByUser');
    if(cachedPostByUser){
        res.status(HttpStatus.OK.code).send(
            new Response(
                HttpStatus.OK.code,
                HttpStatus.OK.message,
                `Post by user cached retrieved`,
                cachedPostByUser
            )
        );
    }
    else{
        Post.findAll({
            order : [
                ['price', 'DESC']
            ],
            include: [
                {
                    model: ParkingParticulier,
                },
                {
                    model: User,
                    where:{
                        id: req.params.id
                    },
                    attributes: ['id', 'firstName', 'lastName', 'phone', 'email'],
                },
                {
                    model: ValidationStatus,
                    attributes: ['id', 'title']
                },
            ]
        })
        .then(async (data) => {     
            if(data){
                await setCache('postsByUser', data)
                res.status(HttpStatus.OK.code).send(
                    new Response(
                        HttpStatus.OK.code,
                        HttpStatus.OK.message,
                        `All post by user are retrieved`,
                        data,
                    )
                );
            }    
        })
        .catch(err => {
            console.error(err);
            if(err.name === "'SequelizeUniqueConstraintError'"){
                res.status(HttpStatus.NOT_FOUND.code).send(
                    new Response(
                        HttpStatus.NOT_FOUND.code,
                        HttpStatus.NOT_FOUND.message,
                    )
                )
            }
            else{
                res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(
                    new Response(
                        HttpStatus.INTERNAL_SERVER_ERROR.code,
                        HttpStatus.INTERNAL_SERVER_ERROR.message,
                    )
                )
            }
        })
    }
}

exports.create_post = async (req, res, next) => {

    const { title, description, price, contact, isAssured, typeOfPlace, ValidationStatusId, ParkingParticulierId } = req.body
    const user = req.user

    if(!ParkingParticulierId){
        res.status(HttpStatus.FORBIDDEN.code).send(
            new Response(
                HttpStatus.FORBIDDEN.code,
                HttpStatus.FORBIDDEN.message,
                "You can't create a post because you don't own a parking lot"
            )
        )
    }

    let post = {};

    post= {
        title : title && typeof(title)==="string" ? title : "",
        description: description && typeof(description)==="string" ? description : "",
        price : price && typeof(price)==="number" ? price : null,
        contact : contact && typeof(contact)==="string" ? contact : "",
        isAssured : isAssured && typeof(isAssured)==="boolean" ? isAssured : false,
        typeOfPlace : typeOfPlace && typeof(typeOfPlace )==="string" ? typeOfPlace : "",
        ValidationStatusId : ValidationStatusId && typeof(ValidationStatusId)==="number" ? ValidationStatusId : 1,
        ParkingParticulierId: ParkingParticulierId && typeof (ParkingParticulierId) === "number" ? ParkingParticulierId : null,
        UserId: user.id && typeof(user.id) === "number" ? user.id : null
    }

    for(value in post){
        if(!post[value] && (value != 'isAssured')){
            res.status(HttpStatus.BAD_REQUEST.code).send(
                new Response(
                    HttpStatus.BAD_REQUEST.code,
                    HttpStatus.BAD_REQUEST.message,
                    'All attributs must be filled or type of attributs is incorrect',
                    `${value}: ${post[value]} , ${typeof(post['value'])}`
                )
            )
        }
    }

    logger.info(
        `${req.method} ${req.originalUrl}, Creating new post.`
    );

    Post.create(post)
    .then(data => {
        if(data[0]===0){
            res.status(HttpStatus.BAD_REQUEST.code).send(
                new Response(
                    HttpStatus.BAD_REQUEST.code,
                    HttpStatus.BAD_REQUEST.message,
                    'The response returned is empty',
                )
            )
        }
        else {

            SocketIoService.socket.broadcast.emit('message', `${req.method} ${req.originalUrl}, Fetching users.`);
    
            res.status(HttpStatus.CREATED.code).send(
                new Response(
                    HttpStatus.CREATED.code,
                    HttpStatus.CREATED.message,
                    'Post is created',
                    data
                )
            )
        }
    })
    .catch(err => {
        console.error(err);
        if(err.name === "SequelizeUniqueConstraintError"){
            res.status(HttpStatus.CONFLICT.code).send(
                new Response(
                    HttpStatus.CONFLICT.code,
                    HttpStatus.CONFLICT.message,
                    'The post you\'ve been created is already existing'
                )
            )
        }
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(
            new Response(
                HttpStatus.INTERNAL_SERVER_ERROR.code,
                HttpStatus.INTERNAL_SERVER_ERROR.message,
            )
        )
    })
}

exports.edit_post = async (req, res, next) => {
    const id = req.params.id

    if(!id){
        res.status(HttpStatus.BAD_REQUEST.code).send(
            new Response(
                HttpStatus.BAD_REQUEST.code,
                HttpStatus.BAD_REQUEST.message,
                `Id value ${id} cannot exist or type is incorrect`
            )
        )
    }

    const {title, description, price, contact, isAssured, typeOfPlace, ValidationStatusId, ParkingParticulierId} = req.body
    const user = req.user

    let post = {};

    post = {
        title : title && typeof(title)==="string" ? title : "",
        description: description && typeof(description)==="string" ? description : "",
        price : price && typeof(price)==="number" ? price : null,
        contact : contact && typeof(contact)==="string" ? contact : "",
        isAssured : isAssured && typeof(isAssured)==="boolean" ? isAssured : false,
        typeOfPlace : typeOfPlace && typeof(typeOfPlace )==="string" ? typeOfPlace : "",
        ValidationStatusId : ValidationStatusId && typeof(ValidationStatusId)==="number" ? ValidationStatusId : 1,
        ParkingParticulierId: ParkingParticulierId && typeof (ParkingParticulierId) === "number" ? ParkingParticulierId : null,
        UserId: user.id && typeof(user.id) === "number" ? user.id : null
    };

    for(value in post){
        if(!post[value] && (value != 'isAssured')){
            console.error('bad request')
            res.status(HttpStatus.BAD_REQUEST.code).send(
                new Response(
                    HttpStatus.BAD_REQUEST.code,
                    HttpStatus.BAD_REQUEST.message,
                    'Content cannot be empty'
                )
            );
            return false;
        }
    }

    const UserId = req.user.id;

    const parkingParticulier = await ParkingParticulier.findOne({
        where:{
            UserId: UserId
        }
    });

    const parkingParticulierSelected = await Post.findOne({
        where:{
            id: id
        }
    })

    if(parkingParticulier.id !== parkingParticulierSelected.ParkingParticulierId){
        res.status(HttpStatus.FORBIDDEN.code).send(
            new Response(
                HttpStatus.FORBIDDEN.code,
                HttpStatus.FORBIDDEN.message,
                'You\'re not the owner of those post'
            )
        )
    }

    Post.update(post, {
        where : {
            id : id
        }
    })
    .then(response => {
        console.log(typeof(response))
        if(response[0]===0){
            res.status(HttpStatus.BAD_REQUEST.code).send(
                new Response(
                    HttpStatus.BAD_REQUEST.code,
                    HttpStatus.BAD_REQUEST.message,
                    `The response is empty`
                )
            )
        }
        else{
            res.status(HttpStatus.OK.code).send(
                new Response(
                    HttpStatus.OK.code,
                    HttpStatus.OK.message,
                    post,
                )
            )
        }
    })
    .catch(err => {
        console.log(err);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(
            new Response(
                HttpStatus.INTERNAL_SERVER_ERROR.code,
                HttpStatus.INTERNAL_SERVER_ERROR.message,
            )
        )
    })
}

exports.update_validationStatus_post = async (req, res) => {
    const id = req.params.id;
    const validationStatusId = req.body.ValidationStatusId;

    if(!id){
        res.status(HttpStatus.BAD_REQUEST.code).send(
            new Response(
                HttpStatus.BAD_REQUEST.code,
                HttpStatus.BAD_REQUEST.message,
                `Something wrong with id value ${id}`
            )
        )
    }

    const post = await Post.findOne({where : { id : id }}); 

    const isValidationStatusIdExist = await ValidationStatus.findOne({
        where : { id : validationStatusId}
    })

    if(!post || !isValidationStatusIdExist){
        res.status(HttpStatus.NOT_FOUND.code).send(
            new Response(
                HttpStatus.NOT_FOUND.code,
                HttpStatus.NOT_FOUND.message,
                `Id post value ${id} of post or id validationStatus ${isValidationStatusIdExist} was not found`
            )
        )
        return false;
    }

    let newPost = {};

    newPost = {
        ValidationStatusId : validationStatusId && typeof(validationStatusId)==="number" ? newPost.validationStatusId = validationStatusId : null,
    }

    for(value in newPost){
        console.log("newPost", newPost[value])
        if(!newPost[value]){
            res.status(HttpStatus.BAD_REQUEST.code).send(
                new Response(
                    HttpStatus.BAD_REQUEST.code,
                    HttpStatus.BAD_REQUEST.message,
                    `Field ValidationStatusId cannot be empty`
                )
            );
            return false;
        }
    }

    // TODO : Ajouter une vérification afin que seul l'admin puis faire la modif

    Post.update(newPost, {where : {id : id}})
    .then(response => {
        if(response){
            res.status(HttpStatus.CREATED.code).send(
                new Response(
                    HttpStatus.CREATED.code,
                    HttpStatus.CREATED.message,
                    'ValidationStatus id updated sucessfully',
                    response
                )
            )
        }
    })
    .catch(err => {
        console.log(err);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(
            new Response(
                HttpStatus.INTERNAL_SERVER_ERROR.code,
                HttpStatus.INTERNAL_SERVER_ERROR.message,
                'Internal error'
            )
        )
    })
}

exports.delete_post = async (req, res, next) => {
    const id = req.params.id;
    if(!id){
        res.status(HttpStatus.BAD_REQUEST.code).send(
            new Response(
                HttpStatus.BAD_REQUEST.code,
                HttpStatus.BAD_REQUEST.message,
                `Id value ${id}, cannot be empty`
            )
        )
    }

    const UserId = req.user.id;

    const parkingParticulier = await ParkingParticulier.findOne({
        where:{
            UserId: UserId
        }
    });

    const parkingParticulierSelected = await Post.findOne({
        where:{
            id: id
        }
    })

    if(parkingParticulier.id !== parkingParticulierSelected.ParkingParticulierId){
        res.status(HttpStatus.FORBIDDEN.code).send(
            new Response(
                HttpStatus.FORBIDDEN.code,
                HttpStatus.FORBIDDEN.message,
                'You\'re not the owner of those post'
            )
        )
    }

    Post.destroy({
        where : {
            id: id
        }
    })
    .then(() => {
        res.status(HttpStatus.NO_CONTENT.code).send(
            new Response(
                HttpStatus.NO_CONTENT.code,
                HttpStatus.NO_CONTENT.message,
            )
        )
    })
    .catch(err => {
        console.log(err);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(
            new Response(
                HttpStatus.INTERNAL_SERVER_ERROR.code,
                HttpStatus.INTERNAL_SERVER_ERROR.message,
            )
        )
    })
}

exports.details_post = (req, res, next) => {
    const id = req.params.id;
    Post.findByPk(id)
    .then(data => {
        res.status(HttpStatus.OK.code).send(
            new Response(
                HttpStatus.OK.code,
                HttpStatus.OK.message,
                data,
            )
        )
    })
    .catch(err => {
        console.log(err);
        res.status(404).json(err)
    })
}

exports.search_post = (req, res, next) => {
    const search = `%${req.params.search}%`;
    Post.findAll({
        where : {
            name : {
                [Op.like] : search
            }
        }
    })
    .then(data => {
        if(data){
            res.status(HttpStatus.OK.code).send(
                new Response(
                    HttpStatus.OK.code,
                    HttpStatus.OK.message,
                    data,
                )
            )
        }
    })
    .catch(err => {
        console.error(err);
        if(err.name === "SequelizeUniqueConstraintError"){
            res.status(HttpStatus.NOT_FOUND.code).send(
                new Response(
                    HttpStatus.NOT_FOUND.code,
                    HttpStatus.NOT_FOUND.message,
                )
            )
        }
        else{
            res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(
                new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.code,
                    HttpStatus.INTERNAL_SERVER_ERROR.message,
                )
            )
        }
    });
}

