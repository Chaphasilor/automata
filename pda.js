var regeln = [];

var zustand = 0;

var status = 0;

function neueRegel() {

    if (status == 0) {

        var temp = [document.getElementById('zustand').value,document.getElementById('eingabe').value,document.getElementById('top').value,document.getElementById('zustand_neu').value,document.getElementById('funktion').value,document.getElementById('push').value];

        console.log(temp);

        regeln.push(temp);

        // console.log("Regeln: " + regeln[1]);

        document.getElementById('regeln').innerHTML += "<li>"+temp[0]+", "+temp[1]+", "+temp[2]+" --> "+temp[3]+", "+temp[4]+"("+temp[5]+")";

    }

}

document.addEventListener("keypress", function() {eingabeVerarbeiten(event);});

function eingabeVerarbeiten(event) {

    if (status == 1) {

        var key = String.fromCharCode(event.keyCode).toLowerCase();

        var n = 0;
        var m = regeln.length;
        var executed = false;

        while (!executed && n<m) {

            if (regeln[n][1] == key) {

                // console.log('almost almost nice');

                if (regeln[n][0] == zustand) {

                    // console.log('almost nice');

                    if (regeln[n][2] == keller.getElementsByTagName('div')[0].getElementsByTagName('div')[0].innerHTML) {

                        // console.log('nice');

                        switch (regeln[n][4]) {
                            case "push":

                                var element = document.createElement("div");
                                element.className = "element";
                                var center = document.createElement("div");
                                var text = document.createTextNode(regeln[n][5]);
                                center.appendChild(text);
                                element.appendChild(center);

                                keller.insertBefore(element, keller.getElementsByTagName('div')[0]);

                                break;
                            case "pop":

                                keller.getElementsByTagName('div')[0].remove();

                                break;
                            case "nop":

                                break;
                            default:
                                alert('Ein Fehler ist aufgetreten!');

                        }

                        zustand = regeln[n][3];

                        executed = true;

                    }

                }

            }

            n++;

        }

    }

}


function speichern() {

    localStorage.setItem('regeln', JSON.stringify(regeln));

    console.log(localStorage.getItem('regeln'));

    alert('Erfolgreich gespeichert!');

}

function laden() {

    regeln = JSON.parse(localStorage.getItem('regeln'));

    for (var i = 0; i < regeln.length; i++) {

        document.getElementById('regeln').innerHTML += "<li>"+regeln[i][0]+", "+regeln[i][1]+", "+regeln[i][2]+" --> "+regeln[i][3]+", "+regeln[i][4]+"("+regeln[i][5]+")";

    }

    alert('Regeln wurden geladen!');

}

function statusWechseln(x) {

    if (status == 1) {

        x.style.backgroundColor = "red";

    } else if (status == 0)  {

        x.style.backgroundColor = "green";

    }

    status ^= true

    console.log(status);

}
