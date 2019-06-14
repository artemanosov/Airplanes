
var cursors;
//game objects
var player;
var corndusters;
var interceptors;
var destroyers;
var bombers1;
var bombers2;
var bullets;
//game stats
var gameOver;
var distanceText;
var distance = 0;
var scoreText;
var healthText;
//collectibles
var healthPoints;
var shields;
var gunUpgrades;
//effects
var explosions;
var sparkles;

class GameScene extends Phaser.Scene{
  constructor(){
    super({key:"GameScene"})
  }
  preload(){
    this.load.spritesheet('player', 'assets/player.png', {frameWidth: 58, frameHeight: 70});
    this.load.spritesheet('cornduster', 'assets/cornduster.png', {frameWidth: 52, frameHeight: 60});
    this.load.spritesheet('interceptor', 'assets/interceptor.png', {frameWidth: 38, frameHeight: 70});
    this.load.spritesheet('destroyer', 'assets/destroyer.png', {frameWidth: 47, frameHeight: 80});
    this.load.spritesheet('kaboom', 'assets/explosion.png', {frameWidth: 64, frameHeight: 64});
    this.load.spritesheet('bulletHit', 'assets/sparkles.png', {frameWidth: 32, frameHeight: 32});
    this.load.image('bomber1', 'assets/bomber1.png');
    this.load.image('bomber2', 'assets/bomber2.png');
    this.load.image('playerBullet', 'assets/playerBullet.png');
    this.load.image('enemyBullet', 'assets/enemyBullet.png');
    this.load.image('missile1', 'assets/missile.png');
    this.load.image('missile2', 'assets/missile2.png');
    this.load.image('health', 'assets/health.png');
    this.load.image('shield', 'assets/shield.png');
    this.load.image('gunUpgrade', 'assets/gunUpgrade.png');
  }

  create(){
    //add background
    this.tileSprite = this.add.tileSprite(0,0,1200,600,'sky').setOrigin(0);
    this.add.image(600,300,'logo');

  }
}
