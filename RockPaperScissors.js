console.log('test');
function playGame() {
    let numRounds;
    do {
        numRounds = prompt("How many rounds would you like to play?");
        console.log(numRounds);
    } while ((numRounds === undefined) || (numRounds === null) || (parseInt(numRounds) === NaN));
    do {
        var player = prompt("Choose one of: Rock, Paper, Scissors");
    } while (false);
}