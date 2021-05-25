require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const PORT = 5000;

const app = express();
app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const corsOptions = {
    origin: "http://localhost:3000"
};

const multipleRecordsEndpoint = "https://{subdomain}.kintone.com/k/v1/records.json";
const singleRecordEndpoint = "https://{subdomain}.kintone.com/k/v1/record.json";

app.get('/getData', cors(corsOptions), async (req, res) => {
    const fetchOptions = {
        method: 'GET',
        headers: {
            'X-Cybozu-API-Token': process.env.API_TOKEN
        }
    }
    const parameters = "?app=1&query=order by recordID asc";
    const response = await fetch(multipleRecordsEndpoint + parameters, fetchOptions);
    const jsonResponse = await response.json();
    res.json(jsonResponse);
});

app.post('/postData', cors(corsOptions), async (req, res) => {
    const requestbody = {
        "app": 1,
        "record": {
            "title": {
                "value": req.body.title
            },
            "author": {
                "value": req.body.author
            }
        }
    };
    const options = {
        method: 'POST',
        headers: {
            'X-Cybozu-API-Token': process.env.API_TOKEN,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestbody)
    }
    const response = await fetch(singleRecordEndpoint, options);
    const jsonResponse = await response.json();
    res.json(jsonResponse);
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});
