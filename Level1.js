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
    addStatsTexts(thisGame);


    //add game elements
    thisGame.player = this.physics.add.sprite(400,400,'player');
    thisGame.player.hp = -1;
    thisGame.player.maxHP = playerStats.hp;
    thisGame.player.damage = 10;
    thisGame.player.points = 0;
    thisGame.player.lastFired = 0;
    thisGame.player.fireDelay = 200;
    thisGame.player.coins = 0;
    thisGame.player.velocity = playerStats.velocity;
    thisGame.player.setCollideWorldBounds(true);
    thisGame.player.setMaxVelocity(300);
    thisGame.player.anims.play('player', true);

    shieldOn = false;
    gunUpOn = false;
    fireUpOn = false;
    slowdown = false;



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
    this.healthTimer = this.time.addEvent({ delay: 45000, callback: createHP, callbackScope: this, loop: true });
    this.shieldTimer = this.time.addEvent({ delay: 65000, callback: createShield, callbackScope: this, loop: true });
    this.gunUpTimer = this.time.addEvent({ delay: 55000, callback: createGunUpgrade, callbackScope: this, loop: true });
    this.fireRateTimer = this.time.addEvent({ delay: 40000, callback: createFireRate, callbackScope: this, loop: true });
    this.slowdownTimer = this.time.addEvent({delay: 75000, callback: createClock, callbackScope: this, loop: true });

    this.timers.push(this.healthTimer);
    this.timers.push(this.shieldTimer);
    this.timers.push(this.gunUpTimer);
    this.timers.push(this.fireRateTimer);
    this.timers.push(this.slowdownTimer);

    this.healthTimer.active = true;
    this.shieldTimer.active = true;
    this.gunUpTimer.active = true;
    this.fireRateTimer.active = true;
    this.slowdownTimer.active = true;

    //set spawns for enemies

    //distance 200-180 spwan only corndusters every 3 seconds
    this.cornTimer1 = this.time.addEvent({ delay: 3000, callback: sendCornduster, callbackScope: this, loop: true });
    this.cornTimer1.name = 'enemyTimer';
    this.cornTimer1.active = true;
    this.timers.push(this.cornTimer1);

    //distance 180-150 spawn corndusters every 5 seconds and interceptors every 5 seconds
    this.interTimer1 = this.time.addEvent({ delay: 5000, callback: sendInterceptor, callbackScope: this, loop: true,paused:true});
    this.interTimer1.name = 'enemyTimer';
    this.interTimer1.active = false;
    this.timers.push(this.interTimer1);


    //distance 150-0 spwan corndusters every 6 secons, interceptors every 7 secons and groups of four bombers every 30 seconds

      //add new timers
    this.cornTimer2 = this.time.addEvent({ delay: 6000, callback: sendCornduster, callbackScope: this, loop: true,paused:true });
    this.cornTimer2.name = 'enemyTimer';
    this.cornTimer2.active = false;
    this.timers.push(this.cornTimer2);
    this.interTimer2 = this.time.addEvent({ delay: 7000, callback: sendInterceptor, callbackScope: this, loop: true,paused:true });
    this.interTimer2.name = 'enemyTimer';
    this.interTimer2.active = false;
    this.timers.push(this.interTimer2);


    this.bomber1Timer = this.time.addEvent({ delay: 50000, callback: function(){
        sendBomber1(thisGame);
        this.time.delayedCall(3000, sendBomber1,[thisGame], this);
        this.time.delayedCall(6000, sendBomber1,[thisGame], this);
        this.time.delayedCall(9000, sendBomber1, [thisGame], this);
      }, callbackScope: this, loop: true });
    this.bomber1Timer.name = 'enemyTimer';
    this.bomber1Timer.active = false;
    this.timers.push(this.bomber1Timer);




    //create distance timer
    distance = 200;
    this.distanceTimer = this.time.addEvent({delay: 1000, callback: function(){
      if(!paused)
        distance-=1

      if (distance == 180){
        this.interTimer1.active = true;
        this.interTimer1.paused = false;

      }else if(distance == 150){
        this.interTimer2.active = true;
        this.interTimer2.paused = false;

        this.interTimer1.active = false;
        this.interTimer1.paused = true;

        this.cornTimer2.active = true;
        this.cornTimer2.paused = false;

        this.cornTimer1.active = false;
        this.cornTimer1.paused = true;

        this.bomber1Timer.active = true;
        this.bomber1Timer.paused = false;
      }
    }, callbackScope: this, loop: true });
    this.timers.push(this.distanceTimer);
    this.distanceTimer.active = true;
    this.distanceTimer.name = 'distanceTimer';


    //create pause
    paused = false;
    this.input.keyboard.on('keyup_P', function(){
      paused = !paused;
      if(paused){
        for(var k=0;k<this.timers.length;k++){
          if(this.timers[k].active)
            this.timers[k].paused = true;
        }
      }else{
        for(var k=0;k<this.timers.length;k++){
          if(this.timers[k].active)
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
        showPauseText();
      }else{
        //if game is not paused
        hidePauseText();
        //background moves
        if(slowdown){
          this.tileSprite.tilePositionX += 0.225;
        }
        else{
          this.tileSprite.tilePositionX += 0.75;
        }
        updateStatsTexts(thisGame, distance);
      }

    }else{
      //when game ends
      if(!gameOver){
        this.time.removeAllEvents();
        thisGame.player.disableBody(true,true);
        var gameOverText = this.add.text(400,300,'GAME OVER',{fontSize: '50px', fill: '#000' });
        //start game scene when "S" is pressed

        this.time.delayedCall(4000, function(){
          gameOverText.visible = false;
          playerStats.points = thisGame.player.points;
          showForm();
          this.add.text(400,500,'PRESS "S" TO RETRUN TO MAIN MENU',{fontSize: '25px', fill: '#000' });
          this.input.keyboard.on('keyup_S', function(){
            document.getElementById('leaderboard').style.display = "none";
            document.getElementById('leaderboard').innerHTML = '';
            this.scene.start("MenuScene");
            this.scene.stop("Level1");
          }, this);
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
        shield:playerStats.shield,
        slowdown:playerStats.slowdown,
        gunUp:playerStats.gunUp,
        fireRate:playerStats.fireRate,
        velocity:playerStats.velocity,
        nextLevel: 'Level2'});
      this.scene.stop("Level1");
    }
  }
}
