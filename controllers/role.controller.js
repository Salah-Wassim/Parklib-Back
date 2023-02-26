const Role = require("../models").Role;
const User = require("../models").User;
const HttpStatus = require("../utils/httpStatus.util.js");
const Response = require("../utils/response.util.js");

exports.list_role = (req, res) => {
    Role.findAll()
    .then(data => {
        if(data[0]===0){
            res.status(HttpStatus.NOT_FOUND.code).send(
                new Response(
                    HttpStatus.NOT_FOUND.code,
                    HttpStatus.NOT_FOUND.message,
                    'Any role found'
                )
            )
        }
        res.status(HttpStatus.OK.code).send(
            new Response(
                HttpStatus.OK.code,
                HttpStatus.OK.message,
                'Role retrieved',
                data
            )
        )
    })
    .catch(err => {
        console.log('error', err);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(
            new Response(
                HttpStatus.INTERNAL_SERVER_ERROR.code,
                HttpStatus.INTERNAL_SERVER_ERROR.message,
                'Internal error'
            )
        )
    })
}

exports.find_one_role = (req, res) => {
    const title = req.params.title;
    Role.findOne({
        where : {
            title : title
        }
    })
    .then(data => {
        if(data[0]===0){
            res.status(HttpStatus.NOT_FOUND.code).send(
                new Response(
                    HttpStatus.NOT_FOUND.code,
                    HttpStatus.NOT_FOUND.message,
                    `Any role found with this title value ${title}`
                )
            )
        }
        res.status(HttpStatus.OK.code).send(
            new Response(
                HttpStatus.OK.code,
                HttpStatus.OK.message,
                'Role retrieved',
                data
            )
        )
    })
    .catch(err => {
        console.log('error', err);
        if(err.name === "SequelizeUniqueConstraintError"){
            res.status(HttpStatus.BAD_REQUEST.code).send(
                new Response(
                    HttpStatus.BAD_REQUEST.code,
                    HttpStatus.BAD_REQUEST.message,
                    'Bad request'
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

exports.findOne_role_by_user = (req, res) => {

    const title = req.params.title;

    if(!title){
        res.status(HttpStatus.BAD_REQUEST.code).send(
            new Response(
                HttpStatus.BAD_REQUEST.code,
                HttpStatus.BAD_REQUEST.message,
                `Bad request`
            )
        )
    }

    Role.findOne({
        where : {
            title : title
        },
        include: [
            {
                model: User,
            }
        ]
    })
    .then(response => {
        if(response[0]===0){
            res.status(HttpStatus.NOT_FOUND.code).send(
                new Response(
                    HttpStatus.NOT_FOUND.code,
                    HttpStatus.NOT_FOUND.message,
                    'No user with this role was found'
                )
            )
        }
        res.status(HttpStatus.OK.code).send(
            new Response(
                HttpStatus.OK.code,
                HttpStatus.OK.message,
                response
            )
        )
    })
    .catch(err => {
        console.log('error', err);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(
            new Response(
                HttpStatus.INTERNAL_SERVER_ERROR.code,
                HttpStatus.INTERNAL_SERVER_ERROR.message,
                'Internal error'
            )
        )
    })
}

exports.create_role = (req, res) => {
    const title = req.body.title;

    let role;

    role = {
        title : title ? title : ""
    }

    for(value in role){
        if(!role[value]){
            res.status(HttpStatus.BAD_REQUEST.code).send(
                new Response(
                    HttpStatus.BAD_REQUEST.code,
                    HttpStatus.BAD_REQUEST.message,
                    `Title value ${title}, cannot be empty`
                )
            )
        }
    }

    Role.create(role)
    .then(response => {
        if(response[0] === 0){
            res.status(HttpStatus.BAD_REQUEST.code).send(
                new Response(
                    HttpStatus.BAD_REQUEST.code,
                    HttpStatus.BAD_REQUEST.message,
                    'The response returned is empty'
                )
            )
        }
        res.status(HttpStatus.CREATED.code).send(
            new Response(
                HttpStatus.CREATED.code,
                HttpStatus.CREATED.message,
                'Role has been created',
                response
            )
        )
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
                'Internal error'
            )
        )
    })
}

exports.update_role = (req, res) => {

    const titleParams = req.params.title;

    const title = req.body.title;

    let role;

    role = {
        title : title ? title : ""
    }

    for(value in role){
        if(!role[value]){
            res.status(HttpStatus.BAD_REQUEST.code).send(
                new Response(
                    HttpStatus.BAD_REQUEST.code,
                    HttpStatus.BAD_REQUEST.message,
                    `Title value ${title}, cannot be empty`
                )
            )
        }
    }

    Role.update(role, {
        where : {
            title : titleParams
        }
    })
    .then(response => {
        if(response[0]===0){
            res.status(HttpStatus.BAD_REQUEST.code).send(
                new Response(
                    HttpStatus.BAD_REQUEST.code,
                    HttpStatus.BAD_REQUEST.message,
                    `The response is empty`
                )
            )
        }
        res.status(HttpStatus.OK.code).send(
            new Response(
                HttpStatus.OK.code,
                HttpStatus.OK.message,
                `Role ${title} has been modified`,
                role,
            )
        )
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

exports.delete_role = (req, res) => {
    const title = req.params.title;

    if(!title){
        res.status(HttpStatus.BAD_REQUEST.code).send(
            new Response(
                HttpStatus.BAD_REQUEST.code,
                HttpStatus.BAD_REQUEST.message,
                `Bad request`
            )
        )
    }

    Role.destroy({
        where : {
            title : title
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
                'Internal error'
            )
        )
    })
}