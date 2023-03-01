const ValidationStatus = require("../models").ValidationStatus;
const HttpStatus = require("../utils/httpStatus.util.js");
const Response = require("../utils/response.util.js");

exports.List_All_ValidationStatus = (req, res) => {
    ValidationStatus.findAll({
        attributes: ['id', 'title'],
    })
    .then(data => {
        if(data){
            res.status(HttpStatus.OK.code).send(
                new Response(
                    HttpStatus.OK.code,
                    HttpStatus.OK.message,
                    'Validation status',
                    data
                )
            )
        }
    })
    .catch(err => {
        console.log("error", err);
        console.error(err);
        if(err.name === "'SequelizeUniqueConstraintError'"){
            res.status(HttpStatus.NOT_FOUND.code).send(
                new Response(
                    HttpStatus.NOT_FOUND.code,
                    HttpStatus.NOT_FOUND.message,
                    'Any ValidationStatus was found'
                )
            )
        }
        else{
            res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(
                new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.code,
                    HttpStatus.INTERNAL_SERVER_ERROR.message,
                    'Internal error'
                )
            )
        }
    })
}

exports.List_One_ValidationStatus = (req, res) => {
    const id = req.params.id;

    if(!id){
        res.status(HttpStatus.BAD_REQUEST.code).send(
            new Response(
                HttpStatus.BAD_REQUEST.code,
                HttpStatus.BAD_REQUEST.message,
                `Something wrong with id value ${id}`
            )
        )
    }

    ValidationStatus.findOne({
        where : {
            id : id
        }
    })
    .then(data => {
        if(data[0]===0){
            res.status(HttpStatus.NOT_FOUND.code).send(
                new Response(
                    HttpStatus.NOT_FOUND.code,
                    HttpStatus.NOT_FOUND.message,
                    'Any response was found'
                )
            )
        }
        else{
            res.status(HttpStatus.OK.code).send(
                new Response(
                    HttpStatus.OK.code,
                    HttpStatus.OK.message,
                    data
                )
            )
        }
    })
    .catch(err => {
        console.log("error", err);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(
            new Response(
                HttpStatus.INTERNAL_SERVER_ERROR.code,
                HttpStatus.INTERNAL_SERVER_ERROR.message,
                'Internal error'
            )
        )
    })
}

exports.Create_ValidationStatus = async (req, res) => {

    const title = req.body.title;

    let validationStatus = {};

    validationStatus = {
        title : title ? title : ""
    }

    for(value in validationStatus){
        if(!validationStatus[value]){
            res.status(HttpStatus.BAD_REQUEST.code).send(
                new Response(
                    HttpStatus.BAD_REQUEST.code,
                    HttpStatus.BAD_REQUEST.message,
                    `Field ${title} cannot be empty`
                )
            )
        }
    }

    const isValidationStatusExist = await ValidationStatus.findOne({
        where : {title : title}
    })

    if(isValidationStatusExist){
        res.status(HttpStatus.CONFLICT.code).send(
            new Response(
                HttpStatus.CONFLICT.code,
                HttpStatus.CONFLICT.message,
                `ValidationStatus with this name value ${title} already exist.`
            )
        )
        return false;
    }

    ValidationStatus.create(validationStatus)
    .then(response => {
        if(response[0]===0){
            res.status(HttpStatus.BAD_REQUEST.code).send(
                new Response(
                    HttpStatus.BAD_REQUEST.code,
                    HttpStatus.BAD_REQUEST.message,
                    'Any response has been returned'
                )
            )
        }
        else{
            res.status(HttpStatus.CREATED.code).send(
                new Response(
                    HttpStatus.CREATED.code,
                    HttpStatus.CREATED.message,
                    response
                )
            )
        }
    })
    .catch(err => {
        console.log("error", err);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(
            new Response(
                HttpStatus.INTERNAL_SERVER_ERROR.code,
                HttpStatus.INTERNAL_SERVER_ERROR.message,
                'Internal error'
            )
        )
    })
    
}

exports.Update_ValidationStatus = (req, res) => {
    const id = req.params.id;

    if(!id){
        res.status(HttpStatus.BAD_REQUEST.code).send(
            new Response(
                HttpStatus.BAD_REQUEST.code,
                HttpStatus.BAD_REQUEST.message,
                `Something wrong with id value ${id}`
            )
        )
    }

    const title = req.body.title;

    let validationStatus = {};

    validationStatus = {
        title : title ? title : ""
    }

    for(value in validationStatus){
        if(!validationStatus[value]){
            res.status(HttpStatus.BAD_REQUEST.code).send(
                new Response(
                    HttpStatus.BAD_REQUEST.code,
                    HttpStatus.BAD_REQUEST.message,
                    `Field ${title} cannot be empty`
                )
            )
        }
    }

    ValidationStatus.update(validationStatus, {
        where : {
            id : id
        }
    })
    .then(response => {
        if(response[0]===0){
            res.status(HttpStatus.BAD_REQUEST.code).send(
                new Response(
                    HttpStatus.BAD_REQUEST.code,
                    HttpStatus.BAD_REQUEST.message,
                    'Any response has been returned'
                )
            )
        }
        else{
            res.status(HttpStatus.CREATED.code).send(
                new Response(
                    HttpStatus.CREATED.code,
                    HttpStatus.CREATED.message,
                    response
                )
            )
        }
    })
    .catch(err => {
        console.log("error", err);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(
            new Response(
                HttpStatus.INTERNAL_SERVER_ERROR.code,
                HttpStatus.INTERNAL_SERVER_ERROR.message,
                'Internal error'
            )
        )
    })

    
}

exports.Delete_ValidationStatus = (req, res) => {
    const id = req.params.id;

    if(!id){
        res.status(HttpStatus.BAD_REQUEST.code).send(
            new Response(
                HttpStatus.BAD_REQUEST.code,
                HttpStatus.BAD_REQUEST.message,
                `Something wrong with id value ${id}`
            )
        )
    }

    ValidationStatus.destroy({
        where : {
            id : id
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
        console.log("error", err);
        if(err.name === "SequelizeUniqueConstraintError"){
            res.status(HttpStatus.NOT_FOUND.code).send(
                new Response(
                    HttpStatus.NOT_FOUND.code,
                    HttpStatus.NOT_FOUND.message,
                    `ValidationStatus with this id value ${id} was not found.`
                )
            )
        }
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(
            new Response(
                HttpStatus.INTERNAL_SERVER_ERROR.code,
                HttpStatus.INTERNAL_SERVER_ERROR.message,
                'Internal error'
            )
        )
    })
}