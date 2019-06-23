class Level3 extends Phaser.Scene{
  constructor(){
    super({key:"Level3"})
  }
  create(){
    thisGame = this;
    level = 3;
    //add background
    this.tileSprite = this.add.tileSprite(0,0,1200,600,'sky').setOrigin(0);

    //  Set the camera bounds to be the size of the image
    this.physics.world.setBounds(0, 0, 1200, 600);

    //create stats texts
    distanceText = this.add.text(1000,5,'distance: 0',{fontSize: '20px', fill: '#000' });
    scoreText = this.add.text(5,5,'score: 0',{fontSize: '20px', fill: '#000' });
    healthText = this.add.text(550,5,'HP: 0',{fontSize: '20px', fill: '#000' });
    levelText = this.add.text(5,580,'Level: 1',{fontSize: '20px', fill: '#000' });

    //add game elements
    thisGame.player = this.physics.add.sprite(400,400,'player');
    thisGame.player.hp = 100;
    thisGame.player.damage = 10;
    thisGame.player.points = 0;
    thisGame.player.lastFired = 0;
    thisGame.player.fireDelay = 200;
    thisGame.player.shield = false;
    thisGame.player.setCollideWorldBounds(true);
    thisGame.player.setMaxVelocity(300);
    thisGame.player.anims.play('player', true);

    //CREATE BULLETS
    this.bullets = this.physics.add.group();

    //Create Corn Dusters
    this.corndusters = this.physics.add.group();
    this.physics.add.overlap(thisGame.player, this.corndusters, enemyCollide, null, this);

    //Create Strikers
    this.strikers = this.physics.add.group();
    this.physics.add.overlap(thisGame.player, this.strikers, enemyCollide, null, this);

    //Create Destroyers
    this.destroyers = this.physics.add.group();
    this.physics.add.overlap(thisGame.player, this.destroyers, enemyCollide, null, this);

    //Create Bombers 2
    this.bombers2 = this.physics.add.group();
    this.physics.add.overlap(thisGame.player, this.bombers2, enemyCollide, null, this);



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

    //level data
    distance = 200;
    this.time.addEvent({delay: 1000, callback: function(){distance-=1}, callbackScope: this, loop: true });
    this.time.addEvent({ delay: 1000, callback: sendDestroyer, callbackScope: this, loop: true });
  }

  update(){
    if(thisGame.player.hp>0){
      updatePlayer(thisGame);
      //create an array of enemies that are outside the world and must be removed
      var toRemove = new Array();

      //check if enemy of each type has negative x (enemy left the battlefield)
      //also, fire if needed
      updateCorndusters(thisGame,toRemove);
      updateDestroyers(thisGame,toRemove);
      updateBombers2(thisGame,toRemove);
      updateStrikers(thisGame,toRemove);
      updateBullets(thisGame,toRemove);
      updateParticles(thisGame,toRemove);

      console.log(this.particles.getLength())

      //update collectibles
      //!!!!!!! insert updatesm!!!!

      while(toRemove.length>0){
        var e = toRemove.pop();
        removeObject(this,e);
      }

      //background moves
      this.tileSprite.tilePositionX += 0.75;
      distanceText.text = 'distance: '+distance;
      scoreText.text = 'score: '+thisGame.player.points;
      healthText.text = 'HP: '+thisGame.player.hp;

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

    if(distance==0){
      level = 3;
      this.scene.start("Level3");
      this.scene.stop("ManuScene");
    }
  }
}
