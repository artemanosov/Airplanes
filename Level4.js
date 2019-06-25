class Level4 extends Phaser.Scene{
  constructor(){
    super({key:"Level4"})
  }
  create(){
    thisGame = this;
    level = 4;
    //add background
    this.tileSprite = this.add.tileSprite(0,0,1200,600,'sky').setOrigin(0);

    //  Set the camera bounds to be the size of the image
    this.physics.world.setBounds(0, 0, 1200, 600);

    //create stats texts
    distanceText = this.add.text(1000,5,'Boss HP: 0',{fontSize: '20px', fill: '#000' });
    scoreText = this.add.text(5,5,'score: 0',{fontSize: '20px', fill: '#000' });
    healthText = this.add.text(550,5,'HP: 0',{fontSize: '20px', fill: '#000' });
    levelText = this.add.text(5,580,'Level: 1',{fontSize: '20px', fill: '#000' });
    pauseText = this.add.text(400,300,'PAUSED',{fontSize: '50px', fill: '#000' });

    //add game elements
    thisGame.player = this.physics.add.sprite(400,400,'player');
    thisGame.player.hp = 100;
    thisGame.player.damage = 10;
    thisGame.player.points = 0;
    thisGame.player.lastFired = 0;
    thisGame.player.fireDelay = 200;
    thisGame.player.shield = false;
    thisGame.player.gunType = 'regular';
    thisGame.player.setCollideWorldBounds(true);
    thisGame.player.setMaxVelocity(300);
    thisGame.player.anims.play('player', true);

    //Create Boss
    thisGame.boss = this.physics.add.sprite(1250,200,'boss');
    thisGame.boss.anims.play('boss', true);
    thisGame.boss.hp = 1000;
    thisGame.boss.damage = 100;
    thisGame.boss.lastFired = 0;
    thisGame.boss.fireDelay = 700;
    thisGame.boss.setVelocityX(-30);
    thisGame.boss.setVelocityY(-30);
    thisGame.boss.direction = 'up';

    //CREATE BULLETS
    this.bullets = this.physics.add.group();

    //ADD COLLECTIBLES
    //1. First Aid Kit
    //2. Shield
    //3. Gun upgrade
    //4. Time slowdown

    //Create First Aid Kit
    this.healthPoints = this.physics.add.group();
    this.physics.add.overlap(thisGame.player, this.healthPoints, getCollectible, null, this);

    //Create Shield
    this.shields = this.physics.add.group();
    this.physics.add.overlap(thisGame.player, this.shields, getCollectible, null, this);

    //Create Fire Rate Upgrade
    this.fireRates = this.physics.add.group();
    this.physics.add.overlap(thisGame.player, this.fireRates, getCollectible, null, this);

    //Create Gun Upgrade
    this.gunUpgrades = this.physics.add.group();
    this.physics.add.overlap(thisGame.player, this.gunUpgrades, getCollectible, null, this);

    //Create Time Slowdown
    this.clocks = this.physics.add.group();
    this.physics.add.overlap(thisGame.player, this.clocks, getCollectible, null, this);
    slowdown = false;
    this.time.addEvent({delay: 1000, callback: createClock, callbackScope: this, loop: false });

    //Create particles
    this.particles = this.physics.add.group();
    this.physics.add.overlap(thisGame.player, this.particles, particleCollision, null, this);

    //CREATE EFFECTS
    //create Explosions
    this.explosions = this.physics.add.group({
      defaultKey: 'kaboom',
      maxSize: 20
    });

    //create Bullet Hits sparkles
    this.sparkles = this.physics.add.group({
      defaultKey: 'bulletHit',
      maxSize: 40
    });

    //add cursor keys
    cursors = this.input.keyboard.createCursorKeys();

    paused = false;
    this.input.keyboard.on('keyup_P', function(){
      paused = !paused;
    }, this);

  }
  update(){
    if(thisGame.player.hp>0){
      updatePlayer(thisGame);
      updateBoss(thisGame);
      //create an array of enemies that are outside the world and must be removed
      var toRemove = new Array();
      updateBullets(thisGame,toRemove);


      //console.log(this.bullets.getLength())

      //update collectibles
      //!!!!!!! insert updatesm!!!!

      while(toRemove.length>0){
        var e = toRemove.pop();
        removeObject(this,e);
      }

      //background moves
      this.tileSprite.tilePositionX += 0.75;
      distanceText.text = 'Boss HP: '+thisGame.boss.hp;
      scoreText.text = 'score: '+thisGame.player.points;
      healthText.text = 'HP: '+thisGame.player.hp;
      if(paused){
        pauseText.visible = true;
      }else{
        pauseText.visible = false;
      }

    }else{
      //when game ends
      if(!gameOver){
        this.time.removeAllEvents();
        thisGame.player.disableBody(true,true);
        this.add.text(400,300,'GAME OVER',{fontSize: '50px', fill: '#000' });
        //start game scene when "S" is pressed
        this.time.delayedCall(10000, function(){
          level = 0;
          this.scene.start("MenuScene");
          this.scene.stop("Level3");
        },[], this);
        gameOver = true;
        score = thisGame.player.points;
      }
    }
  }
}
