const opponentSelection = document.querySelector("#opponent");
const header = document.querySelector("header");
let choice = opponentSelection.value.toLowerCase();
let player1;
let player2;
initialisePlayers();

opponentSelection.addEventListener("change", ()=> {
    choice = opponentSelection.value.toLowerCase();
    initialisePlayers();
    DISPLAYCONTROL.reset();
    GAMEFLOW.gameBoardCounterReset();
})

// Factory function to create Player Objects
function createPlayers(mark) {
    return {mark};
}

// Initalise players from factory functions

function initialisePlayers() {
    player1 = createPlayers("X");
    player2 = choice === "person" ? createPlayers("O") : easyAI();
}

// Factory function for EASYAI mode. Should reconfigure to module pattern.

function easyAI(mark = "O") {
    function play() {
        const currGameBoard = GAMEBOARD.get();
        const emptyCells = []
        for (const cell of currGameBoard) {
            if (typeof cell === "number") {
                emptyCells.push(currGameBoard.indexOf(cell))
            }
        }
        cell = (Math.floor(Math.random() * emptyCells.length));
        GAMEBOARD.update(emptyCells[cell] + 1);
        DISPLAYCONTROL.updateAIPlay(emptyCells[cell] + 1);
    }
    return  {mark, play}
}

// Module pattern for GAMEBOARD REPRESENTATION IN MEMORY
const GAMEBOARD = (function() {
    const gameBoard = [1,2,3,4,5,6,7,8,9];

    function update(cell) {
        gameBoard[cell-1] = GAMEFLOW.lastPlayed.mark;
        GAMEFLOW.checkWin(cell);
    }

    function get() {
        return gameBoard;
    }

    function reset() {
        for (let i = 0; i < gameBoard.length; i++) {
            gameBoard[i] = i + 1;
    }
}

    return {update, get, reset};

})();

//Module pattern for the gameflow. switches turns and keeps record of the last player
const GAMEFLOW = (function() {
    let lastPlayed = player1;
    let gameBoardCounter = 0;
    const winningCombination = [[1,2,3], [1,4,7], [1,5,9], [2,5,8], [3,6,9], [4,5,6], [3,5,7], [7,8,9]]

    function switchTurns() {
        if (choice === "person") {
            this.lastPlayed = this.lastPlayed === player1 ? player2 : player1;
        }
        else {
            if (this.lastPlayed === player1) {
                this.lastPlayed = player2;
                aiPlay(player2);
            }
            else {
                this.lastPlayed = player1;
            }
        }
    }

    function aiPlay(player2) {
        player2.play();
    }

    function gameBoardCounterReset() {
        gameBoardCounter = 0;
    }

    function checkWin(cell) {
        gameBoardCounter += 1;
        const arr = winningCombination.filter((x)=> x.includes(cell));
        for (const i of arr) {
            let result = i.every((x)=> GAMEBOARD.get()[x-1] === this.lastPlayed.mark);
            if (result) {
                const displayAnnounce = DISPLAYCONTROL.announceWin.bind(DISPLAYCONTROL);
                setTimeout(displayAnnounce, 200);
                this.gameBoardCounterReset();
                return;
            }
        };
        if (gameBoardCounter >=9) {
            const displayTie = DISPLAYCONTROL.announceTie.bind(DISPLAYCONTROL);
            setTimeout(displayTie, 200);
            this.gameBoardCounterReset();
        }
        else {
            switchTurns.call(this);
        };
        };

    return {lastPlayed, checkWin, gameBoardCounterReset};

})();

// module pattern for the display
const DISPLAYCONTROL = (function() {
    const gridContainer = document.querySelector(".grid-container");
    const modalClose = document.querySelector("aside > div.close");
    const announce = document.querySelector("aside > div.announce");
    const aside = document.querySelector("aside");

    function update(event) {
        if (event.target != this) {
            const cell = +(event.target.getAttribute("data-value"));
            if (!event.target.textContent) {
                event.target.textContent = GAMEFLOW.lastPlayed.mark;
                GAMEBOARD.update(cell);
            }
        }    
    }

    function updateAIPlay(cell) {
        cell = String(cell);
        const displayCell = document.querySelector(`div[data-value = "${cell}"]`);
        displayCell.textContent = player2.mark;
    }

    function announceWin() {
        this.gridContainer.style.display = "none";
        aside.style.display = "flex";
        announce.textContent = `Player ${GAMEFLOW.lastPlayed.mark} won!`;
        this.modalClose.addEventListener("click", this.reset);
        header.style.display = "none";
    }

    function announceTie() {
        this.gridContainer.style.display = "none";
        aside.style.display = "flex";
        announce.textContent = `A tie!`;
        this.modalClose.addEventListener("click", this.reset);
        header.style.display = "none";
    }
    
    function emptyGrid() {
        gridChildren = this.gridContainer.children;
        gridChildren = Array.from(gridChildren);
        gridChildren.forEach((cell)=> cell.textContent = "");
    }

    function reset() {
        emptyGrid.call(DISPLAYCONTROL);
        aside.style.display = "none";
        DISPLAYCONTROL.gridContainer.style.display = "grid";
        header.style.display = "flex";
        GAMEFLOW.lastPlayed = player1;
        GAMEBOARD.reset();
    }

    return {modalClose, gridContainer, update, announceWin, announceTie, updateAIPlay, reset};
}) ();
DISPLAYCONTROL.gridContainer.addEventListener("click", DISPLAYCONTROL.update);