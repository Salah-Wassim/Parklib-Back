const ParkingParticulier = require('../models').ParkingParticulier;
const Post  = require('../models').Post;
const ValidationStatus = require("../models").ValidationStatus;
const User = require("../models").User;
const HttpStatus = require("../utils/httpStatus.util.js");
const Response = require("../utils/response.util.js");

exports.list_post = (req, res, next) => {
    Post.findAll({
        order : [
            ['price', 'DESC']
        ],
        include: [
            {
                model: ValidationStatus,
                attributes: ['id', 'title']
            },
            {
                model: ParkingParticulier,
            },
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName', 'phone', 'email', 'picture']
            }
        ]
    })
    .then(data => { 
        if(data){
            res.status(HttpStatus.OK.code).send(
                new Response(
                    HttpStatus.OK.code,
                    HttpStatus.OK.message,
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

exports.list_post_by_parkingParticulier = (req, res, next) => {
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
                model: ValidationStatus,
                attributes: ['id', 'title']
            },
        ]
    })
    .then(data => {     
        if(data){
            res.status(HttpStatus.OK.code).send(
                new Response(
                    HttpStatus.OK.code,
                    HttpStatus.OK.message,
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

exports.list_post_by_user = (req, res, next) => {
    Post.findAll({
        order : [
            ['price', 'DESC']
        ],
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName', 'phone', 'email', 'picture'],
                where: {
                    id: req.params.id
                }
            },
            {
                model: ValidationStatus,
                attributes: ['id', 'title']
            },
        ]
    })
    .then(data => {     
        if(data){
            res.status(HttpStatus.OK.code).send(
                new Response(
                    HttpStatus.OK.code,
                    HttpStatus.OK.message,
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

exports.create_post = async (req, res, next) => {

    const {title, description, price, contact, isAssured, typeOfPlace, ValidationStatusId, ParkingParticulierId } = req.body

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
        title : title && typeof(title)==="string" ? post.title = title : "",
        description: description && typeof(description)==="string" ? post.description = description : "",
        price : price && typeof(price)==="number" ? post.price = price : null,
        contact : contact && typeof(contact)==="string" ? post.contact = contact : "",
        isAssured : isAssured && typeof(isAssured)==="boolean" ? post.isAssured = isAssured : false,
        typeOfPlace : typeOfPlace && typeof(typeOfPlace )==="string" ? post.typeOfPlace = typeOfPlace : "",
        ValidationStatusId : ValidationStatusId && typeof(ValidationStatusId)==="number" ? post.ValidationStatusId = ValidationStatusId : 1,
        ParkingParticulierId : ParkingParticulierId && typeof(ParkingParticulierId)==="number" ? post.ParkingParticulierId = ParkingParticulierId : null
    }

    for(value in post){
        if(!post[value]){
            res.status(HttpStatus.BAD_REQUEST.code).send(
                new Response(
                    HttpStatus.BAD_REQUEST.code,
                    HttpStatus.BAD_REQUEST.message,
                    'All attributs must be filled or type of attributs is incorrect',
                    `${value}: ${post[value]}`
                )
            )
        }
    }

    Post.create(post)
    .then(response => {
        if(response[0]===0){
            res.status(HttpStatus.BAD_REQUEST.code).send(
                new Response(
                    HttpStatus.BAD_REQUEST.code,
                    HttpStatus.BAD_REQUEST.message,
                    'The response returned is empty'
                )
            )
        }
        else {
            res.status(HttpStatus.CREATED.code).send(
                new Response(
                    HttpStatus.CREATED.code,
                    HttpStatus.CREATED.message,
                    'Post is created',
                    post
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

    const {title, description, price, contact, isAssured, typeOfPlace} = req.body

    let post = {};

    post = {
        title : title && typeof(title)==="string" ? post.title = title : "",
        description: description && typeof(description)==="string" ? post.description = description : "",
        price : price && typeof(price)==="number" ? post.price = price : null,
        contact : contact && typeof(contact)==="string" ? post.contact = contact : "",
        isAssured : isAssured && typeof(isAssured)==="boolean" ? post.isAssured = isAssured : null,
        typeOfPlace : typeOfPlace && typeof(typeOfPlace )==="string" ? post.typeOfPlace = typeOfPlace : "",
    };

    for(value in post){
        if(!post[value]){
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

