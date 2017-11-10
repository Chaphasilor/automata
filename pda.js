var regeln = [];

var zustand = 0;

var endzustand = 0;

var status = 0;

animationFertig = true;

deterministisch = true;


function neueRegel() {

    if (status == 0) {

        var temp = [document.getElementById('zustand').value,document.getElementById('eingabe').value,document.getElementById('top').value,document.getElementById('zustand_neu').value,document.getElementById('funktion').value,document.getElementById('push').value];

        regeln.push(temp);

        if (temp[3] > endzustand) {

            endzustand = temp[3];

        }

        document.getElementById('regeln').innerHTML += "<li>"+temp[0]+", "+temp[1]+", "+temp[2]+" --> "+temp[3]+", "+temp[4]+"("+temp[5]+")";

        for (var i = 0; i < regeln.length; i++) {

            if ( (regeln[i][0] == temp[0]) && (regeln[i][1] == temp[1]) && (regeln[i][2] == temp[2]) ) {

                deterministisch = false;

            }

        }

    }

}


document.addEventListener("keypress", function() {eingabeVerarbeiten(String.fromCharCode(event.keyCode).toLowerCase());});


function eingabeVerarbeiten(key) {

    if (deterministisch == true) {

        if (status == 1 && animationFertig == true && regeln.length>0) {

            for (var i = 0; i < document.getElementById('regeln').getElementsByTagName('li').length; i++) {
                document.getElementById('regeln').getElementsByTagName('li')[i].style.backgroundColor = "white";
            }

            add(key);

            var n = 0;
            var m = regeln.length;
            var executed = false;

            while (!executed && n<m) {

                if (regeln[n][1] == key) {

                    if (regeln[n][0] == zustand) {

                        if (regeln[n][2] == keller.getElementsByTagName('div')[0].getElementsByTagName('div')[0].innerHTML) {

                            switch (regeln[n][4]) {
                                case "push":

                                    push(n);

                                    break;
                                case "pop":

                                    pop();

                                    break;
                                case "nop":

                                    break;
                                default:
                                    alert('Ein Fehler ist aufgetreten!');

                            }

                            zustand = regeln[n][3];

                            if (zustand == endzustand) {

                                automat.getElementsByTagName('div')[0].innerHTML = "<div>"+zustand+"</div>";

                            } else {

                                automat.getElementsByTagName('div')[0].innerHTML = zustand;

                            }

                            document.getElementById('regeln').getElementsByTagName('li')[n].style.backgroundColor = "green";


                            executed = true;

                        }

                    }

                }

                n++;

            }

            if (executed == false) {

                fail();

            }

        }

    } else {

        window.alert("Dynamische Eingabe ist nur bei deterministischen Automaten möglich!");

    }

}


function push(n) {

    var element = document.createElement("div");
    element.className = "element";
    var center = document.createElement("div");
    var text = document.createTextNode(regeln[n][5]);
    center.appendChild(text);
    element.appendChild(center);

    keller.insertBefore(element, keller.getElementsByTagName('div')[0]);

}


async function pop() {

    if (animationFertig == true) {

        animationFertig = false;

        keller.getElementsByTagName('div')[0].className = "disappear";

        await sleep(1000);

        keller.getElementsByTagName('div')[0].remove();

        animationFertig = true;

    }

}


function add(key) {

    var element = document.createElement("div");
    element.className = "element";
    var center = document.createElement("div");
    var text = document.createTextNode(key);
    center.appendChild(text);
    element.appendChild(center);

    band.insertBefore(element, band.getElementsByTagName('div')[0]);

}


function fail() {

    automat.style.borderColor = "red";
    automat.style.borderWidth = "10px";
    automat.getElementsByTagName('div')[0].innerHTML = "F";

    statusWechseln(document.getElementById('status'));

    document.getElementById('status').disabled = true;

}


function finish() {

    automat.style.borderColor = "green";
    automat.style.borderWidth = "10px";

}


async function automatisch() {

    if (deterministisch == true) {

        input = document.getElementById('bandEingabe').value;

        statusWechseln(document.getElementById('status'));

        for (var i = 0; i < input.length; i++) {

            eingabeVerarbeiten(input.charAt(i).toLowerCase());

            await sleep(2000);

        }

        if ( (zustand != endzustand) || (keller.getElementsByClassName('element').length > 1) ) {

            fail();

        } else {

            finish();

        }

    } else {

        backtrack();

    }

}


function backtrack() {

    

}


function speichern() {

    localStorage.setItem('regeln', JSON.stringify(regeln));
    localStorage.setItem('endzustand', endzustand);
    localStorage.setItem('deterministisch', deterministisch);

    //console.log(localStorage.getItem('regeln'));

    alert('Erfolgreich gespeichert!');

}


function laden() {

    regeln = JSON.parse(localStorage.getItem('regeln'));
    endzustand = localStorage.getItem('endzustand');
    deterministisch = localStorage.getItem('deterministisch');

    for (var i = 0; i < regeln.length; i++) {

        document.getElementById('regeln').innerHTML += "<li>"+regeln[i][0]+", "+regeln[i][1]+", "+regeln[i][2]+" --> "+regeln[i][3]+", "+regeln[i][4]+"("+regeln[i][5]+")";

    }

    alert('Regeln wurden geladen!');

}


function reset() {

    keller.innerHTML = "<div class='element'><div>#</div></div>";
    band.innerHTML = "";
    document.getElementById('regeln').innerHTML = "";

    automat.getElementsByTagName('div')[0].innerHTML = "0";

    automat.style.borderColor = "orange";
    automat.style.borderWidth = "5px";

    document.getElementById('input').reset();

    document.getElementById('status').disabled = false;

    if (status == 1) {

        statusWechseln(document.getElementById('status'));

    }

    regeln = [];
    zustand = 0;

}


function statusWechseln(x) {

    if (regeln.length>0) {

        if (status == 1) {

            x.style.backgroundColor = "red";

        } else if (status == 0)  {

            x.style.backgroundColor = "green";

        }

        status ^= true;

    }

}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
