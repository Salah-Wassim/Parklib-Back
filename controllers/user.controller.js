const User = require("../models").User;

exports.findAll = (req, res) => {
    User.findAll()
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
            res.send(user);
        })
        .catch(err => {
            res.status(500).send({error:err.message,message: "Error retrieving User with id=" + id});
        });
}
