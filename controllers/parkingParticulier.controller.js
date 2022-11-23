const ParkingParticulier = require("../models").ParkingParticulier;
const constante = require("../utils/constantes.util.js");
const logger = require("../utils/logger.util.js");
const HttpStatus = require("../utils/httpStatus.util.js");
const Response = require("../utils/response.util.js");
const { Op } = require("sequelize");

exports.findAllParkingParticulier = (req, res) => {
    const isActivated = req.query.isActivated ?? true;
    logger.info(
        `${req.method} ${req.originalUrl}, Fetching ALL parkings particuliers.`
    );
    ParkingParticulier.findAll({
        where: { isActivated: isActivated },
        order: [["createdAt", "DESC"]],
    })
        .then((data) => {
            const parkingParticulierAllList = data.map((parking) => {
                return parking;
            });
            res.status(HttpStatus.OK.code).send(
                new Response(
                    HttpStatus.OK.code,
                    HttpStatus.OK.message,
                    `ParkingParticuliers retrieved`,
                    parkingParticulierAllList
                )
            );
        })
        .catch((err) => {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(
                new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.code,
                    HttpStatus.INTERNAL_SERVER_ERROR.message,
                    `Some error occurred while retrieving parkings`
                )
            );
        });
};

exports.findOneParkingParticulier = (req, res) => {
    const id = req.params.id;
    if (id == null) {
        res.status(HttpStatus.NO_CONTENT.code).send(
            new Response(
                HttpStatus.NO_CONTENT.code,
                HttpStatus.NO_CONTENT.message,
                `Id can not be empty!`
            )
        );
        return;
    }
    logger.info(`${req.method} ${req.originalUrl}, Fetching parking #${id}.`);
    ParkingParticulier.findByPk(id)
        .then((data) => {
            res.status(HttpStatus.OK.code).send(
                new Response(
                    HttpStatus.OK.code,
                    HttpStatus.OK.message,
                    `Parking retrieved !`,
                    data
                )
            );
        })
        .catch((err) => {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(
                new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.code,
                    HttpStatus.INTERNAL_SERVER_ERROR.message,
                    `Error retrieving parking with id = ${id} `
                )
            );
        });
};

exports.addParkingParticulier = (req, res) => {
    if (
        req.body.name == null ||
        req.body.address == null ||
        req.body.zipCode == null ||
        req.body.city == null ||
        req.body.picture == null ||
        req.body.nbPlace == null ||
        req.body.assurance == null ||
        req.body.type == null ||
        req.body.description == null ||
        req.body.price == null ||
        req.body.isActivated == null ||
        req.body.UserId == null
    ) {
        res.status(HttpStatus.NO_CONTENT.code).send(
            new Response(
                HttpStatus.NO_CONTENT.code,
                HttpStatus.NO_CONTENT.message,
                `Content can not be empty!`
            )
        );
        return;
    }
    const parking = { ...req.body };

    logger.info(
        `${req.method} ${req.originalUrl}, Creating new parking particulier.`
    );

    ParkingParticulier.create(parking)
        .then((data) => {
            res.status(HttpStatus.CREATED.code).send(
                new Response(
                    HttpStatus.CREATED.code,
                    HttpStatus.CREATED.message,
                    `Parking Particulier created`
                )
            );
        })
        .catch((error) => {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(
                new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.code,
                    HttpStatus.INTERNAL_SERVER_ERROR.message,
                    `Some error occurred while creating the parking.`
                )
            );
        });
};

exports.updateParkingParticulier = (req, res) => {
    const id = req.params.id;

    const name = req.body.name;
    const address = req.body.address;
    const zipCode = req.body.zipCode;
    const city = req.body.city;
    const picture = req.body.picture;
    const nbPlace = req.body.nbPlace;
    const assurance = req.body.assurance;
    const type = req.body.type;
    const description = req.body.description;
    const price = req.body.price;
    const isActivated = req.body.isActivated;
    const UserId = req.body.UserId;

    let parking = {};

    if (name) parking.name = name;
    if (address) parking.address = address;
    if (zipCode) parking.zipCode = zipCode;
    if (city) parking.city = city;
    if (picture) parking.picture = picture;
    if (nbPlace) parking.nbPlace = nbPlace;
    if (assurance) parking.assurance = assurance;
    if (type) parking.type = type;
    if (description) parking.description = description;
    if (price) parking.price = price;
    if (isActivated) parking.isActivated = isActivated;
    if (UserId) parking.UserId = UserId;

    if (id == null || Object.keys(parking).length === 0) {
        res.status(HttpStatus.NO_CONTENT.code).send(
            new Response(
                HttpStatus.NO_CONTENT.code,
                HttpStatus.NO_CONTENT.message,
                `Content can not be empty!`
            )
        );
        return;
    }

    logger.info(`${req.method} ${req.originalUrl}, Updating parking.`);

    ParkingParticulier.update(parking, { where: { id: id } })
        .then((response) => {
            if (response[0] === 0) {
                res.status(HttpStatus.OK.code).send(
                    new Response(
                        HttpStatus.OK.code,
                        HttpStatus.OK.message,
                        `Cannot update account with id=${id}. Maybe parking was not found!`
                    )
                );
                return;
            }
            ParkingParticulier.findByPk(id).then((data) => {
                res.status(HttpStatus.OK.code).send(
                    new Response(
                        HttpStatus.OK.code,
                        HttpStatus.OK.message,
                        `Parking updated`,
                        data
                    )
                );
            });
        })
        .catch((error) => {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(
                new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.code,
                    HttpStatus.INTERNAL_SERVER_ERROR.message,
                    `Error updating Parking with id = ${id}.`
                )
            );
        });
};

exports.deleteParkingParticulier = (req, res) => {
    const id = req.params.id;
    const parking = {
        name: "Deleted-RGPD",
        address: "Deleted-RGPD",
        zipCode: "Deleted-RGPD",
        city: "Deleted-RGPD",
        lattitude: 0.0,
        longitude: 0.0,
        picture: "Deleted-RGPD",
        nbPlace: 0,
        assurance: false,
        type: "Deleted-RGPD",
        description: "Deleted-RGPD",
        price: 0.0,
        isActivated: false,
    };

    logger.info(`${req.method} ${req.originalUrl}, Deleting parking.`);
    ParkingParticulier.update(parking, { where: { id: id } })
        .then((response) => {
            if (response[0] === 0) {
                res.status(HttpStatus.NO_CONTENT.code).send(
                    new Response(
                        HttpStatus.NO_CONTENT.code,
                        HttpStatus.NO_CONTENT.message,
                        `Cannot delete Parking with id=${id}. Maybe Parking was not found!`
                    )
                );
                return;
            }
            res.status(HttpStatus.OK.code).send(
                new Response(
                    HttpStatus.OK.code,
                    HttpStatus.OK.message,
                    `Parking deleted successfully!`
                )
            );
        })
        .catch((error) => {
            if (error.name === "SequelizeUniqueConstraintError") {
                res.status(HttpStatus.FORBIDDEN.code).send(
                    new Response(
                        HttpStatus.FORBIDDEN.code,
                        HttpStatus.FORBIDDEN.message,
                        `Parking already deleted`
                    )
                );
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(
                    new Response(
                        HttpStatus.INTERNAL_SERVER_ERROR.code,
                        HttpStatus.INTERNAL_SERVER_ERROR.message,
                        `Some error occurred while deletnig the Parking.`
                    )
                );
            }
        });
};
