
//Canvas setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');//access to built in draw method
canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
ctx.font = '40px Georgia';
let gameSpeed = 1;
let gameOver = false;

//Mouse Interactivity
let canvasPosition = canvas.getBoundingClientRect();
  const mouse = {
      x: canvas.width/2,             //midscreen horizontal 
      y: canvas.height/2,          //midscreen vertical
              //mouse pressed or released
      click: false // just holds data
  }
  canvas.addEventListener('mousedown', function(event) {//mousedown event
      mouse.click = true;
      mouse.x = event.x - canvasPosition.left;
      mouse.y = event.y; - canvasPosition.top;
      //get x and y cordinates of every click 
  });
  canvas.addEventListener('mouseup', function(){
     mouse.click = false; //whenever mouseup event fires

  })

//Player
const playerLeft = new Image();
playerLeft.src = '/BubblePop/fishSpriteSheet/spritesheets/fish_swim_left.png';
const playerRight = new Image();
playerRight.src = '/BubblePop/fishSpriteSheet/spritesheets/fish_swim_right.png';

class Player { 
    constructor(){
        this.x = canvas.width;
        this.y = canvas.height/2;
        this.radius = 50; 
        this.angle = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.frame =0;
        this.spriteWidth = 498;//single frame from the sprite sheet 
        this.spriteHeight = 327;//height of single frame
    }
    update(){
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        let theta = Math.atan2(dy, dx);//since this runs
        this.angle = theta; //calculating the angle will be recalculated for every frame of the game
        if(mouse.x != this.x) {
            this.x -= dx/20;
        }
        if (mouse.y != this.y) {
            this.y-= dy/20;
        }// moving both left and right 
    }
    draw(){
       if (mouse.click) {
           ctx.lineWidth = 0.2;
           ctx.beginPath();               //startpoint for the line 
           ctx.moveTo(this.x, this.y);    //current player possition
           ctx.lineTo(mouse.x, mouse.y);
           ctx.stroke();
       }
       if (gameFrame % 10 == 0) {
        this.frame++;
        if(this.frame >= 12) this.frame = 0;
        if (this.frame == 3 || this. frame == 7 || this.frame == 11){
            this.frameX = 0;
        } else {
           this.frameX++;      
        }
        if (this.frame < 3) this.frameY = 0;//first row
        else if (this.frame < 7) this.frameY = 1;//second row
        else if (this.frame < 11) this.frameY = 2;//third row
        else this.frameY = 0;
    }
       //circle to represents the player character
     /*  ctx.fillStyle = 'red'; 
       ctx.beginPath(); //draw the circle 
       ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);// complete the radius
       ctx.fill();//draw the circle 
       ctx.closePath();
       ctx.fillRect(this.x,this.y,this.radius,10); */

       ctx.save();
       ctx.translate(this.x, this.y);
       ctx.rotate(this.angle);

       if (this.x >= mouse.x){
            ctx.drawImage(playerLeft, this.frameX * this.spriteWidth, this.frameY *        // crop 1 image from the sprite  
            this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 60, 0 - 45, this. 
            spriteWidth/4, this.spriteHeight/4); //put it where the player cicrle is
       } else {
            ctx.drawImage(playerRight, this.frameX * this.spriteWidth, this.frameY *        // crop 1 image from the sprite  
            this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 60, 0 - 45, this. 
            spriteWidth/4, this.spriteHeight/4); //put it where the player cicrle is
       }
       ctx.restore();

      
    }       
}
const player = new Player();

//Bubbles
const bubblesArray = [];
const bubbleImage = new Image();
bubbleImage.src = '/BubblePop/Bubblepoppinganimation--1e5z0i9m503y6h6428/bubble_pop_one/bubble_pop_frame_01.png'

class Bubble {
    constructor(){
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100; //making the bubbles always appear at the same vrtical possition
        this.radius = 50;
        this.speed = Math.random() * 5 + 1;
        this.distance; //track the distance betweeen each individual bubble and the player   
        this.counted = false;
        this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound 2';// ternary operator
       // if sound 1 is true then go to sund 2    // : = esle 
    }
    update(){
         //moves bubbles up in negative direction, 
        //depending on each individual bubble speed value
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx*dx + dy*dy); //track the distance betweeen each individual bubble and the player   
    }
    draw(){
        /*ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke(); */ // we comment this part of the code to hide the blue circles  and let only bubbles be vissible 
        ctx.drawImage(bubbleImage, this.x - 65, this.y - 65, this.radius * 2.6, this.radius * 2.6);
    // this . radius is for this.x and this.y , we  multyply by 2.6 to change the size of bubbles
    // and substrating 65 to put the bubble over the blue circlrs because of the collision
    }
 
}

const bubblePop1 = document.createElement('audio');
bubblePop1.src = '/BubblePop/sound/Plop.ogg';
const bubblePop2 = document.createElement('audio');
bubblePop2.src = '/BubblePop/sound/bubbles-single2.wav';


 function handleBubbles(){
    if(gameFrame % 50 == 0){//run this code every 50 frames{
        bubblesArray.push(new Bubble());
    }
    for (let i = 0; i < bubblesArray.length; i++) {
        bubblesArray[i].update();
        bubblesArray[i].draw();
        if (bubblesArray[i].y < 0 - bubblesArray[i].radius * 2) {             //fixing endlessly goig array 
            //adding "- this radius" to prevent bubbles from disapearing before they leave the screen 

            bubblesArray.splice(i, 1);         //splice will cut a element of the array after  index 
            i--;
        } else if (bubblesArray[i].distance < bubblesArray[i].radius + player.radius){// check the distance between the player and the bubbles 
           // the  bubblesArray[i].radius is the center point of the cycle that represent bubble
          // the  player. radius is the center point of the cycle that represents the player 
         // thsi 2 cyrcles collide when  the distance of the 2 cyrcles combined is less than [i] 
             if (!bubblesArray[i].counted){
               if (bubblesArray[i].sound == 'sound1'){
               bubblePop1.play();
           } else {
             bubblePop2.play();
           }
            score++; //when collision is detected score + 1
            bubblesArray[i].counted = true;
            bubblesArray.splice(i, 1); // removing bubbles after collision with the player
            i--;
        }
       }
     }
    
     
    for(let i = 0; i < bubblesArray.length; i++){ // its not a good practice to cycle trought same array twice 
   
    }
} 

//Repeating background
const background = new Image();
background.src = '/BubblePop/fishSpritesheet/background1.png';

const BG = {
    x1: 0,
    x2: canvas.width,
    y: 0,
    width:canvas.width,
    height: canvas.height// w and h to make sure we cover the entire game area 
}

function handleBackground(){
    BG.x1 -= gameSpeed;
    if (BG.x1 < -BG.width) BG.x1 = BG.width;
    //if BG completely disappeared set x1 to canvas width and will push it behind the right edge
    BG.x2 -= gameSpeed;
    if (BG.x2 < -BG.width) BG.x2 = BG.width;
    ctx.drawImage(background, BG.x1, BG.y, BG.width, BG.height);
    ctx.drawImage(background, BG.x2, BG.y, BG.width, BG.height);//x2 bcs starting possition will be canvas width
}

//Enemies 
const enemyImage = new Image();
enemyImage.src = '/BubblePop/Fishgameasset/spritesheets/enemy1.png';

class Enemy {
    constructor(){
        this.x = canvas.width + 200; // horisontal x cordinate; enemy possition when game first loads
        this.y = Math.random() * (canvas.height - 150) + 90;
        this.radius = 60;
        this.speed = Math.random() * 2 + 2;
        this.frame = 0;// will be number between 0-12 bcs the spritesheet has 12 frames 
        this.frameX = 0;// because of four columns
        this.frameY = 0;// because of four rows
        this.spriteWidth = 418;
        this.spriteHeight = 397;
    }
    draw() {
       /* ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill(); */
        ctx.drawImage(enemyImage, this.frameX * this.spriteWidth, this.frameY * this.
            spriteHeight, this.spriteWidth, this.spriteHeight, this.x - 60, this.y - 70, this.
            spriteWidth / 3, this.spriteHeight / 3);// the las 4 arg will take the croped out media and place it in the front cordinates on the canv
    }// that determine rectangle area we want to crop out from the original spritesheet
    update(){//update enemy possition for each frame of animation
        this.x -= this.speed;//enemy swims from right to left 
        if(this.x < 0 - this.radius * 2){ // if enemy dissapear in left edge 
            this.x = canvas.width + 200;// respawn it back to the right edge 
            this.y = Math.random() * (canvas.height - 150) + 90;
            this.speed = Math.random() * 2 + 2;// different path and speed
        }
        if (gameFrame % 5 == 0) {
            this.frame++;
            if(this.frame >= 12) this.frame = 0;
            if (this.frame == 3 || this. frame == 7 || this.frame == 11){
                this.frameX = 0;
            } else {
               this.frameX++;      
            }
            if (this.frame < 3) this.frameY = 0;//first row
            else if (this.frame < 7) this.frameY = 1;//second row
            else if (this.frame < 11) this.frameY = 2;//third row
            else this.frameY = 0;
        }
        //collision with player
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.radius + player.radius) {
            handleGameOver();
        }
    }
}
const enemy1 = new Enemy();
function handleEnemies(){
    enemy1.update();
    enemy1.draw();
}

function handleGameOver(){
    ctx.fillStyle = 'white';
    ctx.fillText('GAME OVER! Your Score: ' + score, 130, 250);
    gameOver = true; 
}

//Animation Loop
function animate(){ 
    ctx.clearRect(0, 0, canvas.width, canvas.height);  //to stop player leaving trail 
    handleBackground();
    handleBubbles();
    player.update();// calculate player possition
    player.draw(); // draw line between player and mouse and draw the cyrcle
    handleEnemies();// to make sure this code runs for every frame of animation
    ctx.fillStyle = 'black' ;
    ctx.fillText('score: ' + score, 10, 50);
    gameFrame++;
    if (!gameOver) requestAnimationFrame(animate);
 }
 animate();
 
 
 /* *** ***** **** **** 4:08 *** ***** **** **** */
 
 window.addEventListener('resize', function(){
    canvasPosition = canvas.getBoundingClientRect();
  });

 
