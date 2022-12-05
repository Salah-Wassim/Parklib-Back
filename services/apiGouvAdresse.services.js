const parkingParticulier = require("../models/parkingParticulier");
const axios = require("axios");

const API_URL = "https://api-adresse.data.gouv.fr/search/?q=";


exports.getCoordFromStringAddress = (req , res , parkingParticulier) => {

    street = parkingParticulier.address;
    zipCode = parkingParticulier.zipCode;
    city = parkingParticulier.city;

    q = street + "+" + zipCode + "+" + city;

    url = API_URL + q ;

    axios.get(url).then((result) => {
        res.status(200).json(result)
    }).catch((err) => {
        res.status(500).json(error);
    });


}