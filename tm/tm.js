var rules = [];
var loadSuccessful;

function load() {

  rules = [];
  loadSuccessful = true;
  var ta = formatInput(document.getElementById('rules').value);
  var rule = [];
  var spot = 0;
  var line = 1;
  var preSymbol = 2;
  var stateString = "";

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

              if ( (ta[i]=="L") || (ta[i]=="R") || (ta[i]=="N") ) {
                rule[spot] = ta[i];
              } else {
                loadFailed(line);
                break;
              }

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

        } else if ( (spot == 0) && (stateString=="") ) {

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

function formatInput(input) {

  input = input.replace(/(\r\n|\n)/gm, "~")+"~";
  input = input.replace(/ /gm,'');

  for (var i = 0; i < input.length; i++) {

    if (input[i] == "/" && input[i+1] == "/") {

      var startPos = i;
      var endPos;

      while (input[i] != "~") {

        endPos = i;
        i++;

      }

      input = spliceString(input, startPos, endPos-startPos);

    }

  }

  console.log(input);

  return input;

}

function spliceString(str, index, count) {

  return str.slice(0, index) + str.slice(index + count+1);

}

function loadFailed(line) {

  window.alert('There is an error in your config at line '+line+'!');

  loadSuccessful = false;

}
