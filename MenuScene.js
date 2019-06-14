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

class MenuScene extends Phaser.Scene{
  constructor(){
    super({key:"MenuScene"})
  }
  preload(){
    this.load.image('sky', 'assets/bg.png');
    this.load.image('logo', 'assets/logo.png');
  }
  create(){
    //add background
    this.tileSprite = this.add.tileSprite(0,0,1200,600,'sky').setOrigin(0);
    this.add.image(600,300,'logo');
    this.add.text(400,500,'PRESS "S" TO START',{font: "40px Arial", fill: "#ff0044", align: "center" });

    //

    //start game scene when "S" is pressed
    this.input.keyboard.on('keyup_S', function(){
      this.scene.start("GameScene");
      this.scene.stop("MenuScene");
    }, this);

  }
}
