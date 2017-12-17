var rules = [];
var tape = "##########";
var loadSuccessful;
var tapePos = 5;
var state = -1;
var endstate = 20;

function loadRules() {

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
          console.log(rule);
          console.log(rules);

          spot = 0;
          preSymbol = 2;
          line++;
          rule = [];

        } else if ( (spot == 0) && (stateString=="") ) {

          console.log("Line "+line+":");
          console.log("Line empty!");

          spot = 0;
          preSymbol = 2;
          line++;
          rule = [];

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

function spliceString(str, index, count, add) {

  return str.slice(0, index) + (add || "") + str.slice(index + count+1);

}

function loadFailed(line) {

  window.alert('There is an error in your config at line '+line+'!');

  loadSuccessful = false;

}

async function start() {

  var input = document.getElementById('input').value;

  tape = spliceString(tape,5,-1,input);

  process();

}

async function process() {

  if (rules.length>0) {

    var n;
    var m = rules.length;
    var executed;

    while (state != endstate) {

      executed = false;
      n = 0;

      while (!executed && n<m) {

        console.log(n);

        console.log(rules[n][1] + " ?= " + tape.charAt(tapePos) + " ("+n+")");

        if (rules[n][1] == tape.charAt(tapePos)) {

          console.log("Rule matches tape " + tape.charAt(tapePos));

          if (rules[n][0] == state) {

            console.log("Rule matches state " + tape.charAt(tapePos));

            tape = spliceString(tape, tapePos, 0, rules[n][3]);
            state = rules[n][2];

            switch (rules[n][4]) {
              case "L":
                tapePos--;
                break;
              case "R":
                tapePos++;
                break;
              default:

            }

            executed = true;

            console.log(tape);
            console.log("state: "+state+" endstate: "+endstate);
            console.log(tapePos);

          }

        }

        n++;

      }

      if (executed == false) {

          fail();

      }

    }

    document.getElementById('tape').innerHTML = tape;

  }

}

function fail() {

  window.alert("FAILED!");

}
