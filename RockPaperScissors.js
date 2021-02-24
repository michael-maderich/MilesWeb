const match = {
    LOSS:-1,
    TIE: 0,
    WIN: 1
}

function playGame() {
    let numWins = 0;
    let numLosses = 0;
    let numTies = 0;
    const moves = ["rock","paper","scissors"];
    const numeric = {
        ROCK: 0,
        PAPER: 1,
        SCISSORS: 2
    }

    // Find out how many rounds Player wants. Validate input.
    let numRounds = prompt('\nWelcome to "Rock, Paper, Scissors"!'+
                        '\n\nHow many rounds would you like to play?');
    if (numRounds === null) return;     // User pressed Cancel button
    numRounds = parseInt(numRounds);

    // If they lack brain cells, gently remind them to enter a number
    while ( (numRounds == undefined) || (Number.isNaN(numRounds)) ) {
        numRounds = prompt("\nPlease enter only a number."+
                        "\n\nHow many rounds would you like to play?");
        if (numRounds === null) return;
        numRounds = parseInt(numRounds);
    }

    // Play rounds
    let updateMessage = "Good luck!\n\n";            // Initial message. Used for play-by-play
    for (let round=0; round < numRounds; round++) {
        let playerChoice = undefined;
        do {
            playerChoice = prompt(`\n${updateMessage}` +
                            `So far you have ${numWins} win${numWins!=1?'s':''}, `+
                            `${numLosses} loss${numLosses!=1?'es':''}, and `+
                            `${numTies} tie${numTies!=1?'s':''}.`+
                            `\n\n\t\tRound ${round+1}\t\t`+
                            `\n\nChoose one of: Rock, Paper, Scissors`);
            if (playerChoice === null) {     // User pressed Cancel button so taunt them :P
                switch (Math.floor(Math.random()*5)) {
                    case 0:alert("Don't be a sore loser!");break;
                    case 1:alert("Y'all come back now!");break;
                    case 2:alert("Getting tired already?");break;
                    case 3:alert("You couldn't hack the Gibson");break;
                    default:alert("Goodbye!");break;
                }
                return;
            }
            else {
                playerChoice = playerChoice.toLowerCase();
                if ((playerChoice !== moves[numeric.ROCK])
                && (playerChoice !== moves[numeric.PAPER])
                && (playerChoice !== moves[numeric.SCISSORS]))
                    playerChoice = undefined;
            }
        } while (playerChoice == undefined);

        let cpuChoice = Math.floor(Math.random()*3);       // 0 = rock, 1 = paper, 2 = scissors
        switch ( combat(moves.indexOf(playerChoice), cpuChoice) ) {
            case match.LOSS:
                updateMessage = `Oh no, the Gibson chose ${moves[cpuChoice]}! You lose!\n\n`;
                console.log(`You chose ${playerChoice}. CPU chose ${moves[cpuChoice]}. You lose.` +
                            `\nScore: W-${numWins}, L-${++numLosses}, T-${numTies}`);
                break;
            case match.TIE:
                updateMessage = `Could be worse. The Gibson chose ${moves[cpuChoice]}. Its a tie..\n\n`;
                console.log(`You chose ${playerChoice}. CPU chose ${moves[cpuChoice]}. It's a tie.` +
                            `\nScore: W-${numWins}, L-${numLosses}, T-${++numTies}`);
                break;
            case match.WIN:
                updateMessage = `Slick moves! The Gibson chose ${moves[cpuChoice]}. You win!\n\n`
                console.log(`You chose ${playerChoice}. CPU chose ${moves[cpuChoice]}. You win.` +
                `\nScore: W-${++numWins}, L-${numLosses}, T-${numTies}`);
                break;
        }
    }
    console.log(`Final score: ${numWins} win${numWins!=1?'s':''}, ${numLosses} loss${numLosses!=1?'es':''}, and ${numTies} tie${numTies!=1?'s':''}.`);
    alert(`\n${updateMessage}`+
            `No more rounds remain. Great game!!`+
            `\n\nFinal tally is ${numWins} win${numWins!=1?'s':''}, ${numLosses} loss${numLosses!=1?'es':''}, and ${numTies} tie${numTies!=1?'s':''}.`+
            `\n\nHave a lovely day!`);
}

function combat(pChoice, cChoice) {
    if (pChoice === cChoice) return match.TIE;
    else if ( (pChoice+1) % 3 === cChoice ) return match.LOSS;  // x loses to x+1 in Ring
    else return match.WIN;
}
