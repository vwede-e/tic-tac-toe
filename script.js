function createPlayers(mark) {
    return {mark};
}

const player1 = createPlayers("X");
const player2 = createPlayers("O");

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
            gameBoard[i] = i+i;
    }
}

    return {update, get, reset};

})();

const GAMEFLOW = (function() {
    let lastPlayed = player1;
    let gameBoardCounter = 0;
    const winningCombination = [[1,2,3], [1,4,7], [1,5,9], [2,5,8], [3,6,9], [4,5,6], [3,5,7], [7,8,9]]

    function switchTurns() {
        this.lastPlayed = this.lastPlayed === player1 ? player2 : player1;
    }

    function checkWin(cell) {
        gameBoardCounter += 1;
        const arr = winningCombination.filter((x)=> x.includes(cell));
        for (const i of arr) {
            let result = i.every((x)=> GAMEBOARD.get()[x-1] === this.lastPlayed.mark);
            if (result) {
                const displayAnnounce = DISPLAYCONTROL.announceWin.bind(DISPLAYCONTROL);
                setTimeout(displayAnnounce, 200);
                gameBoardCounter = 0;
                return;
            }
        };
        if (gameBoardCounter >=9) {
            const displayTie = DISPLAYCONTROL.announceTie.bind(DISPLAYCONTROL);
            setTimeout(displayTie, 200);
            gameBoardCounter = 0;
        }
        else {
            switchTurns.call(this);
        };
        };

    return {lastPlayed, checkWin};

})();

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

    function announceWin() {
        this.gridContainer.style.display = "none";
        aside.style.display = "flex";
        announce.textContent = `Player ${GAMEFLOW.lastPlayed.mark} won!`;
        this.modalClose.addEventListener("click", reset);
    }

    function announceTie() {
        this.gridContainer.style.display = "none";
        aside.style.display = "flex";
        announce.textContent = `A tie!`;
        this.modalClose.addEventListener("click", reset);
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
        GAMEFLOW.lastPlayed = player1;
        GAMEBOARD.reset();
    }

    return {modalClose, gridContainer, update, announceWin, announceTie};

}) ();

DISPLAYCONTROL.gridContainer.addEventListener("click", DISPLAYCONTROL.update);