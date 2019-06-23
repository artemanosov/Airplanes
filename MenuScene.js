var thisGame;
var cursors;
//game objects
var player;
var newPlayer;

//game stats
var gameOver;
var distanceText;
var distance;
var scoreText;
var healthText;
var score
//collectibles
var healthPoints;
var shields;
var gunUpgrades;
var clocks;
var slowdown;
//effects
var explosions;
var sparkles;
//Level
var level;
var levelText;
var timeStarted;
//timers for enemies
var interTimer;
var destrTimer;
var bomber1Timer;
var bomber2Timer;

class MenuScene extends Phaser.Scene{
  constructor(){
    super({key:"MenuScene"})
  }
  preload(){
    this.load.image('sky', 'assets/bg.png');
    this.load.image('logo', 'assets/logo.png');
    this.load.spritesheet('player', 'assets/player.png', {frameWidth: 58, frameHeight: 70});
    this.load.spritesheet('cornduster', 'assets/cornduster.png', {frameWidth: 52, frameHeight: 60});
    this.load.spritesheet('interceptor', 'assets/interceptor.png', {frameWidth: 38, frameHeight: 70});
    this.load.spritesheet('destroyer', 'assets/destroyer.png', {frameWidth: 47, frameHeight: 80});
    this.load.spritesheet('kaboom', 'assets/explosion.png', {frameWidth: 64, frameHeight: 64});
    this.load.spritesheet('bulletHit', 'assets/sparkles.png', {frameWidth: 32, frameHeight: 32});
    this.load.image('bomber1', 'assets/bomber1.png');
    this.load.image('bomber2', 'assets/bomber2.png');
    this.load.image('striker', 'assets/striker.png');
    this.load.image('playerBullet', 'assets/playerBullet.png');
    this.load.image('enemyBullet', 'assets/enemyBullet.png');
    this.load.image('missile1', 'assets/missile.png');
    this.load.image('missile2', 'assets/missile2.png');
    this.load.image('health', 'assets/health.png');
    this.load.image('shield', 'assets/shield.png');
    this.load.image('gunUpgrade', 'assets/gunUpgrade.png');
    this.load.image('clock', 'assets/clock.png');
    this.load.image('particle', 'assets/particle.png');
  }
  create(){
    level = 0;
    //add background
    this.tileSprite = this.add.tileSprite(0,0,1200,600,'sky').setOrigin(0);
    this.add.image(600,300,'logo');
    this.add.text(400,500,'PRESS "S" TO START',{font: "40px Arial", fill: "#ff0044", align: "center" });

    //CREATE ANIMATIONS
    //create animation for the player's airplane
    this.anims.create({
      key: 'player',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
      frameRate: 30,
      repeat: -1
    });

    this.anims.create({
      key: 'cornduster',
      frames: this.anims.generateFrameNumbers('cornduster', { start: 0, end: 2 }),
      frameRate: 30,
      repeat: -1
    });

    this.anims.create({
      key: 'interceptor',
      frames: this.anims.generateFrameNumbers('interceptor', { start: 0, end: 2 }),
      frameRate: 30,
      repeat: -1
    });

    this.anims.create({
      key: 'destroyer',
      frames: this.anims.generateFrameNumbers('destroyer', { start: 0, end: 2 }),
      frameRate: 30,
      repeat: -1
    });

    this.anims.create({
      key: 'hit',
      frames: this.anims.generateFrameNumbers('bulletHit', { start: 0, end: 3 }),
      frameRate: 60,
      repeat: 0,
      hideOnComplete: true
    });

    this.anims.create({
      key: 'explode',
      frames: this.anims.generateFrameNumbers('kaboom', { start: 0, end: 15 }),
      frameRate: 30,
      repeat: 0,
      hideOnComplete: true
    });

    gameOver = false;
    score = 0;
    //start game scene when "S" is pressed
    this.input.keyboard.on('keyup_S', function(){
      this.scene.start("Level3");
      this.scene.stop("MenuScene");
    }, this);

  }
}
