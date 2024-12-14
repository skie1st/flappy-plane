let board;
let boardWidth = 1226;
let boardHeight = 750;
let context;

let planeWidth = 92; 
let planeHeight = 24;
let planeX = boardWidth/8;
let planeY = boardHeight/2;
let planeImg;

let plane = {
    x : planeX,
    y : planeY,
    width : planeWidth,
    height : planeHeight
}

let pipeArray = [];
let pipeWidth = 64; 
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let uptowerImg;
let downtowerImg;

let velocityX = -6; 
let velocityY = 0; 
let gravity = 0.4;

let gameOver = false;
let score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); 


    planeImg = new Image();
    planeImg.src = "./911 plane.png";
    planeImg.onload = function() {
        context.drawImage(planeImg, plane.x, plane.y, plane.width, plane.height);
    }

    uptowerImg = new Image();
    uptowerImg.src = "./uptower.png";

    downtowerImg = new Image();
    downtowerImg.src = "./downtower.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
    document.addEventListener("keydown", moveplane);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);


    velocityY += gravity;

    plane.y = Math.max(plane.y + velocityY, 0); 
    context.drawImage(planeImg, plane.x, plane.y, plane.width, plane.height);

    if (plane.y > board.height) {
        gameOver = true;
    }


    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && plane.x > pipe.x + pipe.width) {
            score += 0.5; 
            pipe.passed = true;
        }

        if (detectCollision(plane, pipe)) {
            gameOver = true;
        }
    }


    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); 
    }


    context.fillStyle = "white";
    context.font="45px sans-serif";
    context.fillText(score, 5, 45);

    if (gameOver) {
        context.fillText("GAME OVER", 5, 90);
    }
}

function placePipes() {
    if (gameOver) {
        return;
    }

    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4;

    let uptower = {
        img : uptowerImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(uptower);

    let downtower = {
        img : downtowerImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(downtower);
}

function moveplane(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {

        velocityY = -6;


        if (gameOver) {
            plane.y = planeY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x && 
           a.y < b.y + b.height && 
           a.y + a.height > b.y;    
}
