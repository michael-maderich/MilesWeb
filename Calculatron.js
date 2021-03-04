/********************************************************************************
* CALCULATRON
* by: Michael Maderich
* March 3, 2021
*
* Simple arithmetic calculator with HTML interface and Javascript implementation
********************************************************************************/

// Assign relevant HTML elements to constants
const leftOperatorInput = document.getElementById("leftoperand");
const rightOperatorInput = document.getElementById("rightoperand");
const radios = document.querySelectorAll('input[name="operators"]');
const equalsButton = document.getElementById("equals");
const clearButton = document.getElementById("clear");
const answerField = document.getElementById("answer");
let justCleared = false;    // Pressing Enter on Clear button triggers left field


// Make the label bold for the currently selected operator radio button and set operator
function radioClicked() {
    radios.forEach(r => {
        let label = r.parentNode;               // Label surrounding current button
        if (label.classList.contains("boldradio")) label.classList.remove("boldradio"); // clear all bold
        if (r.checked) {
            label.classList.add("boldradio");   // Bold label of current radio button
        }
    });
    answerField.innerHTML = `<p><br></p>`;    // Clear result when operator changed
}

function calculate() {      // Triggered when '=' button/Enter key is pressed
    // Get the input fields
    let leftOperand = parseFloat(leftOperatorInput.value);
    let operator = '+';
    for (let i=0; i<radios.length; i++) {
        let r = radios[i];
        if (r.checked) operator = r.value;         // Set operation to be performed
    }
    let rightOperand = parseFloat(rightOperatorInput.value);
    let result = 0;
    let preposition;        // For forming the correct "result sentence"
    let resultString = `The result of ${document.querySelector("input[name='operators']:checked").id}`;
    switch (operator) {
        case '+':
            result = leftOperand + rightOperand;
            preposition='and';
            break;
        case '-':
            result = leftOperand - rightOperand;
            preposition='from';
            break;
        case '*':
            result = leftOperand * rightOperand;
            preposition='by';
            break;
        case '/':
            if (rightOperand === 0) result = null;
            else {
                result = leftOperand / rightOperand;
                resultString = resultString.slice(0,-1);    // Drop the silent 'e' off 'divide'
            }
            preposition='by';
            break;
        default:break;
    }
    // "The result of add/multipy/dividing x and/by y is z. For subtract, reverse operands ("subtracting y from x")
    resultString += `ing ${operator==='-'?rightOperand:leftOperand} ${preposition} `
                    + `${operator==='-'?leftOperand:rightOperand} is ${result}.`;
    if (result===null) resultString = "Division by 0 is fake news. Please try again.";
    if (Number.isNaN(leftOperand) || Number.isNaN(rightOperand)) {
        resultString = "Invalid input. Please try again."
    }
    if (leftOperand === Infinity || rightOperand === Infinity || result === Infinity)
        resultString = "I'm sorry, but you have exceeded the bounds of allowable numbers. Even computers have limits."
    answerField.innerHTML = `<p>${resultString}</p>`;
}

function clearCalc() {
    leftOperatorInput.value = null;
    rightOperatorInput.value = null;
    document.getElementById("add").click();
    answerField.innerHTML = `<p><br></p>`;
    leftOperatorInput.focus();
    // leftOperatorInput.focus() unwantedly will catch 'Enter' keyup on Clear button and try to calculate. Fixed with justCleared flag
}





/** Event Listeners **/
/** If the user enters any character but a number or decimal, clear the text field
/   If the user presses 'Enter' in either text input or on any radio, trigger the equals button
/   If the user presses 'Escape' while focused on any element, clear the calculator
**/
let badChars = [];  // All ASCII chars except *042 +043 -045 .046 /047, '.' (46), and '0'-'9' (48-57)
for (let n=32;n<42;n++) badChars.push(String.fromCharCode(n));badChars.push(',');   // ASCII 044
for (let n=58;n<256;n++) badChars.push(String.fromCharCode(n));

leftOperatorInput.addEventListener("keydown", event => {
    if(event.key === 'Enter') animateEqualsButtonDownClick();
    if(event.key === 'Escape') animateClearButtonDownClick();
});
leftOperatorInput.addEventListener("keyup", event => {
    animateClearButtonUpClick();    // Clear upclick isn't performed when Enter pressed on Clear button
    if(badChars.includes(event.key)) {
        leftOperatorInput.value = leftOperatorInput.value.slice(0,-1);  // Remove badchar //null;
    }
    if(event.key === 'Enter' && justCleared === false) {    // So don't receive 'Invalid input' message after clearing
        animateEqualsButtonUpClick();
        equalsButton.click();
    }
    if(event.key === 'Escape') {
        animateClearButtonUpClick();
        clearButton.click();
    }
    // If user presses +-*/ while in left field and it's not empty, select that operator and set focus to right field
    for (let i=0; i<radios.length; i++) {
        let r = radios[i];
        if(event.key === r.value) {     // (+-*/)
            if (leftOperatorInput.value !== r.value) {  // Field has text other than the operator just typed
                r.click();                              // Select that operator and
                rightOperatorInput.focus();             // Move focus to right operand field
            }                                           // If left field is empty and operator typed, simply:
            leftOperatorInput.value = leftOperatorInput.value.slice(0,-1);  // Remove +-*/
        }
    }
    justCleared = false;    // Reset after clicking 'Enter' on Clear button unwantedly triggers leftOperatorInput 'Enter' keyup
});

rightOperatorInput.addEventListener("keydown", event => {
    if(event.key === 'Enter') animateEqualsButtonDownClick();
    if(event.key === 'Escape') animateClearButtonDownClick();
});
rightOperatorInput.addEventListener("keyup", event => {
    if(badChars.includes(event.key)) {
        rightOperatorInput.value=null;
    }
    if(event.key === 'Enter') {
        animateEqualsButtonUpClick();
        equalsButton.click();
    }
    if(event.key === 'Escape') {
        animateClearButtonUpClick();
        clearButton.click();
    }
    // If user presses +-*/ while in right field, delete that keystroke
    if(event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/')
         rightOperatorInput.value = rightOperatorInput.value.slice(0,-1);
});

// While focused on radio buttons, Enter calculates, Escape clears, and +-*/ selects that operator
radios.forEach( function(operators) {
    operators.addEventListener("keydown", event => {
        if(event.key === 'Enter') animateEqualsButtonDownClick();
        if(event.key === 'Escape') animateClearButtonDownClick();
    });
    operators.addEventListener("keyup", event => {
        if(event.key === 'Enter') {
            animateEqualsButtonUpClick();
            equalsButton.click();
        }
        if(event.key === 'Escape') {
            animateClearButtonUpClick();
            clearButton.click();
        }
        if(event.key === '+') {document.getElementById("add").focus(); document.getElementById("add").click();}
        if(event.key === '-') {document.getElementById("subtract").focus(); document.getElementById("subtract").click();}
        if(event.key === '*') {document.getElementById("multiply").focus(); document.getElementById("multiply").click();}
        if(event.key === '/') {document.getElementById("divide").focus(); document.getElementById("divide").click();}
    });
});

equalsButton.addEventListener("keydown", event => {
    if(event.key === 'Enter') {
        animateEqualsButtonDownClick();
        equalsButton.click();
    }
    if(event.key === 'Escape') animateClearButtonDownClick();
});
equalsButton.addEventListener("keyup", event => {
    if(event.key === 'Enter') animateEqualsButtonUpClick();
    if(event.key === 'Escape') {
        animateClearButtonUpClick();
        clearButton.click();
    }
});

clearButton.addEventListener("keydown", event => { // Pressing Enter on Clear button performs keydown but not keyup
    if(event.key === 'Enter') {
        justCleared = true;
        animateClearButtonDownClick();
    }
    if(event.key === 'Escape') {
        animateClearButtonDownClick();
    }
});
clearButton.addEventListener("keyup", event => {
    // Never triggers. Clear button naturally clicked on 'Enter' keydown and focus moves to leftOperatorInput for 'Enter' keyup
    if(event.key === 'Enter') {
//        justCleared = true;
        animateClearButtonUpClick();    // Why doesn't this work? And that ^^ is why this doesn't work
    }
    if(event.key === 'Escape') {
        animateClearButtonUpClick();
        clearButton.click();
    }
});

function animateEqualsButtonDownClick() {
    if (equalsButton.classList.contains("equalsInactive")) equalsButton.classList.remove("equalsInactive");
    equalsButton.classList.add("equalsActive");
}
function animateEqualsButtonUpClick() {
    if (equalsButton.classList.contains("equalsActive")) equalsButton.classList.remove("equalsActive");
    equalsButton.classList.add("equalsInactive");
}
function animateClearButtonDownClick() {
    if (clearButton.classList.contains("clearInactive")) clearButton.classList.remove("clearInactive");
    clearButton.classList.add("clearActive");
}
function animateClearButtonUpClick() {
    if (clearButton.classList.contains("clearActive")) clearButton.classList.remove("clearActive");
    clearButton.classList.add("clearInactive");
}

/* NOTES on the key listeners:
1) Key listeners for removing letters from inputs aren't the best because they can get crossed
if more than one key is pressed at a time, so the slice() method that removes that character doesn't
always perform correctly. This can be fixed by maybe stripping all bad characters from the field instead.
I prefer this current implementation to simply clearing the entire field, though.
2) Pressing Enter on the Clear button doesn't trigger the button click animations correctly. It seems
that the Clear 'Enter' keyup isn't registering because it's being interfered by the natural action of
pressing Enter on a button. EDIT: FIXED by adding the Clear button upclick animation to the
leftOperatorInput's 'Enter' keyup action. Indeed pressing 'Enter' on the Clear button bypasses its
'Enter' upclick completely. Instead, clearCalc() is called by the forced, unwanted button Click and
focus transfers to the LeftOperatorInput field before the keyup
3) The key listeners allowed me to do a number of fun things, though, like allowing the operator to
be changed by typing it while in the left field, or while focused on the operator radio buttons. Also,
pressing Enter or Escape anywhere on the Calculatron triggers the Equals and Clear buttons, respectively.
*/
