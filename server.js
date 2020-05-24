const express = require('express');
const fetch = require('node-fetch');
const app = express();
const d = require('./cities');
require('dotenv').config();
const DARKSKY_API = process.env.DARKSKY_API;
app.use(express.static('public'));
const port = process.env.PORT || 8080;
app.listen(port, (e) => {
    console.log('server started ' + port);
});
app.use(express.json());
app.post('/', (req, res) => {
    let a = [], c = 0, e = req.body.data;
    for (let i = 0; i < d.cities.length; i++) {
        if (d.cities[i].name.slice(0, e.length).toLocaleLowerCase() == e.toLocaleLowerCase() && c < 6) {
            a[c] = d.cities[i];
            c++;
        }
        else if (c >= 5) break;
    }
    res.json(a);
});
app.post('/weather', (req, res) => {
    const url = `https://api.darksky.net/forecast/${DARKSKY_API}/${req.body.lat},${req.body.lng}`;
    fetch(url)
        .then(response => {
            if (response.status >= 200 && response.status < 300)
                return Promise.resolve(response.json());
            else
                return Promise.reject(new Error(response.statusText));
        })
        .then(data => {
            res.json(data);
        })
});
