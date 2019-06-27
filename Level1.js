class Level1 extends Phaser.Scene{
  constructor(){
    super({key:"Level1"})
  }

  create(data){
    playerStats = data;
    thisGame = this;
    level = 1;
    //add background
    this.tileSprite = this.add.tileSprite(0,0,1200,600,'sky').setOrigin(0);

    //  Set the camera bounds to be the size of the image
    //this.cameras.main.setBounds(0, 0, 1200, 600);
    this.physics.world.setBounds(0, 0, 1200, 600);

    //create stats texts
    distanceText = this.add.text(1000,5,'distance: 0',{fontSize: '20px', fill: '#000' });
    scoreText = this.add.text(5,5,'score: 0',{fontSize: '20px', fill: '#000' });
    healthText = this.add.text(550,5,'HP: 0',{fontSize: '20px', fill: '#000' });
    levelText = this.add.text(5,580,'Level: 1',{fontSize: '20px', fill: '#000' });
    pauseText = this.add.text(400,300,'PAUSED',{fontSize: '50px', fill: '#000' });
    coinsText = this.add.text(550,580,'Coins:',{fontSize: '20px', fill: '#000' });

    //add game elements
    thisGame.player = this.physics.add.sprite(400,400,'player');
    thisGame.player.hp = 100;
    thisGame.player.maxHP = playerStats.hp;
    thisGame.player.damage = 10;
    thisGame.player.points = 0;
    thisGame.player.lastFired = 0;
    thisGame.player.fireDelay = 200;
    thisGame.player.shield = false;
    thisGame.player.coins = 0;
    thisGame.player.velocity = playerStats.velocity;
    thisGame.player.setCollideWorldBounds(true);
    thisGame.player.setMaxVelocity(300);
    thisGame.player.anims.play('player', true);



    //CREATE BULLETS
    this.bullets = this.physics.add.group();
    //CREATE ENEMIES:
    //1. Corn Duster
    //2. Interceptor
    //3. Bomber 1

    //Create Corn Dusters
    this.corndusters = this.physics.add.group();
    this.physics.add.overlap(thisGame.player, this.corndusters, enemyCollide, null, this);

    //Create Interceptors
    this.interceptors = this.physics.add.group();
    this.physics.add.overlap(thisGame.player, this.interceptors, enemyCollide, null, this);

    //Create Bombers 1
    this.bombers1 = this.physics.add.group();
    this.physics.add.overlap(thisGame.player, this.bombers1, enemyCollide, null, this);




    //ADD COLLECTIBLES
    //1. First Aid Kit
    //2. Shield
    //3. Gun upgrade
    //4. Fire Rates
    //5. Time Slowdown
    //6. Coins


    //Create First Aid Kit
    this.healthPoints = this.physics.add.group();
    this.physics.add.overlap(thisGame.player, this.healthPoints, getCollectible, null, this);

    //Create Shield
    this.shields = this.physics.add.group();
    this.physics.add.overlap(thisGame.player, this.shields, getCollectible, null, this);

    //Create Gun Upgrade
    this.gunUpgrades = this.physics.add.group();
    this.physics.add.overlap(thisGame.player, this.gunUpgrades, getCollectible, null, this);

    //Create Fire Rate Upgrade
    this.fireRates = this.physics.add.group();
    this.physics.add.overlap(thisGame.player, this.fireRates, getCollectible, null, this);

    //Create Time Slowdown
    this.clocks = this.physics.add.group();
    this.physics.add.overlap(thisGame.player, this.clocks, getCollectible, null, this);
    slowdown = false;

    //Create particles
    this.particles = this.physics.add.group();
    this.physics.add.overlap(thisGame.player, this.particles, particleCollision, null, this);

    //Create coins
    this.coins = this.physics.add.group();
    this.physics.add.overlap(thisGame.player, this.coins, getCollectible, null, this);

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

    //CONSTRUCT THE LEVEL (spawn enemies at certain times)

    this.timers = new Array();

    //set spawns of collectibles
    healthTimer = this.time.addEvent({ delay: 45000, callback: createHP, callbackScope: this, loop: true });
    shieldTimer = this.time.addEvent({ delay: 65000, callback: createShield, callbackScope: this, loop: true });
    gunUpTimer = this.time.addEvent({ delay: 550000, callback: createGunUpgrade, callbackScope: this, loop: true });
    fireRateTimer = this.time.addEvent({ delay: 40000, callback: createFireRate, callbackScope: this, loop: true });
    slowdownTimer = this.time.addEvent({delay: 75000, callback: createClock, callbackScope: this, loop: true });

    this.timers.push(healthTimer);
    this.timers.push(shieldTimer);
    this.timers.push(gunUpTimer);
    this.timers.push(fireRateTimer);
    this.timers.push(slowdownTimer);

    //set spawns for enemies

    //distance 200-180 spwan only corndusters every 3 seconds
    this.cornTimer1 = this.time.addEvent({ delay: 3000, callback: sendCornduster, callbackScope: this, loop: true });
    this.cornTimer1.name = 'enemyTimer';
    this.timers.push(this.cornTimer1);

    //distance 180-150 spawn corndusters every 3 seconds and interceptors every 5 seconds
    this.levelTimer1 = this.time.delayedCall(20000,function(){
      this.interTimer1 = this.time.addEvent({ delay: 5000, callback: sendInterceptor, callbackScope: this, loop: true });
      this.interTimer1.name = 'enemyTimer';
      this.timers.push(this.interTimer1);
      this.timers.pop(this.levelTimer1);
    },[],this);
    this.levelTimer1.name = 'enemyTimer';
    this.timers.push(this.levelTimer1);


    //distance 150-0 spwan corndusters every 6 secons, interceptors every 7 secons and groups of four bombers every 30 seconds
    this.levelTimer2 = this.time.delayedCall(50000,function(){
      //remove old timers
      this.timers.pop(this.interTimer1);
      this.interTimer1.remove(false);
      this.timers.pop(this.cornTimer1);
      this.cornTimer1.remove(false);

      //add new timers
      this.cornTimer2 = this.time.addEvent({ delay: 6000, callback: sendCornduster, callbackScope: this, loop: true });
      this.cornTimer2.name = 'enemyTimer';
      this.timers.push(this.cornTimer2);
      this.interTimer2 = this.time.addEvent({ delay: 7000, callback: sendInterceptor, callbackScope: this, loop: true });
      this.interTimer2.name = 'enemyTimer';
      this.timers.push(this.interTimer2);


      this.bomber1Timer = this.time.addEvent({ delay: 30000, callback: function(){
        sendBomber1(thisGame);
        this.time.delayedCall(3000, sendBomber1,[thisGame], this);
        this.time.delayedCall(6000, sendBomber1,[thisGame], this);
        this.time.delayedCall(9000, sendBomber1, [thisGame], this);
      }, callbackScope: this, loop: true });
      this.bomber1Timer.name = 'enemyTimer';
      this.timers.push(this.bomber1Timer);

      this.timers.pop(this.levelTimer2);
    },[],this)
    this.levelTimer2.name = 'enemyTimer';
    this.timers.push(this.levelTimer2);




    //create distance timer
    distance = 200;
    this.distanceTimer = this.time.addEvent({delay: 1000, callback: function(){
      if(!paused)
        distance-=1
    }, callbackScope: this, loop: true });
    this.timers.push(this.distanceTimer);
    this.distanceTimer.name = 'distanceTimer';


    //create pause
    paused = false;
    this.input.keyboard.on('keyup_P', function(){
      paused = !paused;
      if(paused){
        //if game is paused, puase all timers
        for(var i=0;i<this.timers.length;i++){
          this.timers[i].paused = true;
        }
      }else{
        //if game is upaused, restore all timers
        for(var k=0;k<this.timers.length;k++){
          this.timers[k].paused = false;
        }
      }
    }, this);
  }

  update(){
    if(thisGame.player.hp>0){
      //player moves
       updatePlayer(thisGame);

      //create an array of enemies that are outside the world and must be removed
      var toRemove = new Array();
      //check if enemy of each type has negative x (enemy left the battlefield)
      //also, fire if needed and play death animation if hp<=0
      updateCorndusters(thisGame,toRemove);
      updateInterceptors(thisGame,toRemove);
      updateBombers1(thisGame,toRemove);
      updateBullets(thisGame,toRemove);

      //update collectibles
      updateGunUpgrades(thisGame,toRemove);
      updateHealthPoints(thisGame,toRemove);
      updateShields(thisGame,toRemove);
      updateParticles(thisGame,toRemove);
      updateFireRates(thisGame,toRemove);
      updateCoins(thisGame,toRemove);
      updateSlowdowns(thisGame,toRemove);

      while(toRemove.length>0){
        var e = toRemove.pop();
        removeObject(this,e);
      }

      if(paused){
        pauseText.visible = true;
      }else{
        //if game is not paused
        pauseText.visible = false;
        //background moves
        if(slowdown){
          this.tileSprite.tilePositionX += 0.225;
        }
        else{
          this.tileSprite.tilePositionX += 0.75;
        }
        distanceText.text = 'distance: '+distance;
        scoreText.text = 'score: '+thisGame.player.points;
        healthText.text = 'HP: '+thisGame.player.hp;
        coinsText.text = 'Coins: '+thisGame.player.coins;
      }

    }else{
      //when game ends
      if(!gameOver){
        this.time.removeAllEvents();
        thisGame.player.disableBody(true,true);
        this.add.text(400,300,'GAME OVER',{fontSize: '50px', fill: '#000' });
        //start game scene when "S" is pressed
        this.time.delayedCall(10000, function(){
          this.scene.start("MenuScene");
          this.scene.stop("Level1");
        },[], this);
        gameOver = true;
        score = thisGame.player.points;
      }
    }

    if(distance==0){
      this.scene.start("Hangar",{
        hp:playerStats.hp,
        points:thisGame.player.points,
        speed:playerStats.speed,
        damage:playerStats.damage,
        coins:thisGame.player.coins,
        shield:playerStats.shild,
        slowdown:playerStats.slowdown,
        gunUp:playerStats.gunUp,
        fireRate:playerStats.fireRate,
        nextLevel: 'Level2'});
      this.scene.stop("Level1");
    }
  }
}
