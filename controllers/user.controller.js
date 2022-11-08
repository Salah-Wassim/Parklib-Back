const User = require("../models").User;
const bcrypt = require('bcrypt');
const constante = require('../utils/constantes.util.js');

exports.findAll = (req, res) => {
    User.findAll({where: {isActivated: true}, order: [['createdAt', 'DESC']]})
        .then(data => {
            const users = data.map(user => {
                const {password, ...userWithoutPassword} = user.dataValues;
                return userWithoutPassword;
            })
            res.send(users);
        })
        .catch(err => {
            res.status(500).send({message: err.message || "Some error occurred while retrieving users."});
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    if (id==null) {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }

    User.findByPk(id)
        .then(data => {
            const {password, ...user} = data.dataValues;
            if (!user.isActivated) {
                res.status(200).send({message: "Account was deleted!"});
                return;
            }
            res.status(200).send(user);
        })
        .catch(err => {
            res.status(500).send({error:err.message,message: "Error retrieving User with id=" + id});
        });
}

exports.update = (req, res) => {
    const id = req.params.id;

    const firstName = req.body.firstName??null;
    const lastName = req.body.lastName??null;
    const picture = req.file.filename??null;
    const phone = req.body.phone??null;
    const address = req.body.address??null;

    let user = {};

    if(firstName) user.firstName = firstName;
    if(lastName) user.lastName = lastName;
    if(picture) user.picture = 'profile_picture/'+picture;
    if(phone) user.phone = phone;
    if(address) user.address = address;

    if (id==null || Object.keys(user).length===0) {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }

    User.update(user, {where: {id: id}})
        .then(response => {
            if (response[0] === 0) {
                res.status(200).send({message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`});
                return;
            }
            User.findByPk(id).then(data=>{
                const {password, ...user} = data.dataValues;
                res.status(200).send(user);
            })
        })
        .catch(err => {
            res.status(500).send({error:err.message,message: "Error updating User with id=" + id});
        });
}

exports.updatePassword = (req, res) => {
    const id = req.params.id;

    const oldPassword = req.body.oldPassword??null;
    const newPassword = req.body.newPassword??null;

    if (id==null || oldPassword==null || newPassword==null) {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }

    User.findByPk(id)
        .then(data => {
            bcrypt.compare(oldPassword, data.password, (err, result)=> {
                if (!result){
                    res.status(200).send({message: "Old password is incorrect!"});
                    return;
                }

                bcrypt.hash(newPassword, constante.SALT_HASH_KEY, (err, hash)=> {
                    if (err) {
                        res.status(500).send({error:err.message,message: "Error updating User with id=" + id});
                        return;
                    }

                    if (newPassword === oldPassword) {
                        res.status(200).send({message: "New password must be different from old password!"});
                        return;
                    }

                    User.update({password: hash}, {where: {id: id}})
                        .then(response => {
                            if (response[0] === 0) {
                                res.status(200).send({message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`});
                                return;
                            }
                            User.findByPk(id).then(data=>{
                                const {password, ...user} = data.dataValues;
                                res.status(200).send(user);
                            })
                        })
                        .catch(err => {
                            res.status(500).send({error:err.message,message: "Error updating User with id=" + id});
                        });

                });
            });
        })
        .catch(err => {
            res.status(500).send({error:err.message,message: "Error retrieving User with id=" + id});
        });

}

exports.delete = (req, res) => {
    const id = req.params.id
    const user={
        firstName: "Deleted-RGPD",
        lastName: "Deleted-RGPD",
        picture: "profile_picture/default.png",
        phone: "0000000000",
        email: "Deleted-RGPD",
        address: "Deleted-RGPD",
        password: "Deleted-RGPD",
        isActivated: false
    }
    User.update(user, {where: {id: id}}).then(response => {
        if (response[0] === 0) {
            res.status(200).send({message: `Cannot delete User with id=${id}. Maybe User was not found!`});
            return;
        }
        res.status(200).send({message: "User was deleted successfully!"});
    })
}
