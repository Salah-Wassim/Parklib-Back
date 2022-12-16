const parkingParticulier = require("../models/parkingParticulier");
const axios = require("axios");

const API_URL = "https://api-adresse.data.gouv.fr/search/?q=";

exports.getCoordFromStringAddress = async (parkingParticulier) => {
    street = parkingParticulier.address;
    zipCode = parkingParticulier.zipCode;
    city = parkingParticulier.city;

    q = street + "+" + zipCode + "+" + city;

    url = API_URL + q;

    axios
        .get(url)
        .then(async (result) => {
            

            let adresses = result.data.features;
            console.log(adresses);
            if (adresses == null) {
                return result;
            }

            await adresses.forEach((element) => {
                // console.log(element);
                if (element.properties.score >= 0.5) {
                    return element.geometry.coordinates;
                }
            });

            return result;
        })
        .catch((err) => {
            return err
        });


};

exports.getCoordFromStringAddressV2 = async (parkingParticulier) => {
    street = parkingParticulier.address;
    zipCode = parkingParticulier.zipCode;
    city = parkingParticulier.city;

    q = street + "+" + zipCode + "+" + city;

    url = API_URL + q;

    try {
        const result = await axios.get(url);

        const adresses = result.data.features;
        console.log(adresses);
        
        if (adresses == null) {
                        return result;
                    }
        
                    await adresses.forEach((element) => {
                        // console.log(element);
                        if (element.properties.score >= 0.5) {
                            return element.geometry.coordinates;
                        }
                    });
        
                    return result;

    } catch (error) {
          console.log(error);
    }

};
