const icon = new Skycons({ color: '#222' });
const myicon = new dsimage();
const as = new autocomplete(document.getElementById('inp'), document.querySelector('.asbox'));
var flag=false;
as.listener(addweather);

// get the weather data from server
function addweather(data) {
    fetch('/weather', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            lat: data[1],
            lng: data[2]
        })
    })
        .then(res => {
            if (res.status >= 200 && res.status < 300)
                return Promise.resolve(res.json());
            else
                return Promise.reject(new Error(res.statusText));
        })
        .then(data => {
            setdata(data);
        })
}

// set ehr weather data to the client page
function setdata(data) {
    function round(x, y) {return ((Math.round(x * (10 ** y))) / (10 ** y));}
    const date = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    document.getElementById('about').innerHTML = data.currently.summary;
    myicon.set(document.querySelector('.img'), data.currently.icon);
    document.getElementById('location').innerHTML = data.timezone;
    document.getElementById('temperature').innerHTML = data.currently.temperature + "˚";
    document.getElementById('humidity').innerHTML = data.currently.humidity + "%";
    document.getElementById('wind').innerHTML = data.currently.windSpeed + "mph";
    document.getElementById('uvindex').innerHTML = data.currently.uvIndex;
    for (let i = 0, j = new Date().getDay() + 1; i < 5; i++) {
        let arr = [];
        let d = '';
        document.querySelectorAll('#day')[i].innerHTML = date[j];
        icon.set(document.querySelectorAll('#skyconicon')[i], data.daily.data[i].icon);
        document.querySelectorAll('#dailytemp')[i].innerHTML = round((data.daily.data[i].temperatureHigh + data.daily.data[i].temperatureLow) / 2, 1) + "˚";
        arr = data.daily.data[i].icon.split('-');
        for (let k = 0; k < arr.length; k++) { if (arr[k] != 'partly') d = d + " " + arr[k]; }
        document.querySelectorAll('#status')[i].innerHTML = d.slice(1);
        j = (j + 1) % 7;
    }
    icon.play();
}

//when user search somthing
function onsear(a) {
    fetch('/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ data: a })
    })
        .then(res => {
            return Promise.resolve(res.json());
        })
        .then(data => {
            if (data != null) { setdata(data); }
            else window.alert('Location Not Found :(');
        })
        .catch(e => { console.log(e); });
}

//user current location
function onlocation() {
    fetch('/current', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then(res => {
            return Promise.resolve(res.json());
        })
        .then(data => {
            if (data != null) { setdata(data); }
            else window.alert('Location Not Found :(');
        })
        .catch(e => { console.log(e); });
}

//initial icon set
for (let i = 0; i < 5; i++) { icon.set(document.querySelectorAll('#skyconicon')[i], "clear_day"); }
myicon.set(document.querySelector('.img'), "clear-day");
onlocation();