const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");
const cvs2 = document.getElementById("canvas2");
const ctx2 = cvs2.getContext("2d");
let fps = 20;
let angle;
let aiPlaying = true;
let birdImage = new Image;
let pause = false;
let aiStatus = aiPlaying;


birdImage.src = "others/Bird.png";
let playingStatus;
let birdDownImage = new Image;
birdDownImage.src = "others/BirdDown.png";

let birdUpImage = new Image;
birdUpImage.src = "others/BirdUp.png";

let backGround = new Image;
backGround.src = "others/backGround.png";

let flap = new Audio();
flap.src = "others/flap.mp3";

let gameOver = new Audio();
gameOver.src = "others/gameOver.mp3";
let score = 0;


//Objects

/*class Blocks {
	constructor(x, y, w, h, v, g, color) {
		ts.x = Math.random()*cvs.width,
		this.y = 0,
		this.w = 25,
		this.h = 25,
	    this.color = "red",
		this.v = 0,
		this.g = 1
	}
	
	rain() {
		this.v += this.g;
		this.y += this.v
	}
}*/



let bird = {
	x: 50,//cvs.width*0.1,
	y: 100,//cvs.height/2,
	w: 70,
	h: 70,
	color: "green",
	g: 3,
	v: 0
}

let bar = [];


bar[0] = {
	x: cvs.width - 10,
	y: 0,
	w: 60,
	h: (Math.random()*cvs.height)/2.5 + cvs.height*0.1,
	color: "lightgreen",
	gap: 200,
	v: 3
}


//Functions

function draw() { 
	drawCanvas();
	checkCollision();
	 
    drawObstacle();
     
	drawBird();
 if (pause) {
    moveBird(); 
}
    ai();
     
}
function drawCanvas() {
       ctx2.fillStyle = "black";
    ctx2.fillRect(0, 0, cvs2.width, cvs2.height);
		
	ctx.drawImage(backGround ,0, 0, cvs.width, cvs.height);
    if (pause) {
    score++;
    }
    ctx2.fillStyle = "white";
    ctx2.font = "30px andalus";
    ctx2.fillText("Flappy Bird", 66, 35)
    ctx2.fillText("Score: " + score , 66, 35 + 60)
    
    
   if (aiPlaying) {aiStatus = "AI got your back"} else {aiStatus = "U r on your own"}; 
    ctx2.fillText(aiStatus, 66, 35 + 2*60)
     if (pause) {playingStatus = "Watch Out!!!"} else {playingStatus = "Paused!!!"}
    ctx2.fillText(playingStatus, 66, 35 + 3*60)
}

function aiTurn() {
    aiPlaying = !aiPlaying;
}

function drawBird() {
//	if (bird.v > 2) {
//        ctx.drawImage(birdDownImage, bird.x, bird.y, bird.w, bird.h);
//    } else  {
//        ctx.drawImage(birdUpImage, bird.x, bird.y, bird.w, bird.h);
//    } /*else {
    angle = Math.atan(bird.v)/2;
    ctx.translate(bird.x + bird.w/2, bird.y + bird.h/2);
    ctx.rotate(angle);
	ctx.drawImage(birdImage, -bird.w/2, -bird.h/2, bird.w, bird.h);       
    ctx.rotate(-angle);
    ctx.translate(-bird.x - bird.w/2, -bird.y - bird.h/2);

}

function drawObstacle() {
    for (let i = 0; i < bar.length; i++) {
    ctx.fillStyle = bar[i].color;
	ctx.fillRect(bar[i].x, bar[i].y, bar[i].w, bar[i].h);
	ctx.fillStyle = bar[i].color;
	ctx.fillRect(bar[i].x, bar[i].h + bar[i].gap, bar[i].w, 400);
   
    ctx.strokeStyle = "black";
	ctx.strokeRect(bar[i].x, bar[i].y, bar[i].w, bar[i].h);
	ctx.strokeStyle = "black";
	ctx.strokeRect(bar[i].x, bar[i].h + bar[i].gap, bar[i].w, 400);
        
    ctx.fillStyle = "green";
	ctx.fillRect(bar[i].x - 7, bar[i].h - 20, bar[i].w + 14, 20);
	ctx.fillStyle = "green";
	ctx.fillRect(bar[i].x - 7, bar[i].h + bar[i].gap, bar[i].w + 14, 20);
        
    ctx.strokeStyle = "black";
	ctx.strokeRect(bar[i].x - 7, bar[i].h - 20, bar[i].w + 14, 20);
	ctx.strokeStyle = "black";
	ctx.strokeRect(bar[i].x - 7, bar[i].h + bar[i].gap, bar[i].w + 14, 20);
    if (pause) {     
    bar[i].x -= bar[i].v;
    }
}
    if (bar.length >= 4) {
        bar.shift();
       // document.write("df")
    }
    if (bar[bar.length - 1].x == 301){
        bar.push({
            x: cvs.width - 1,
	y: 0,
	w: 60,
	h: (Math.random()*cvs.height)/2.5 + cvs.height*0.1,
	color: "green",
	gap: 200,
	v: 3
        });
    }
    
}
function moveBird() {
	bird.v += bird.g;
	bird.y += bird.v;
}

function birdJump() {
    flap.play();
	bird.v = -20; 
}

function checkCollision() {
    
 for (let i = 0; i < bar.length; i++) {   
if (bird.x + bird.w > bar[i].x && bird.x < bar[i].x + bar[i].w) {
		if (bird.y < bar[i].h + bar[i].y || bird.y + bird.h > bar[i].h + bar[i].y + bar[i].gap) {
			bar[i].color = "red";
            gameOver.play();
             alert("Game over. Your score was " + score );
            clearInterval(game);
		} else {
			bar[i].color = "lightgreen";
		};
	} else {
			bar[i].color = "lightgreen";
		} 
}
    if (bird.y + bird.h >= cvs.height || bird.y < 0){
                    gameOver.play();

        
        clearInterval(game);
        alert("Game over. Your score was " + score );
	/*	bird.y = cvs.height/2;
        bird.v = 0; */  
	}
}

document.addEventListener("keydown", gameControl);

function gameControl(event) {
    if (event.keyCode == 32) {
       pause = !pause;
    } else if (event.keyCode == 38) {
        birdJump();
    }
}


function ai() {
    if (aiPlaying) {
    if (bird.x < bar[0].x + 60) {
    if (bird.y + bird.h > bar[0].h + bar[0].gap - 25) {
        birdJump();
    }
  } else {
     if (bird.y + bird.h > bar[1].h + bar[1].gap - 25) {
        birdJump();
    } 
  }
}
}

let game = setInterval(draw, 1000/fps);