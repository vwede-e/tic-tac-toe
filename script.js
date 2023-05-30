const gridContainer = document.querySelector(".grid-container");
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
        event.target.textContent = "X";
        gameBoard[dataValue-1] = "X";
    }
}
