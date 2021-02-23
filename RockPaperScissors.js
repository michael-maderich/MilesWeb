console.log('test');
function playGame() {
    let numRounds;
    do {
        numRounds = prompt("How many rounds would you like to play?");
        console.log(numRounds);
        numRounds = parseInt(numRounds);
        console.log(numRounds);
    } while ((numRounds === undefined) || (numRounds === null) || (numRounds === NaN));
    console.log("Out of the loop");
    for (var rnd=0; rnd < numRounds; rnd++) {
        var playerChoice;
        do {
            playerChoice = prompt(`Round ${rnd+1}! Choose one of: Rock, Paper, Scissors`);
            console.log("CHoice: "+playerChoice);
        } while ((playerChoice === undefined) || (playerChoice === null) || (parseInt(playerChoice) === NaN));
    }
}