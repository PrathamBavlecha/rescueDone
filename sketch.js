var hero,enemy;
var shootSpeed = 2
var projectileGRP
var enemyGroup
var health = 100;
var magazine = 50;
var gameState = "menu"
var enemiesKilled = 0
var wave = 1

function preload(){
  heroIdle = loadAnimation("Sprites/idle/adventurer-idle-00.png","Sprites/idle/adventurer-idle-01.png","Sprites/idle/adventurer-idle-02.png")
  enemyPurple = loadAnimation("Enemy/style_A/PNG/frame0000.png","Enemy/style_A/PNG/frame0001.png","Enemy/style_A/PNG/frame0002.png","Enemy/style_A/PNG/frame0003.png","Enemy/style_A/PNG/frame0004.png")
  backgroundIMG = loadImage("Sprites/backgrounds/background.jpg")
  heroRun = loadAnimation("Sprites/run/adventurer-run-00.png","Sprites/run/adventurer-run-01.png","Sprites/run/adventurer-run-02.png","Sprites/run/adventurer-run-03.png","Sprites/run/adventurer-run-04.png","Sprites/run/adventurer-run-05.png")
  bulletIMG = loadImage("bullet.png")
  infoIMG = loadImage("game_buttons/info.png")
  playIMG = loadImage("game_buttons/play.png")
  gameoverIMG = loadImage("game_buttons/gameover.png")
  princessIMG = loadImage("princess.png")
  hero2IMG = loadImage("Sprites/idle/adventurer-idle-00.png")
  bulletSound = loadSound("sounds/lasershot.wav")
  damage = loadSound("sounds/damag.wav")
  win = loadSound("sounds/win.wav")
  rescueIMG = loadImage("rescue.png")
}
function setup() {
  createCanvas(displayWidth,displayHeight-110);

  hero = createSprite(displayWidth/2,displayHeight/2,50,50)
  hero.addAnimation("idle",heroIdle)
  hero.addAnimation("run",heroRun)
  hero.friction = 0.99;
  hero.scale = 4
  hero.visible = false
  enemyGroup = new Group()
  projectileGRP = new Group()

  play = createSprite(displayWidth/2,displayHeight/2,50,50)
  play.addImage("play",playIMG)
  play.visible = false
  info = createSprite(displayWidth/2,displayHeight/2+100,50,50)
  info.addImage("Info",infoIMG)
  info.visible = false
   rescue = createSprite(displayWidth/2,displayHeight/4,50,50)
   rescue.addImage("rescue",rescueIMG)
   rescue.scale = 4
}

function draw() {
  background(backgroundIMG); 

 if(gameState==="menu"){
   play.visible = true
   info.visible = true

   if(mousePressedOver(play)){
    gameState="stage 1"
    play.visible = false
    info.visible = false
  }
  if(mousePressedOver(info)){
    gameState = "info"
    info.visible = false
    play.visible = false
  }

 }
 if(gameState==="info"){
  textSize(30)
textAlign(CENTER)
fill("white")
textFont("Garamond")
  text("This is a game about defeating the waves of enemies and rescuing the princess",width/2,280)
  text("Move the mouse within a certain distance of the hero to make him follow",width/2,320)
  text("Press the left mouse button to shoot",width/2,360)
  text("Press B to go back",width/2,400)

  if(keyDown("b")){
    gameState="menu"
  }
}
 
 if(gameState==="stage 1"){
   textSize(30)
   textAlign(CENTER)
   fill("lightgreen")
   textFont("fantasy")
   text("Health:"+health+"/100",displayWidth/10,100)
   fill("blue")
   text("Ammo:"+magazine+"/50",displayWidth-300,100)
   fill("red")
   text("Enemies Killed: "+enemiesKilled,displayWidth/2,150)
   textSize(50)
   fill("cyan")
   text("Wave:"+wave,displayWidth/2,50)

   hero.visible = true
   rescue.visible = false

 if(mouseX-hero.x < 400 && hero.x-mouseX < 400){
 hero.velocityX = (mouseX - hero.x) * 7
 hero.velocityY = (mouseY - hero.y) * 7
 }else{
   hero.velocity.x = 0
   hero.velocity.y = 0
   hero.changeAnimation("idle",heroIdle)
 }

if(hero.velocity.x !==0){
   hero.changeAnimation("run",heroIdle)
 }
 if(mouseX>hero.x){
   hero.mirrorX(1)
 }else{
   hero.mirrorX(-1)
 }

 if(keyDown("r")&&magazine===0){
   magazine = 50
 }

 if(mouseIsPressed&&magazine>0){
   shoot()
   bulletSound.play()
   console.log(magazine)
 }
 for (var i = 0; i<enemyGroup.length; i++){
 if(projectileGRP.isTouching(enemyGroup)){
   enemyGroup.get(i).destroy()
   enemiesKilled = enemiesKilled + 1
 }
}
  if(enemyGroup.isTouching(hero)){
    health = health - 10
    console.log(health)
    hero.x = displayWidth/2
    hero.y = displayHeight/2
    damage.play()
  }
if(health<=0){
  gameState = "over"
}
spawnEnemy()
if(wave === 1){
if(enemiesKilled>20){
  wave = 2
}
}

if(wave===2){
  enemiesKilled = 0
  health = 100
  wave = 2
  spawnEnemy2()
  if(wave===2){
    if(enemiesKilled>30){
      gameState = "won"
      win.play()
    }
  }
}


}
if(gameState==="over"){
  enemyGroup.destroyEach()
  hero.visible = false
  gameover = createSprite(displayWidth/2,displayHeight/4,50,50)
  gameover.addImage("gameover",gameoverIMG)
  gameover.scale = 10
}

if(gameState==="won"){
  enemyGroup.destroyEach()
  projectileGRP.destroyEach()
  hero.visible = false
  princess = createSprite(displayWidth/2+50,displayHeight/2,50,50)
  princess.addImage("princess",princessIMG)
  princess.scale = 0.2
  hero2 = createSprite(displayWidth/2-50,displayHeight/2-10,50,50)
  hero2.addImage("hero2",hero2IMG)
  hero2.scale = 4
  textSize(50)
   fill("cyan")
   textAlign(CENTER)
   textFont("fantasy")
  text("Congratulations! You have Rescued the Princess!",displayWidth/2,displayHeight/4)
}
drawSprites();
}



function shoot(){
  if(frameCount%3===0){
  var projectile = createSprite(hero.x,hero.y,10,10)
  if(mouseX>hero.x){
    projectile.velocityX = 20
    projectile.mirrorX(1)
  }else{
    projectile.velocityX = -20
    projectile.mirrorX(-1)
  }
  projectile.addImage("bullet",bulletIMG)
  projectileGRP.add(projectile)
  magazine = magazine-1
}
}

function spawnEnemy(){
  if(frameCount%100===0){
   var enemy = createSprite(0,Math.round(random(0,displayHeight-200)),10,10)
   enemy.debug = true
   enemy.setCollider("rectangle",0,0,20,20)
   if(Math.random(0,1)>0.5){
     enemy.x = 0
     enemy.velocityX = 5
     enemy.mirrorX(1)
   }else{
     enemy.x = displayWidth
     enemy.velocityX = -5
     enemy.mirrorX(-1)
   }
   enemy.lifetime = 400
   enemy.scale = 2
   enemy.addAnimation("purple",enemyPurple)
   enemyGroup.add(enemy)
  }}

  function spawnEnemy2(){
    if(frameCount%100===0){
     var enemy2 = createSprite(Math.round(random(0,displayHeight-200)),0,10,10)
     enemy2.setCollider("rectangle",0,0,30,30)
     if(Math.random(0,1)>0.5){
       enemy2.y = 0
       enemy2.velocityY = 7
      }else{
       enemy2.y = displayHeight
       enemy2.velocityY = -7
     }
     enemy2.lifetime = 400
     enemy2.scale = 3
     enemy2.addAnimation("green",enemyGreen)
     enemyGroup.add(enemy2)
    }}
 
