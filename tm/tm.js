var rules = [];
var loadSuccessful;

function load() {

  rules = [];
  loadSuccessful = true;
  var ta = document.getElementById('rules').value;
  var rule = [];
  var spot = 0;
  var line = 1;
  var preSymbol = 2;
  var stateString = "";

  ta = ta.replace(/(\r\n|\n)/gm, "~")+"~";

  for (var i = 0; i < ta.length; i++) {

    if (loadSuccessful) {

      if (ta[i] != "~") {

        switch (ta[i]) {
          case ",":
            rule[spot] = stateString;
            stateString = "";
            spot++;
            if (preSymbol == 1) {
              loadFailed(line);
            }
            preSymbol = 1;
            break;

          case ">":
            rule[spot] = stateString;
            stateString = "";
            spot++;
            if (preSymbol == 1) {
              loadFailed(line);
            }
            preSymbol = 1;
            break;

          default:
            if ( (preSymbol==0) && (spot!=0) && (spot!=2) ) {
              loadFailed(line);
              break;
            }
            if (spot == 4) {
              rule[spot] = ta[i];
            } else {
              stateString += ta[i];
            }
            preSymbol = 0;

        }

      } else {

        if (spot == 4) {

          rules.push(rule);

          console.log("Line "+line+":");
          console.log(rules[rules.length-1]);
          console.log(rules);

          spot = 0;
          preSymbol = 2;
          line++;

        } else if (spot == 0) {

          console.log("Line "+line+":");
          console.log("Line empty!");

          spot = 0;
          preSymbol = 2;
          line++;

        } else {

          loadFailed(line);

        }

      }

    }

  }

}

function loadFailed(line) {

  window.alert('There is an error in your config at line '+line+'!');

  loadSuccessful = false;

}
