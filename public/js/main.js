const icon = new Skycons({ color: '#222' });
const imp = document.getElementById('inp');
var current = -1;
class dsicon {
    set(element, name) {
        element.setAttribute("style", `background: url('logo/${name}.svg');background-repeat: no-repeat;`);
    }
}
const myicon = new dsicon();
imp.addEventListener('input', function (e) {
    current = -1;
    deleteall();
    let a, b, c = 0, d = this.value;
    if (!this.value) return;
    a = document.createElement('div');
    a.setAttribute('id', 'aslist');
    a.setAttribute('class', 'aslist');
    document.querySelector('.asbox').appendChild(a);
    fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ data: d })
    })
        .then(res => {
            if (res.status >= 200 && res.status < 300)
                return Promise.resolve(res.json());
            else
                return Promise.reject(new Error(res.statusText));
        })
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                b = document.createElement('div');
                b.innerHTML = `
                <svg  version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"> <g>  <g><path d="M256,0C153.755,0,70.573,83.182,70.573,185.426c0,126.888,165.939,313.167,173.004,321.035c6.636,7.391,18.222,7.378,24.846,0c7.065-7.868,173.004-194.147,173.004-321.035C441.425,83.182,358.244,0,256,0z M256,278.719 c-51.442,0-93.292-41.851-93.292-93.293S204.559,92.134,256,92.134s93.291,41.851,93.291,93.293S307.441,278.719,256,278.719z" /></g></g></svg>
                <strong>${data[i].name.slice(0, d.length)}</strong>${data[i].name.slice(d.length)}
                <span > ${data[i].country}</span>
                <input type="hidden" value="${data[i].name},${data[i].lat},${data[i].lng}">
            `
                b.addEventListener('click', function () { imp.value = this.getElementsByTagName('input')[0].value.split(',')[0]; addweather(this.getElementsByTagName('input')[0].value); });
                a.appendChild(b);
            }
            // addweather(data);
        })
        .catch(err => console.log('somthing error ' + err));
}
);
imp.addEventListener('keydown', (e) => {
    let x = document.getElementById('aslist');
    if (x) x = x.getElementsByTagName('div');
    if (e.keyCode == 40) {//down
        current++;
        focus(x);
    }
    else if (e.keyCode == 38) {//up
        current--;
        focus(x);
    }
    else if (e.keyCode == 13) {//enter
        if (current > -1) {
            x[current].click();
            addweather(x[current].getElementsByTagName('input')[0].value);
        }
    }
});
function focus(x) {
    if (!x) return;
    unfocus(x);
    if (current >= x.length) current = 0;
    else if (current < 0) current = x.length - 1;
    x[current].setAttribute('class', 'itm-active');
}
function unfocus(x) {
    if (!x) return;
    for (let i = 0; i < x.length; i++)
        if (x[i].hasAttribute('class')) x[i].removeAttribute('class');
}
function deleteall() {
    let d = document.getElementById('aslist');
    if (d != null) d.remove();
}
document.addEventListener('click', (e) => { if (e.target != document.getElementById('inp')) deleteall(); });

function addweather(data) {
    fetch('/weather', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            lat: data.split(',')[1],
            lng: data.split(',')[2]
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
function setdata(data) {
    function round(x, y) {
        return ((Math.round(x * (10 ** y))) / (10 ** y));
    }
    const date = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    document.getElementById('about').innerHTML = data.currently.summary;
    myicon.set(document.querySelector('.img'), data.currently.icon);
    //document.getElementById('location').innerHTML = document.getElementById('inp').value;
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
        for (let k = 0; k < arr.length; k++) { if (arr[k] != 'partly') d = d + " " + arr[k];}
        document.querySelectorAll('#status')[i].innerHTML = d.slice(1);
        j = (j + 1) % 7;
    }
    icon.play();
}

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
            if (data != null) {setdata(data);} 
            else window.alert('Location Not Found :(');
        })
        .catch(e => {console.log(e);});
}
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
            if (data != null) {setdata(data);} 
            else window.alert('Location Not Found :(');
        })
        .catch(e => {console.log(e);});
}
for (let i = 0; i < 5; i++) { icon.set(document.querySelectorAll('#skyconicon')[i], "clear_day"); }
onlocation();