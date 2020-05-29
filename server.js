const express = require('express');
const fetch = require('node-fetch');
const app = express();
const d = require('./cities');
require('dotenv').config();
const DARKSKY_API = process.env.DARKSKY_API;
const port = process.env.PORT || 8080;
app.use(express.static('public'));
app.use(express.json());

//gearching data from cities and send back to the client
app.post('/', (req, res) => {res.json(search(req));});

//prototype current location 
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

// when user presssed serch button
app.post('/search', (req, res) => {
    let flag = true;
    for (let i = 0; i < d.cities.length; i++) {
        if (req.body.data.toLocaleLowerCase() == d.cities[i].name.toLocaleLowerCase()) {
            getweather({ body: { lat: d.cities[i].lat, lng: d.cities[i].lng } }, res);
            flag = false;
            break;
        }
    }
    if (flag) res.json(null);
});
// this post method  for when user chick the location this this post method tiggered
app.post('/weather', (req, res) => {getweather(req, res);});

// this function get the weather from darksky and send back the data to the clint , it has two parameter request and response 
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

//searching algorithm
function search(req){
    let array = [], counter = 0, item = req.body.data;
    for (let i = 0; i < d.cities.length; i++) {
        if (d.cities[i].name.slice(0, item.length).toLocaleLowerCase() == item.toLocaleLowerCase() && counter < 6) {
            array[counter] = d.cities[i];
            counter++;
        }
        else if (counter >= 5) break;
    }
    return array;
}

//starting the server
app.listen(port, (e) => {
    console.log('server started ' + port);
});