let arrayNumberA = []; // Keep track of user entry in an array.
let numberA = ''; // Occupies screen2 (the large one). Displays user input and the solution.
let numberB = ''; // Occupies screen1-left
let numberC = ''; // Occupies screen1-right
// screen1 uses spaces to keep elements at the correct width.
// this method should prevent the page styling from breaking if the browser falls back to a default font.
let numberCSpace = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
let operator = '&nbsp;&nbsp;&nbsp;';
let equalSymbol = false; // True after an equation is solved.
let eFreeze = false; // prevent doing operations on exponential numbers or divide by zero error.
let bFreeze = false; // disable back button and digits when solution is displayed.
let oFreeze = false; // di

const screen2 = document.getElementById('screen2');
const screen1Left = document.getElementById('screen1-left');
const screen1Operator = document.getElementById('screen1-operator');
const screen1Right = document.getElementById('screen1-right');
const screen1Equals = document.getElementById('screen1-equals');

const keys = Array.from(document.querySelectorAll('.key')); // Add a listener for each key
keys.forEach(key => {
    const id = key.id;
    document.addEventListener('click', keyClicked);
});

document.addEventListener('keydown', (e) => {
    keyClicked(e);
    if (e.key == '/') { 
        e.preventDefault(); // prevents the "quick find" box from popping up.
    }
});

function keyClicked(e) {
    const id = (e.target.id) ? e.target.id : e.key;
    if (id == '') {return;} // Clicking a keys box-shadow passes null for some reason, this filters those mis-clicks.
    if (!isNaN(id) ){ // If not Not-A-Number
        buildNumberA(id);
    } else {
        switch (id) {
            case '+':
            case '-':
            case '/':
                operate(id);
            break;
            case 'X':
            case 'x':
            case '*':
                operate('X');
            break;
            case 'decimal':
            case '.':
                decimal();
            break;
            case 'equals':
            case '=':
            case 'Enter':
                equals();
            break;
            case 'back':
            case 'Backspace':
                back();
            break;
            case 'clear':
            case 'c':
                clear();
            break;
            case 'invert':
                invert();
            break;
        }
    }
}

function buildNumberA(val) {
    if (eFreeze) {return;}
    if (bFreeze) {
        clear();
    }
    if (arrayNumberA[0] == 0 && arrayNumberA[1] != '.') { // If the first digit is zero, the second must be a decimal.
        if (val == 0) {
            return; // Don't let the screen fill with preceding zeros
        } else {
            arrayNumberA.pop(); // eg. if user enters "07" the "0" is removed.
        }
    }
    if (arrayNumberA.length < 10){ // Prevent overflowing the screen
        arrayNumberA.push(val);
        updateNumberA();
    }
    updateScreen();
}

function operate(val) { // Moves numberA (users input) to numberB and clears numberA for the next input
        if (eFreeze) {return;}
        if (numberA == '' && oFreeze) { // Allow user to change operator if no second number has been input.
            operator = val;
        } else if (numberA == '' && !oFreeze) {
            return;
        } else if (numberA !== '' && oFreeze){ // numberA has been set by user after an operation was selected.
            equals();                          // Solves equation and applys operative. Allows for chained equations. eg 2+2+2=6
            applyOperate(val);
        } else {
            applyOperate(val);
        }
        updateScreen();
}

function applyOperate(val) {
    numberB = numberA;
    numberA = '';
    arrayNumberA = [];
    operator = val;
    bFreeze = false;
    oFreeze = true;
    if (equalSymbol) { // Resets numberC when continuing an equation after solution. eg. 2+2=4 +2=6 +4=10 etc.
        numberC = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'; // initial value.
        numberCSpace = '';
        equalSymbol = false;
    }
}

function decimal() {
    if (eFreeze||bFreeze) {return;}
    if (arrayNumberA.indexOf('.') == -1) { // If there is no decimal in array
        if (arrayNumberA[0] == null) { // insert preceding zero
            arrayNumberA.push('0');
            arrayNumberA.push('.');
        } else { // already has a preceding zero
            arrayNumberA.push('.');
        }
        updateNumberA();
        updateScreen();
    }
}

function equals() {
    if (eFreeze) {return;}
    if (numberA === ''){ 
        return;
    } else if (numberB === '') { // do nothing on empty values
        return;
    } else if (!equalSymbol){ // normal operation
        numberCSpace = '';
        numberC = numberA;
        for (i=numberC.length;i<10;i++){
            numberCSpace = '&nbsp;'+numberCSpace;
        }
        numberA = solve(numberA,operator,numberB);
        equalSymbol = true;
    } else { // if the equation has run before, pressing equals will repeat the operation on the previous soluion.
        numberB = numberA;
        numberA = solve(numberC,operator,numberA);
    }
    bFreeze = true;
    oFreeze = false;
    checkOverflow(numberA);
    updateScreen();
}

function back() { // backspace
    if (eFreeze||bFreeze) {return;}
    arrayNumberA.pop();
    updateNumberA();
    updateScreen();
}

function clear() { // resets to default values
    arrayNumberA = [];
    arrayNumberB = [];
    numberA = '';
    numberB = ''; 
    numberC = '';
    numberCSpace = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    operator = '&nbsp;&nbsp;&nbsp;';
    equalSymbol = false;
    eFreeze = false;
    bFreeze = false;
    updateScreen();
}

function invert() { // Invert positive to negative and vice versa.
    if (eFreeze||bFreeze) {return;}
    if (numberA == ''){
        arrayNumberA.push('-');
    } else if (arrayNumberA[0] == '-') {
        arrayNumberA.shift();
    } else {
        arrayNumberA.unshift('-');
    }
    updateNumberA();
    updateScreen();
}

function solve(a, operator, b) {
    a = parseFloat(a); // Until now all values have been stored as strings.
    b = parseFloat(b); // Converting to numbers for math.

    switch (operator) {
        case '+':
            return b+a;
        case '-':
            return b-a;
        case '/':
            if (a == 0) { // Prevents user from dividing by zero. Literally saves huanity from dire peril. I am a hero.
                eFreeze = true;
                return 'ERROR';
            }
            return b/a;
        case 'X':
            return b*a;
    }
}

/* --Helper Functions-- */

function checkOverflow(val) {
    if ((val.toString()).length > 10) { // Convert numbers that would overflow the screen to exponential notation.
        numberA = val.toExponential(4);
        eFreeze = true;
    }
}

function updateNumberA() {
    numberA = arrayNumberA.join('');
}

/* -- -- */

function updateScreen() { // Push changes to DOM.
    screen2.textContent = numberA;
    screen1Left.innerHTML = numberB;
    screen1Operator.innerHTML = '&nbsp;'+operator+'&nbsp;';
    screen1Right.innerHTML = numberCSpace+numberC;
    screen1Equals.innerHTML = (equalSymbol ? '&nbsp=' : '&nbsp&nbsp');
}