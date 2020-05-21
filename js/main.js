var imp = document.getElementById('inp');
var current = -1;
imp.addEventListener('input', function (e) {
    current = -1;
    deleteall();
    let a, b, c = 0;
    if (!this.value) return;
    a = document.createElement('div');
    a.setAttribute("id", "aslist");
    a.setAttribute('class', 'aslist');
    document.getElementsByClassName('asinputbox')[0].parentNode.appendChild(a);
    cities.forEach(val => {
        if (val.name.slice(0, this.value.length).toLocaleLowerCase() == this.value.toLocaleLowerCase() && c < 6) {
            b = document.createElement("div");
            b.innerHTML = "<strong>" + val.name.slice(0, this.value.length) + "</strong>" + val.name.slice(this.value.length) + "<input type='hidden' value='" + val.name + "'>";
            b.addEventListener("click", function (e) {
                imp.value = this.getElementsByTagName('input')[0].value;
            });
            a.appendChild(b);
            c++;
        }
        else if (c>=6)
            break;
    });
});
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
        if (current > -1) x[current].click();
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
