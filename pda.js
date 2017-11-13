var regeln = [];

var entscheidungen = [];
var backtrackKeller = ['#'];
var regelFolge = [];

var zustand = 0;
var status = 0;
var btResult = false;

var animationFertig = true;
var deterministisch = true;
var fertig = true;

var q = [];
var eingabeAlphabet = [];
var kellerAlphabet = [];
var startZustand = 0;
var anfangsSymbol = "#";
var endzustand = 0;


function neueRegel() {

    if (status == 0) {

        var temp = [document.getElementById('zustand').value,document.getElementById('eingabe').value,document.getElementById('top').value,document.getElementById('zustand_neu').value,document.getElementById('funktion').value,document.getElementById('push').value];

        for (var i = 0; i < regeln.length; i++) {

            if ( (regeln[i][0] == temp[0]) && (regeln[i][1] == temp[1]) && (regeln[i][2] == temp[2]) ) {

                deterministisch = false;

            }

        }

        regeln.push(temp);

        if (temp[3] > endzustand) {

            endzustand = temp[3];

        }

        if (q.indexOf(temp[0]) == -1) {

            q.push(temp[0]);

        }

        if (q.indexOf(temp[3]) == -1) {

            q.push(temp[3]);

        }

        if (eingabeAlphabet.indexOf(temp[1]) == -1) {

            eingabeAlphabet.push(temp[1]);

        }

        if (kellerAlphabet.indexOf(temp[2]) == -1) {

            kellerAlphabet.push(temp[2]);

        }

        if (kellerAlphabet.indexOf(temp[5]) == -1) {

            kellerAlphabet.push(temp[5]);

        }

        definitionAktualisieren();

        document.getElementById('regeln').innerHTML += "<li>"+temp[0]+", "+temp[1]+", "+temp[2]+" --> "+temp[3]+", "+temp[4]+"("+temp[5]+")";

    }

}


document.addEventListener("keypress", function() {eingabeVerarbeiten(String.fromCharCode(event.keyCode).toLowerCase());});


function eingabeVerarbeiten(key) {

        if (status == 1 && animationFertig == true && regeln.length>0) {

            if (deterministisch == true) {

                for (var i = 0; i < document.getElementById('regeln').getElementsByTagName('li').length; i++) {
                    document.getElementById('regeln').getElementsByTagName('li')[i].style.backgroundColor = "rgb(11, 11, 11)";
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

        else {

            window.alert("Dynamische Eingabe ist nur bei deterministischen Automaten möglich!");

        }

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


function definitionAktualisieren() {

    definition.innerHTML = "";

    definition.innerHTML = "<h3>A = (Q,Σ,Γ,q<sub>0</sub>,#,E)</h3>";

    definition.innerHTML += "<ul>"
    definition.innerHTML += "<li>Q = {"+q+"}</li>";
    definition.innerHTML += "<li>Σ = {"+eingabeAlphabet+"}";
    definition.innerHTML += "<li>Γ = {"+kellerAlphabet+"}";
    definition.innerHTML += "<li>q<sub>0</sub> = {"+startZustand+"}";
    definition.innerHTML += "<li># = {"+anfangsSymbol+"}";
    definition.innerHTML += "<li>E = {"+endzustand+"}";
    definition.innerHTML += "</ul>"

}


function fail() {

    automat.style.borderColor = "red";
    automat.style.borderWidth = "10px";
    automat.getElementsByTagName('div')[0].innerHTML = "F";

    statusWechseln(document.getElementById('status'));

    document.getElementById('status').disabled = true;

    console.log('FAILED');

    fertig = true;

}


function finish() {

    automat.style.borderColor = "green";
    automat.style.borderWidth = "10px";

    fertig = true;

}


async function automatisch() {

    fertig = false;

    input = document.getElementById('bandEingabe').value;

    statusWechseln(document.getElementById('status'));

    if (deterministisch == true) {

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

        nichtDeterministisch(input, 0);

    }

}


async function nichtDeterministisch(input, zeichen) {

    backtrack(input, zeichen);

    if (btResult == true) {

        console.log(regelFolge);

        for (var i = 0; i < regelFolge.length; i++) {

            for (var n = 0; n < document.getElementById('regeln').getElementsByTagName('li').length; n++) {
                document.getElementById('regeln').getElementsByTagName('li')[n].style.backgroundColor = "rgb(11,11,11)";
            }

            add(regeln[regelFolge[i]][1]);

            switch (regeln[regelFolge[i]][4]) {
                case "push":

                    push(regelFolge[i]);

                    break;
                case "pop":

                    pop();

                    break;
                case "nop":

                    break;
                default:
                    alert('Ein Fehler ist aufgetreten!');

            }

            zustand = regeln[regelFolge[i]][3];

            if (zustand == endzustand) {

                automat.getElementsByTagName('div')[0].innerHTML = "<div>"+zustand+"</div>";

            } else {

                automat.getElementsByTagName('div')[0].innerHTML = zustand;

            }

            document.getElementById('regeln').getElementsByTagName('li')[regelFolge[i]].style.backgroundColor = "green";

            await sleep(2000);

        }

        finish();

    } else {

        fail();

    }

}


function backtrack(input, zeichen) {

    if ( (input.length == zeichen) && (zustand == endzustand) && (backtrackKeller[0] == '#')) {

         btResult = true;

         statusWechseln(document.getElementById('status'));

    } else {

        // await sleep(1000);
        console.log('Looking for rules matching '+zustand+', '+input.charAt(zeichen)+', '+backtrackKeller+'...');
        // await sleep(2000);

        var matches = 0;
        var tempEntscheidungen = [];

        for (var i = 0; i < regeln.length; i++) {

            if (regeln[i][0] == zustand) {

                if (regeln[i][1] == input.charAt(zeichen)) {

                    if (regeln[i][2] == backtrackKeller[0]) {

                        matches++;

                        tempEntscheidungen.push(i);

                    }

                }

            }

        }

        if ( (matches == 0) || (zeichen >= input.length) ) {

            console.log('Backtracking...');
            // await sleep(5000);

            if (entscheidungen.length > 0) {

                console.log(entscheidungen[entscheidungen.length-1]);
                entscheidungen[entscheidungen.length-1][4]++;
                regelFolge.splice(regelFolge.length-1,1);

                while (entscheidungen[entscheidungen.length-1][3].length <= (entscheidungen[entscheidungen.length-1][4]) ) {

                    if (entscheidungen.length > 1) {

                        console.log('Going back to previous decision');

                        entscheidungen.splice(entscheidungen.length-1,1);
                        entscheidungen[entscheidungen.length-1][4]++;

                        regelFolge.splice(regelFolge.length-1,1);

                    } else {

                        entscheidungen[entscheidungen.length-1][4] = 0;
                        status = 0;

                    }

                }

                if (status == 1) {

                    console.log('Derzeitiger Backtrackkeller: '+backtrackKeller);

                    var regel = entscheidungen[entscheidungen.length-1][3][entscheidungen[entscheidungen.length-1][4]];

                    zustand = entscheidungen[entscheidungen.length-1][0];

                    zeichen = entscheidungen[entscheidungen.length-1][1];

                    // backtrackKeller = entscheidungen[entscheidungen.length-1][2];
                    backtrackKeller = JSON.parse(localStorage.getItem('bt'+(entscheidungen.length-1)+'K'));
                    console.log('Neuer Backtrackkeller: '+backtrackKeller);


                    regelAnwenden(regel);
                    zeichen++;


                    backtrack(input, zeichen);

                } else {

                    btResult = false;

                }

            } else {

                btResult = false;

            }


        } else {

            if (matches > 1) {

                console.log('Multiple rules found!');
                // await sleep(5000);

                if ( (entscheidungen.length > 0) && ( (entscheidungen[entscheidungen.length-1][0]==zustand) && (entscheidungen[entscheidungen.length-1][1]==zeichen) && (entscheidungen[entscheidungen.length-1][2]==backtrackKeller) && (entscheidungen[entscheidungen.length-1][3]==tempEntscheidungen) ) ) {

                    var regel = entscheidungen[entscheidungen.length-1][3][entscheidungen[entscheidungen.length-1][4]];

                } else {

                    tempArray = [zustand,zeichen,backtrackKeller,tempEntscheidungen,0];

                    entscheidungen.push(tempArray);

                    localStorage.setItem('bt'+(entscheidungen.length-1)+'K', JSON.stringify(backtrackKeller));

                    var regel = tempEntscheidungen[0];

                }



            } else {

                console.log('One rule found!');
                // await sleep(5000);

                var regel = tempEntscheidungen[0];

            }


            console.log('Derzeitiges Zeichen: '+zeichen);
            regelAnwenden(regel);
            zeichen++;


            backtrack(input, zeichen);

        }

    }

}


function regelAnwenden(regel) {

    zustand = regeln[regel][3];

    switch (regeln[regel][4]) {
        case "push":

            backtrackKeller.unshift(regeln[regel][5]);

            break;
        case "pop":

            console.log(backtrackKeller[0]);
            backtrackKeller.splice(0,1);

            break;
        case "nop":

            break;
        default:
            alert('Ein Fehler ist aufgetreten!');

    }

    regelFolge.push(regel);
    console.log(regelFolge);
    console.log('Regel '+(regel+1)+' angewendet!');

    // await sleep(1000);

}


function speichern() {

  if (regeln.length > 0) {

    var tempDef = [q,eingabeAlphabet,kellerAlphabet,startZustand,anfangsSymbol,endzustand];

    localStorage.setItem('regeln', JSON.stringify(regeln));
    localStorage.setItem('definition', JSON.stringify(tempDef));
    localStorage.setItem('deterministisch', deterministisch);

    alert('Erfolgreich gespeichert!');

  } else {

    alert('Es gibt noch keine Regeln!');

  }

}


function laden() {

    regeln = JSON.parse(localStorage.getItem('regeln'));
    deterministisch = localStorage.getItem('deterministisch');
    var tempDef = JSON.parse(localStorage.getItem('definition'));

    q = tempDef[0];
    eingabeAlphabet = tempDef[1];
    kellerAlphabet = tempDef[2];
    startZustand = tempDef[3];
    anfangsSymbol = tempDef[4];
    endzustand = tempDef[5];

    for (var i = 0; i < regeln.length; i++) {

        document.getElementById('regeln').innerHTML += "<li>"+regeln[i][0]+", "+regeln[i][1]+", "+regeln[i][2]+" --> "+regeln[i][3]+", "+regeln[i][4]+"("+regeln[i][5]+")";

    }

    definitionAktualisieren();

}


function reset() {

    if (fertig == true) {

        keller.innerHTML = "<div class='element'><div>#</div></div>";
        band.innerHTML = "";
        document.getElementById('regeln').innerHTML = "";

        automat.getElementsByTagName('div')[0].innerHTML = "0";

        automat.style.borderColor = "orange";
        automat.style.borderWidth = "5px";

        document.getElementById('input').reset();
        document.getElementById('bandEingabe').value = "";

        document.getElementById('status').disabled = false;

        if (status == 1) {

            statusWechseln(document.getElementById('status'));

        }

        regeln = [];
        entscheidungen = [];
        backtrackKeller = ['#'];
        regelFolge = [];
        zustand = 0;
        endzustand = 0;
        btResult = false;
        animationFertig = true;
        deterministisch = true;

    } else {

        alert('Der Automat läuft noch!');

    }

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


function pushElement(x) {

    push = document.getElementById('push');

    if (x.value != 'push') {

        push.disabled = true;
        push.value = '';

    } else {

        push.disabled = false;

    }

}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
