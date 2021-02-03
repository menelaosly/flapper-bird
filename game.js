const START_X = 1;
const BOARD_HEIGHT = 400;
const FPS = 30;
const PIPE_HEIGHT = 250;
const PIPE_DIF = PIPE_HEIGHT + 170;
const INITIAL_SPEED = 10;

const game = document.getElementById("game");
const bird = document.getElementById("bird");
const board = document.getElementById("board");
const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");
const overlay = document.getElementById("overlay");
const newbestEl = overlay.getElementsByTagName("h1")[0];
let timeInterval;
let pipes = [];
let lost = true;
let score = 0;
let best = 0
let speed = 10;

const init = () => {
    lost = false;
    speed = INITIAL_SPEED;
    bird.style.top = `${START_X}px`;
    // bird.style.transform = "rotateZ(0deg)";
    timeInterval && clearInterval(timeInterval);
    game.innerHTML = "";
    game.appendChild(bird);
    game.appendChild(board);
    game.appendChild(overlay);

    overlay.style.display = "none";

    best = localStorage.getItem("best");
    bestEl.innerHTML = best;
    newbestEl.style.visibility = "hidden"

    initPipes();

    timeInterval = setInterval(draw,1000 / FPS);
}



const draw = () => {
    const birdTop = Number(bird.style.top.replace("px",""));
    bird.style.top = (birdTop + 10) + "px";
    if (birdTop <= 0) {
        bird.style.top = "1px";
        return;
    }
    if (birdTop >= BOARD_HEIGHT) {
        lose();
        return;
    }


    increaseScore();
    movePipes();
    setTimeout(checkPipeCollide,30);
}


const increaseScore = () => {
    score += 0.1;
    scoreEl.innerHTML = Math.round(score);
}

const lose = () => {
    clearInterval(timeInterval);
    checkBestAndRestScore();
    overlay.style.display = "flex";
    lost = true;
}


const checkBestAndRestScore = () => {
    if (score > best) {
        best = Math.floor(score);
        localStorage.setItem("best",best);
        newbestEl.style.visibility = "visible"
        const newbest = document.getElementById("new-best");
        newbest.innerHTML = best;
    }
    score = 0;
    bestEl.innerHTML = best;
    scoreEl.innerHTML = score;

}

const initPipes = () => {
    pipes = [];
    let img = document.createElement("img");
    img.src = "./assets/pipe.svg";
    let img2 = document.createElement("img");
    img2.src = "./assets/pipe.svg";
    let pipe = document.createElement("div");
    pipe.classList.add("pipe");
    pipe.appendChild(img);
    let pipe2 = document.createElement("div");
    pipe2.classList.add("pipe")
    pipe2.appendChild(img2);
    pipe2.style.transform = "translate(-5px) rotateZ(-180deg)";
    resetPipes(pipe,pipe2);
    pipes.push(pipe,pipe2);
    game.appendChild(pipe);
    game.appendChild(pipe2);
}

const movePipes = () => {
    let right = Number(pipes[0].style.right.replace("px",""));
    if (right >= 500) {
        resetPipes(pipes[0],pipes[1]);
        return;
    }
    pipes[0].style.right = right + speed + "px";
    pipes[1].style.right = right + speed + "px";
    speed = INITIAL_SPEED + (score / 25);
}


const checkPipeCollide = () => {
    const bottomPipeBottom = BOARD_HEIGHT;
    const bottomPipeTop = pipes[0].offsetTop;
    const bottomPipeLeft = pipes[0].offsetLeft;
    const bottomPipeRight = bottomPipeLeft + 103;

    const topPipeBottom = pipes[1].offsetTop + PIPE_HEIGHT;
    const topPipeTop = 0;
    const topPipeLeft = pipes[1].offsetLeft;
    const topPipeRight = bottomPipeLeft + 103;

    const birdX = 100;
    const birdY = bird.offsetTop;

    if (
        birdX >= bottomPipeLeft
        && birdX <= bottomPipeRight
        && birdY >= bottomPipeTop
        && birdY <= bottomPipeBottom
    ) {
        lose();
    }

    if (
        birdX >= topPipeLeft
        && birdX <= topPipeRight
        && birdY >= topPipeTop
        && birdY <= topPipeBottom
    ) {
        lose();
    }
}

const resetPipes = (pipe1,pipe2) => {
    pipe1.style.right = "-100px";
    pipe2.style.right = "-100px";
    let randTop = Math.floor(Math.random() * PIPE_HEIGHT - 20) - PIPE_HEIGHT;
    pipe1.style.top = randTop + PIPE_DIF + "px";
    pipe2.style.top = randTop + "px";
};

const checkKeyPress = () => {
    if (lost) {
        init();
    }
    else {
        moveBird();
    }
}


const moveBird = () => {
    const birdTop = Number(bird.style.top.replace("px",""));
    bird.style.top = (birdTop - 70) + "px";
    bird.animate([
        { transform: 'translate(-40px,-30px) rotateZ(20deg)' },
        { transform: 'translate(-40px,-30px) rotateZ(-40deg)' },
        { transform: 'translate(-40px,-30px) rotateZ(20deg)' },
    ],{
        // timing options
        duration: 300,
        easing: "ease-in-out"
    })
}

window.addEventListener("keydown",checkKeyPress);