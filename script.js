let constantA = 0;
let constantB;

function add(a,b) {
    return a + b;
}

function subtract(a,b) {
    return a-b;
}

function divide(a,b) {
    return a/b;
}

function multiply(a,b) {
    return a*b;
}

function solve(a, operator, b) {
    switch (operator) {
        case '+':
            add(a,b);
            break;
        case '-':
            subtract(a,b);
            break;
        case '/':
            divide(a,b);
            break;
        case '*':
            multiply(a,b);
            break;
    }
}