//server file 
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
app.post('/current', (req, res) => {
    fetch('http://ifconfig.co/json')
        .then(res => {
            return res.json();
        })
        .then(data => {
            getweather({ body: { lat: data.latitude, lng: data.longitude } }, res);
        })
        .catch(err => {
            console.log(err);
        })
});
app.post('/search', (req, res) => {
    let flag = true;
    for (let i = 0; i < d.cities.length; i++) {
        if (req.body.data.toLocaleLowerCase() == d.cities[i].name.toLocaleLowerCase()) {
            getweather({ body: { lat: d.cities[i].lat, lng: d.cities[i].lng } }, res)
            flag = false;
            break;
        }
    }
    if (flag) res.json(null);
})
app.post('/weather', (req, res) => {getweather(req, res);});

function getweather(req, res) {
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
        });
}
