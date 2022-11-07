const User = require("../models").User;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_HASH_KEY = 11;

exports.register = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    bcrypt.hash(req.body.password, SALT_HASH_KEY).then(hash => {
        // Create a User
        const user = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
            picture: req.body.picture,
            address: req.body.address,
            email: req.body.email,
            password: hash
        };

        // Save User in the database
        User.create(user)
            .then(data => {
                const accessToken = jwt.sign({
                    id: data.id,
                    name: data.lastName+" "+data.firstName,
                    email: data.email
                }, process.env.SECRET, { expiresIn:process.env.EXPIRES_IN});

                res.status(200).json({accessToken});
            })
            .catch(err => {
                res.status(500).send({message: err.message || "Some error occurred while creating the User."});
            });
    });
}

exports.login = (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }

    User.findOne({where: {email: req.body.email}})
        .then(user => {
            if (user===null) {
                res.status(404).send({message: "email or password incorrect"});
                return;
            }

            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (result) {
                    const accessToken = jwt.sign({
                        id: user.id,
                        name: user.lastName+" "+user.firstName,
                        email: user.email
                    }, process.env.SECRET, { expiresIn:process.env.EXPIRES_IN});

                    res.status(200).json({accessToken});
                }
                else {
                    res.send({message: "email or password incorrect"});
                }
            })

        })
        .catch(err => {
            res.status(500).send({message: err.message || "Some error occurred while retrieving the User."});
        });
}
