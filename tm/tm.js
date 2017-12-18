var rules = [];
var tape;
var loadSuccessful;
var tapePos = 1;
var state;
var startState = "";
var endstate = [];
var isLoading = 0;
var failed = false;

function loadRules() {

  rules = [];
  startState = "";
  endstate = [];
  loadSuccessful = true;
  var ta = formatInput(document.getElementById('rules').value);
  var rule = [];
  var spot = 0;
  var line = 1;
  var preSymbol = 2;
  var stateString = "";
  var endstateTemp = "";

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

          case "?":
            i++;
            while (ta[i] != "~") {
              if ( (ta[i]!=",") && (ta[i]!=">") ) {

                startState += ta[i];
                i++;

              } else {
                loadFailed(line);
                break;
              }
            }
            line++;
            preSymbol = 2;
            spot = -2;
            break;

          case "!":
            i++;
            while (ta[i] != "~") {
              if (ta[i] == ",") {

                endstate.push(endstateTemp);
                endstateTemp = "";
                preSymbol = 3;

              } else if (ta[i] != ">") {
                endstateTemp += ta[i];
                preSymbol = 2;
              } else {
                loadFailed(line);
                break;                
              }
              i++;
            }
            if (preSymbol != 3) {
              endstate.push(endstateTemp);
            }
            i--;
            preSymbol = 2;
            spot++;
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

        } else if (spot == -1) {

          console.log("Loaded start and end state!");

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

      console.log(startPos+", "+(endPos-startPos));
      input = spliceString(input, startPos, endPos-startPos);

      i = startPos;

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
  tapePos = 1;
  state = startState;
  failed = false;

  document.getElementById('tape').innerHTML = "";
  tape = spliceString("##",tapePos,-1,input);

  process();

}

async function process() {

  if (rules.length>0) {

    var n;
    var m = rules.length;
    var timeToWait = 3;
    var finished = false;

    loading();

    while ( (!finished) && (!failed) ) {

      if (timeToWait == 3) {
        await sleep(1);
        timeToWait = 0;
      }

      computeStep(n, m);

      timeToWait++;

      for (var i = 0; i < endstate.length; i++) {
        if (endstate[i] == state) {
          // console.log("test");
          finished = true;
        }
      }

    }

    if (!failed) {
      document.getElementById('tape').innerHTML = tape;
    }

    loading();

  }

}

async function computeStep(n, m) {

  var executed = false;
  n = 0;

  if (tapePos < 0) {

    tape = "#"+tape;
    tapePos++;
    console.log("adding a symbol");

  } else if (tapePos > tape.length-1) {
    tape = tape+"#";
  }

  while (!executed && n<m) {

    console.log(state);

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

function loading() {

  var spinner = document.getElementById('loading').getElementsByClassName('spinner');

  if (!isLoading) {

    for (var i = 0; i < spinner.length; i++) {

      spinner[i].className += " loading";

    }

  } else {

    for (var i = 0; i < spinner.length; i++) {

      spinner[i].className = spinner[i].className.slice(0,7);

    }

  }

  isLoading ^= true;

}

function fail() {

  window.alert("FAILED!");

  failed = true;

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
