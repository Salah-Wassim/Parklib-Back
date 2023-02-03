const Post  = require('../models').Post;

exports.list_post = (req, res) => {
    Post.findAll({
        order : [
            ['price', 'DESC']
        ]
    
    })
    .then(data => {     
        res.status(200).json(data);
    })
    .catch(err => console.error(err))
}

exports.create_post = (req, res, next) => {
    Post.create(req.body)
    .then(data => {
        if((req.body.title && typeof(req.body.title) === 'string') 
        && (req.body.description && typeof(req.body.description) === 'string')
        && (req.body.price && typeof(req.body.price) === 'number')
        && (req.body.picture && typeof(req.body.picture) === 'string')
        && (req.body.typeOfPlace && typeof(req.body.typeOfPlace) === 'string')
        && (req.body.adress && typeof(req.body.adress) === 'string')
        && (req.body.contact && typeof(req.body.contact) === 'string')
        && (req.body.isAssured && typeof(req.body.isAssured) === 'boolean')){
            res.status(201).json({
                message : 'Annonce créée',
                data : data
            })
        }
    })
    .catch(err => console.error(err))
}

exports.edit_post = (req, res, next) => {
    Post.update(req.body, {
        where : {
            id : req.params.id
        }
    })
    .then(data => {
        res.status(200).json({
            message : 'Annonce modifiée',
            data : data,
        })
    })
    .catch(err => {
        res.status(404).json(err)
    })
}

exports.delete_post = (req, res, next) => {
    Post.delete(req.body, {
        where : {
            id: req.params.id
        }
    })
    .then(() => {
        res.status(204).json({
            message : 'Annonce supprimée'
        })
    })
    .catch(err => {
        res.status(400).json(err)
    })
}

exports.details_post = (req, res, next) => {
    Post.findByPk(req.params.id)
    .then(data => {
        res.status(200).json({
            message : 'detail de l\'annonce',
            data : data
        })
    })
    .catch(err => {
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
        res.status(200).json(data);
    })
    .catch(err => console.error(err));
}

