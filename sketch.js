var trex ,trex_running, ground, ground_img, inv_ground, cloud_img, trex_collided;
var restart, restart_img, gameover, over_img
var oneImg, twoImg, threeImg, fourImg, fiveImg, sixImg;
var score = 0;
var obs_group, clouds_group
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var jumpSound, checkSound, deathSound;

function preload(){
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  ground_img = loadImage("ground2.png")
  cloud_img = loadImage("cloud.png")
  
  oneImg = loadImage("obstacle1.png");
  twoImg = loadImage("obstacle2.png");
  threeImg = loadImage("obstacle3.png");
  fourImg = loadImage("obstacle4.png");
  fiveImg = loadImage("obstacle5.png");
  sixImg = loadImage("obstacle6.png");
  trex_collided = loadAnimation("trex_collided.png");
  restart_img = loadImage("restart.png");
  over_img = loadImage("gameOver.png");
  
  jumpSound = loadSound("jump.mp3")
  checkSound = loadSound("checkpoint.mp3")
  deathSound = loadSound("death.mp3") 
  
  obs_group = new Group();
  clouds_group = new Group();
}


function setup(){
  createCanvas(1188.5,200)
  
  //create a trex sprite
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running); 
  trex.addAnimation("collided", trex_collided)
  trex.scale = 0.5;
  trex.debug = false;
  trex.setCollider("rectangle", 0, 0, 45, 60);

  ground = createSprite(300, 190, 600, 20);
  ground.addImage(ground_img);
  inv_ground = createSprite(300, 198, 600, 20);
  inv_ground.visible = 0;
  
  restart = createSprite(450, 100, 20, 20);
  restart.addImage(restart_img);
  restart.scale = 0.75
  restart.visible = 0;

  gameover = createSprite(450, 50, 20, 20);
  gameover.addImage(over_img);
  gameover.visible = 0;
} 

function draw(){  
  background("white");
  //console.log(x);
  drawSprites();

  trex.collide(inv_ground); 
  
  text("Score: " + score, 850, 20);
  
  if (gameState === PLAY) {
    ground.velocityX = -(8 + (score/200));
    restart.visible = 0;
    gameover.visible = 0;
    
    if (keyDown("space") && trex.y >= 160) {
      trex.velocityY = -12;
      jumpSound.play();
    }
    
    trex.velocityY = trex.velocityY + 0.9;
    
    if (ground.x < 0) {
      ground.x = 1188.5;
    }
    
    // score = Math.round(frameCount/10)
    
    if (score < 1000) {
      if (frameCount % 3 === 0) {
        score++;
      }
    } else if (score > 1000 && score < 10000) {
      if (frameCount % 2 === 0) {
        score++;  
      }
    } else {
        if (frameCount % 1 === 0) {
        score++;
      } 
    }
    
    //console.log(frameCount)
    //console.log(getFrameRate())
    
    if (score % 100 === 0 && score > 0) {
      checkSound.play();
    }
    
    spawnClouds();
    spawnObstacles();
    
    if (trex.isTouching(obs_group)) {
      gameState = END;
      deathSound.play();
      
      // AI Part
      //trex.velocityY = -12;
      //jumpSound.play();
    }
    
  } else if (gameState === END) {
    ground.velocityX = 0;
    
    trex.changeAnimation("collided", trex_collided);
    trex.velocityX = 0;
    trex.velocityY = 0;
   
    obs_group.setVelocityXEach(0);
    clouds_group.setVelocityXEach(0);
    obs_group.setLifetimeEach(-1);
    clouds_group.setLifetimeEach(-1);
    
    restart.visible = 1;
    gameover.visible = 1;
    
    if (mousePressedOver(restart)) {
      reset();
    }
  }
}

function spawnClouds() {
  if (frameCount % 50 == 0) {
    cloud = createSprite(1190, Math.round(random(25, 70)), 10, 10)    
    cloud.velocityX = -8;
    cloud.addImage(cloud_img);
    cloud.scale = 0.75;
    cloud.lifetime = 160;
    trex.depth = cloud.depth + 1;
    clouds_group.add(cloud);
  }
}

function spawnObstacles() {
  var index = Math.round(random(1,6));
  if (frameCount % 70 === 0) {
    var obs = createSprite(900, 170, 20, 20);
    obs.scale = 0.55
    obs.velocityX = -(8 + (score/200));
    obs.lifetime = 160;
    obs_group.add(obs);  
    
    switch(index) {
      case 1:
        obs.addImage(oneImg);
        break;
      case 2:
        obs.addImage(twoImg);
        break;
      case 3:
        obs.addImage(threeImg);
        break;
      case 4:
        obs.addImage(fourImg);
        break;
      case 5:
        obs.addImage(fiveImg);
        break;
      case 6:
        obs.addImage(sixImg);
        break;
      default:
        break;
    } 
  }
}

function reset() {
  obs_group.destroyEach();
  clouds_group.destroyEach();
  gameState = PLAY;
  trex.changeAnimation("running", trex_running);
  score = 0;
}