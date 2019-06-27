var thisGame;
var cursors;
var playerStats;
//game stats
var gameOver;
var distanceText;
var distance;
var scoreText;
var healthText;
var coinsText;
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
var paused;
var pauseText;
//timers for enemies
var cornTimer;
var interTimer;
var destrTimer;
var bomber1Timer;
var bomber2Timer;
var distanceTimer;
var gunUpTimer;
var healthTimer;
var shieldTimer;
var slowdownTimer;
var fireRateTimer;


class MenuScene extends Phaser.Scene{
  constructor(){
    super({key:"MenuScene"})
  }
  preload(){
    this.load.image('sky', 'assets/bg.png');
    this.load.image('logo', 'assets/logo.png');
    this.load.image('hangarLogo', 'assets/hangarLogo.png');
    this.load.spritesheet('player', 'assets/player.png', {frameWidth: 58, frameHeight: 70});
    this.load.spritesheet('cornduster', 'assets/cornduster.png', {frameWidth: 52, frameHeight: 60});
    this.load.spritesheet('interceptor', 'assets/interceptor.png', {frameWidth: 38, frameHeight: 70});
    this.load.spritesheet('destroyer', 'assets/destroyer.png', {frameWidth: 47, frameHeight: 80});
    this.load.spritesheet('kaboom', 'assets/explosion.png', {frameWidth: 64, frameHeight: 64});
    this.load.spritesheet('bulletHit', 'assets/sparkles.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('lazer', 'assets/laser.png', {frameWidth: 16, frameHeight: 4});
    this.load.spritesheet('boss', 'assets/bossSprite.png', {frameWidth: 120, frameHeight: 232});
    this.load.spritesheet('boss2', 'assets/boss2.png', {frameWidth: 120, frameHeight: 232});
    this.load.spritesheet('coin', 'assets/coin.png', {frameWidth: 18, frameHeight: 18});
    this.load.image('shopClock', 'assets/shopClock.png');
    this.load.image('shopGunUp', 'assets/shopGunUp.png');
    this.load.image('shopShield', 'assets/shopShield.png');
    this.load.image('shopHealth', 'assets/shopHealth.png');
    this.load.image('shopFireRate', 'assets/shopFireRate.png');
    this.load.image('shopSpeedUp', 'assets/shopSpeedUp.png');
    this.load.image('shopDamage', 'assets/shopDamage.png');
    this.load.image('add', 'assets/add.png');
    this.load.image('subtract', 'assets/subtract.png');
    this.load.image('bomber1', 'assets/bomber1.png');
    this.load.image('bomber2', 'assets/bomber2.png');
    this.load.image('striker', 'assets/striker.png');
    this.load.image('playerBullet', 'assets/playerBullet.png');
    this.load.image('enemyBullet', 'assets/enemyBullet.png');
    this.load.image('missile1', 'assets/missile.png');
    this.load.image('missile2', 'assets/missile2.png');
    this.load.image('health', 'assets/health.png');
    this.load.image('shield', 'assets/shield.png');
    this.load.image('fireRate', 'assets/fireRate.png');
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

    this.anims.create({
      key: 'lazer',
      frames: this.anims.generateFrameNumbers('lazer', { start: 0, end: 32 }),
      frameRate: 50,
      repeat: 0,
    });

    this.anims.create({
      key: 'coin',
      frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'boss',
      frames: this.anims.generateFrameNumbers('boss', { start: 0, end: 2 }),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: 'boss2',
      frames: this.anims.generateFrameNumbers('boss2', { start: 0, end: 2 }),
      frameRate: 20,
      repeat: -1,
    });

    gameOver = false;
    score = 0;
    //start game scene when "S" is pressed
    this.input.keyboard.on('keyup_S', function(){
      //pass player's stats to the next scene
      this.scene.start("Level1",{hp:200,points:0,speed:1,velocity:1,damage:10,coins:0,shield:7000,slowdown:7000,gunUp:10000,fireRate:10000});
      this.scene.stop("MenuScene");
    }, this);

  }
}
