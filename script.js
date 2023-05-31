const gridContainer = document.querySelector(".grid-container");
const modalClose = document.querySelector("aside > div.close");
const announce = document.querySelector("aside > div.announce");
const player1 = "X";
const player2 = "O";
let lastPlayed = player1;
let gameBoardCounter = 0;
window.addEventListener("load", createGrid);
function createGrid() {
    for (let i = 0; i <= 8; i++ ) {
        const div = document.createElement("div");
        div.setAttribute("data-value", `${i + 1}`);
        gridContainer.appendChild(div);
    }
}

const gameBoard = [1,2,3,4,5,6,7,8,9];
gridContainer.addEventListener("click", upDate);

function upDate(event) {
    if (event.target != this) {
        const dataValue = +(event.target.getAttribute("data-value"));
        if (!event.target.textContent) {
            event.target.textContent = lastPlayed;
            gameBoard[dataValue-1] = lastPlayed;
            gameBoardCounter += 1;
            checkWin(dataValue);
        }
    }
}

const winningCombination = [[1,2,3], [1,4,7], [1,5,9], [2,5,8], [3,6,9], [4,5,6], [3,5,7], [7,8,9]]

function checkWin(dataValue) {
    const arr = winningCombination.filter((x)=> x.includes(dataValue));
    for (const i of arr) {
        let result = i.every((x)=> gameBoard[x-1] === lastPlayed);
        if (result) {
            setTimeout(announceWin, 200);
            return;
        }
    };
    if (gameBoardCounter >=9) {
        setTimeout(announceTie, 200);
    }
    else {
        switchTurns();
    };
    };

function switchTurns() {
    lastPlayed = lastPlayed === player1 ? player2 : player1;
}

function emptyGrid() {
    gridChildren = gridContainer.children;
    gridChildrens = Array.from(gridChildren);
    gridChildrens.forEach((x)=> x.textContent = "");
}

function announceWin() {
   gridContainer.style.display = "none";
   const aside = document.querySelector("aside");
   aside.style.display = "flex";
   announce.textContent = `Player ${lastPlayed} won!`;
   modalClose.addEventListener("click", restart);
}

function announceTie() {
    gridContainer.style.display = "none";
    const aside = document.querySelector("aside");
    aside.style.display = "flex";
    announce.textContent = `A tie!`;
    modalClose.addEventListener("click", restart);
}

function restart() {
    // rewrite game board
    for (let i = 0; i < gameBoard.length; i++) {
        gameBoard[i] = i+i;
    //empty html cells
    emptyGrid();
    const aside = document.querySelector("aside");
    aside.style.display = "none";
    gridContainer.style.display = "grid";
    lastPlayed = player1;
    gameBoardCounter = 0;
    //
}
}