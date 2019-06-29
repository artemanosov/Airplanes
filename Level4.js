class Level4 extends Phaser.Scene{
  constructor(){
    super({key:"Level4"})
  }
  create(data){
    playerStats = data;
    thisGame = this;
    level = 4;
    //add background
    this.tileSprite = this.add.tileSprite(0,0,1200,600,'sky').setOrigin(0);

    //  Set the camera bounds to be the size of the image
    this.physics.world.setBounds(0, 0, 1200, 600);

    //create stats texts
    addStatsTexts(thisGame)


    //add game elements
    thisGame.player = this.physics.add.sprite(400,400,'player');
    thisGame.player.hp = playerStats.hp;
    thisGame.player.maxHP = playerStats.hp;
    thisGame.player.damage = playerStats.damage;
    thisGame.player.points = playerStats.points;
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

    //Create Interceptors
    this.interceptors = this.physics.add.group();
    this.physics.add.overlap(thisGame.player, this.interceptors, enemyCollide, null, this);

    //Create Destroyers
    this.destroyers = this.physics.add.group();
    this.physics.add.overlap(thisGame.player, this.destroyers, enemyCollide, null, this);

    //Create Bombers 2
    this.bombers2 = this.physics.add.group();
    this.physics.add.overlap(thisGame.player, this.bombers2, enemyCollide, null, this);

    //Create Strikers
    this.strikers = this.physics.add.group();
    this.physics.add.overlap(thisGame.player, this.strikers, enemyCollide, null, this);

    //ADD COLLECTIBLES
    //1. First Aid Kit
    //2. Shield
    //3. Fire rate upgrade
    //4. Gun upgrade
    //5. Time slowdown
    //6. Coins

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
    this.healthTimer = this.time.addEvent({ delay: 25000, callback: createHP, callbackScope: this, loop: true });
    this.shieldTimer = this.time.addEvent({ delay: 45000, callback: createShield, callbackScope: this, loop: true });
    this.gunUpTimer = this.time.addEvent({ delay: 55000, callback: createGunUpgrade, callbackScope: this, loop: true });
    this.fireRateTimer = this.time.addEvent({ delay: 40000, callback: createFireRate, callbackScope: this, loop: true });
    this.slowdownTimer = this.time.addEvent({delay: 40000, callback: createClock, callbackScope: this, loop: true });

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

    //set spawns of enemies
    //distance==300
    this.interTimer1 = this.time.addEvent({ delay: 3000, callback: sendInterceptor, callbackScope: this, loop: true });
    this.interTimer1.name = 'enemyTimer';
    this.interTimer1.active = true;
    this.timers.push(this.interTimer1);

    //distance == 295
    this.destrTimer1 = this.time.addEvent({ delay: 5000, callback: sendDestroyer, callbackScope: this, loop: true,paused:true });
    this.destrTimer1.name = 'enemyTimer';
    this.destrTimer1.active = false;
    this.timers.push(this.destrTimer1);


    //distance == 250 add destroyer and bomber 1
    this.strikerTimer1 = this.time.addEvent({ delay: 10000, callback: sendStriker, callbackScope: this, loop: true,paused:true });
    this.strikerTimer1.name = 'enemyTimer';
    this.strikerTimer1.active = false;
    this.timers.push(this.strikerTimer1);

    this.bomber2Timer1 = this.time.addEvent({ delay: 50000, callback: function(){
        sendBomber2(thisGame);
        this.time.delayedCall(3000, sendBomber2,[thisGame], this);
        this.time.delayedCall(6000, sendBomber2,[thisGame], this);
        this.time.delayedCall(9000, sendBomber2, [thisGame], this);
      }, callbackScope: this, loop: true });
    this.bomber2Timer1.name = 'enemyTimer';
    this.bomber2Timer1.active = true;
    this.timers.push(this.bomber2Timer1);


    //distance == 130, update destroyer and interceptor  delays, change bomber 1 to bomber 2
    this.destrTimer2 = this.time.addEvent({ delay: 10000, callback: sendDestroyer, callbackScope: this, loop: true,paused:true });
    this.destrTimer2.name = 'enemyTimer';
    this.destrTimer2.active = false;
    this.timers.push(this.destrTimer2);


    this.interTimer2 = this.time.addEvent({ delay: 8000, callback: sendInterceptor, callbackScope: this, loop: true,paused:true});
    this.interTimer2.name = 'enemyTimer';
    this.interTimer2.active = false;
    this.timers.push(this.interTimer2);

    //create distance timer
    distance = 300;
    this.distanceTimer = this.time.addEvent({delay: 1000, callback: function(){
      if(!paused)
        distance-=1

        //unpause and pause timers for enemy spawns depending on the distance
        if(distance == 295){
          this.destrTimer1.active = true;
          this.destrTimer1.paused = false;
        }else if(distance == 250){
          this.strikerTimer1.active = true;
          this.strikerTimer1.paused = false;
        }else if(distance == 130){
          this.destrTimer2.active = true;
          this.destrTimer2.paused = false;

          this.destrTimer1.active = false;
          this.destrTimer1.paused = true;

          this.interTimer2.active = true;
          this.interTimer2.paused = false;

          this.interTimer1.active = false;
          this.interTimer1.paused = true;
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
      updateStrikers(thisGame,toRemove);
      updateInterceptors(thisGame,toRemove);
      updateDestroyers(thisGame,toRemove);
      updateBombers2(thisGame,toRemove);
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
        updateStatsTexts(thisGame, distance);
      }

    }else{
      //when game ends
      if(!gameOver){
        this.time.removeAllEvents();
        thisGame.player.disableBody(true,true);
        var gameOverText = his.add.text(400,300,'GAME OVER',{fontSize: '50px', fill: '#000' });
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
            this.scene.stop("Level4");
          }, this);
        },[], this);
        gameOver = true;
        score = thisGame.player.points;
      }
    }

    if(distance==0){
      this.scene.start("Hangar",{
        hp:playerStats.hp,
        points:thisGame.player.points+playerStats.poins,
        speed:playerStats.speed,
        damage:playerStats.damage,
        coins:thisGame.player.coins+playerStats.coins,
        shield:playerStats.shield,
        slowdown:playerStats.slowdown,
        gunUp:playerStats.gunUp,
        fireRate:playerStats.fireRate,
        velocity:playerStats.velocity,
        nextLevel: 'Level5'});
      this.scene.stop("Level4");
    }
  }
}
