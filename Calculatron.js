/* NOTES:
1) Key listeners for removing letters from inputs aren't the best because they can get crossed
if more than one key is pressed at a time, so the slice() method that removes that character doesn't
always perform correctly. This can be fixed by maybe stripping all bad characters from the field instead.
I prefer this current implementation to simply clearing the entire field, though.
2) Pressing Enter on the Clear button doesn't trigger the button click animations correctly. It seems
that upclick isn't registering because it's being interfered by the natural action of pressing Enter
on a button. I tried adding the unclick animation to the clearCalc() method, but now it's so fast that
you don't even see the downclick. The button just stays gray. I'm stumped on this one.
3) Something is still wrong with the justCleared flag. 
*/

let operator = '+';
const leftOperatorInput = document.getElementById("leftoperand");
const rightOperatorInput = document.getElementById("rightoperand");
const radios = document.querySelectorAll('input[name="operators"]');
const equalsButton = document.getElementById("equals");
const clearButton = document.getElementById("clear");
const justCleared = false;    // Pressing Enter on Clear button triggers left field
const answerField = document.getElementById("answer");


// Make the label bold for the currently selected operator radio button and set operator
function radioClicked() {
    for (let i=0; i<radios.length; i++) {
        let r = radios[i];
        let label = r.parentNode;               // Label surrounding current button
        if (label.classList.contains("boldradio")) label.classList.remove("boldradio"); // clear all bold
        if (r.checked) {
            label.classList.add("boldradio");   // Bold label of current radio button
            operator = r.value;         // Set operation to be performed
        }
    }
    answerField.innerHTML = `<p><br></p>`;    // Clear result when operator changed
}

function calculate() {      // Triggered when '=' button/Enter key is pressed
    // Get the input fields
    let leftOperand = parseFloat(leftOperatorInput.value);
    let rightOperand = parseFloat(rightOperatorInput.value);
    let result = 0;
    let preposition;
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
    // "The result of add/subtract/dividing x and/from/by y is z. For subtract, reverse operands ("subtracting y from x")
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
    if (clearButton.classList.contains("clearActive")) clearButton.classList.remove("clearActive");
    clearButton.classList.add("clearInactive");
    leftOperatorInput.value = null;
    rightOperatorInput.value = null;
    document.getElementById("add").click();
    answerField.innerHTML = `<p><br></p>`;
    justCleared = true;         // If Clear button has focus and Enter is pressed,
    leftOperatorInput.focus();  // leftOperatorInput.focus() will catch 'Enter' keyup and try to calculate. Bad.
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
    if(badChars.includes(event.key)) {
        leftOperatorInput.value = leftOperatorInput.value.slice(0,-1);  // Remove badchar //null;
    }
    if(event.key === 'Enter') {
        animateEqualsButtonUpClick();
        if (justCleared === false) equalsButton.click();    // So don't receive 'Invalid input' message after clearing
    }
    if(event.key === 'Escape') {
        animateClearButtonUpClick();
        clearButton.click();
    }
    // If user presses +-*/ while in left field, select that operator and set focus to right field
    for (let i=0; i<radios.length; i++) {
        let r = radios[i];
        if(event.key === r.value) {
            r.focus();
            r.click();
            leftOperatorInput.value = leftOperatorInput.value.slice(0,-1);  // Remove +-*/
            rightOperatorInput.focus();
        }
    }
    justCleared = false;
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
    for (let i=0; i<radios.length; i++) {
        let r = radios[i];
        if(event.key === r.value) {
            rightOperatorInput.value = rightOperatorInput.value.slice(0,-1);
        }
    }
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

clearButton.addEventListener("keydown", event => {
    if(event.key === 'Enter' || event.key === 'Escape') animateClearButtonDownClick();
});
clearButton.addEventListener("keyup", event => {
    if(event.key === 'Enter') {
        justCleared = true;
        animateClearButtonUpClick();    // Why doesn't this work?
    }
    if(event.key === 'Escape') {
        justCleared = true;
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