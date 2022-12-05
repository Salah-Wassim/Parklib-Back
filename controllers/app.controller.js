const axios = require('axios');
const dotenv = require('dotenv')

dotenv.config();

const basicAuthentication = process.env.APPLICATION_KEY + ":" + process.env.APPLICATION_SECRET;

const headers = {
    'Authorization': 'Basic ' + Buffer.from(basicAuthentication).toString('base64'),
    'Content-Type': 'application/json; charset=utf-8'
};


exports.verifyNumber = (req, res) => {

    const phoneNumber = req.body.phone;
    console.log(req.body);

    if (!phoneNumber) {
        return res.status(400).json({ error: 'Invalid phone number' });
    }

    const payload = {
        identity: {
            type: 'number',
            endpoint: phoneNumber
        },
        method: 'sms'
    };

    axios.post(process.env.SINCH_URL, payload, { headers })
        .then(response => res.status(200).json(response.data))
        .catch(error => res.status(500).json(error));

}

exports.reportCode = (req, res) => {
    const code = req.body.code;
    const phone = req.body.phone;
    const href = req.body.report;

    if (!code && !phone) {
        return res.status(400).json({ error: 'Invalid phone' });
    }

    const payload = {
        method: 'sms',
        sms: {
            code: code
        }
    };

    const reportUrl = href? href:`${process.env.SINCH_URL}/number/${phone}`;

    axios.put(reportUrl, payload, { headers })
        .then(response =>res.status(200).json(response.data))
        .catch(error =>res.status(500).json(error));
}
