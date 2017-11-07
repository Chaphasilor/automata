var regeln = [];

var zustand = 0;

// var keller = document.getElementById('keller');
var band = document.getElementById('band');

function neueRegel() {

    var temp = [document.getElementById('zustand').value,document.getElementById('eingabe').value,document.getElementById('top').value,document.getElementById('zustand_neu').value,document.getElementById('funktion').value,document.getElementById('push').value];

    console.log(temp);

    regeln.push(temp);

    // console.log("Regeln: " + regeln[1]);

}

document.addEventListener("keydown", function() {eingabeVerarbeiten(event);});

function eingabeVerarbeiten(event) {

    var key = String.fromCharCode(event.keyCode).toLowerCase();

    for (var i = 0; i < regeln.length; i++) {

        if (regeln[i][1] == key) {

            // console.log('almost almost nice');

            if (regeln[i][0] == zustand) {

                // console.log('almost nice');

                if (regeln[i][2] == keller.getElementsByTagName('div')[0].getElementsByTagName('div')[0].innerHTML) {

                    // console.log('nice');

                    switch (regeln[i][4]) {
                        case "push":

                            var element = document.createElement("div");
                            element.className = "element";
                            var center = document.createElement("div");
                            var text = document.createTextNode(regeln[i][5]);
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

                    zustand = regeln[i][3];

                }

            }

        }

    }

}


function save() {



}
