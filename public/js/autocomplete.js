/*
/////////////////////////////////////////////////////////////////////////////////////////////////
// This class display auto complete lists above the searchbar. It only abale to search the     //
// cities around the world. ans return its name longitude and latitude if found.               //
// author=> Soumen Khara                                                                       //
// follow=> @50UM3N                                                                            //
/////////////////////////////////////////////////////////////////////////////////////////////////
*/

class autocomplete{
    constructor(input,container){
        this.input=input;
        this.container=container;
    }
    listener(callback) {
        const container=this.container, input=this.input;
        var current = -1;
        //main event listner when user input any of charecter in the input field
        input.addEventListener('input', function () {
            let a, b, d = this.value;
            current = -1;
            deleteall();
            // checking the input field is empty or not
            if (!this.value) return;
            //creating the main div contain autocompletes items
            a = document.createElement('div');
            a.setAttribute('id', 'aslist');
            a.setAttribute('class', 'aslist');
            container.appendChild(a);
            //send the data using post methord to server and recive searched data
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
                    //adding the ietms recieved from server.
                    for (let i = 0; i < data.length; i++) {
                        b = document.createElement('div');
                        b.innerHTML = `
                        <svg  version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"> <g>  <g><path d="M256,0C153.755,0,70.573,83.182,70.573,185.426c0,126.888,165.939,313.167,173.004,321.035c6.636,7.391,18.222,7.378,24.846,0c7.065-7.868,173.004-194.147,173.004-321.035C441.425,83.182,358.244,0,256,0z M256,278.719 c-51.442,0-93.292-41.851-93.292-93.293S204.559,92.134,256,92.134s93.291,41.851,93.291,93.293S307.441,278.719,256,278.719z" /></g></g></svg>
                        <strong>${data[i].name.slice(0, d.length)}</strong>${data[i].name.slice(d.length)}
                        <span > ${data[i].country}</span>
                        <input type="hidden" value="${data[i].name},${data[i].lat},${data[i].lng}">
                    `
                        //main callback function call that return the data when user click any item list
                        b.addEventListener('click', function () { input.value = this.getElementsByTagName('input')[0].value.split(',')[0]; callback(this.getElementsByTagName('input')[0].value.split(',')); });
                        a.appendChild(b);
                    }
                })
                .catch(err => console.log('somthing error ' + err));
        });
        // when user press up down and enter key of his key board 
        input.addEventListener('keydown', (e) => {
            let x = document.getElementById('aslist');
            if (x) x = x.getElementsByTagName('div');
            if (e.keyCode == 40) {//down key press
                current++;
                focus(x);
            }
            else if (e.keyCode == 38) {//up key press
                current--;
                focus(x);
            }
            else if (e.keyCode == 13) {//enter key press
                if (current > -1) {
                    x[current].click();
                    //main callback function call that return the data when user enter the selected list
                    callback(x[current].getElementsByTagName('input')[0].value.split(','));
                }
            }
        });
        //focus the current selecter ietm 
        function focus(x) {
            if (!x) return;
            unfocus(x);
            if (current >= x.length) current = 0;
            else if (current < 0) current = x.length - 1;
            x[current].setAttribute('class', 'itm-active');
        }
        //unfocus the current selecter ietm 
        function unfocus(x) {
            if (!x) return;
            for (let i = 0; i < x.length; i++)
                if (x[i].hasAttribute('class')) x[i].removeAttribute('class');
        }
        //delete the list of autocomplete
        function deleteall() {
            let d = document.getElementById('aslist');
            if (d != null) d.remove();
        }
        document.addEventListener('click', (e) => { if (e.target != input) deleteall(); });
    }
}