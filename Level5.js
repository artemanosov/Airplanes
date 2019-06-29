class Level5 extends Phaser.Scene{
  constructor(){
    super({key:"Level5"})
  }
  create(data){
    playerStats = data;
    thisGame = this;
    level = 5;
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

    //Create Boss
    thisGame.boss = this.physics.add.sprite(1250,200,'boss2');
    thisGame.boss.anims.play('boss2', true);
    thisGame.boss.hp = 10000;
    thisGame.boss.damage = 100;
    thisGame.boss.lastFired = 0;
    thisGame.boss.fireDelay = 700;
    thisGame.boss.setVelocityX(-30);
    thisGame.boss.setVelocityY(-30);
    //addons to boss1
    thisGame.boss.direction = 'up';
    thisGame.boss.fireAngle = 180;
    thisGame.boss.fireDirection = 'up';
    thisGame.boss.modified = false;

    //CREATE BULLETS
    this.bullets = this.physics.add.group();

    //Create strikers
    this.strikers = this.physics.add.group();
    this.physics.add.overlap(thisGame.player, this.strikers, enemyCollide, null, this);

    //Create Destroyers
    this.destroyers = this.physics.add.group();
    this.physics.add.overlap(thisGame.player, this.destroyers, enemyCollide, null, this);

    //Create Bombers 2
    this.bombers2 = this.physics.add.group();
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

    this.timers = new Array();

    //set spawns of collectibles
    this.healthTimer = this.time.addEvent({ delay: 30000, callback: createHP, callbackScope: this, loop: true });
    this.shieldTimer = this.time.addEvent({ delay: 25000, callback: createShield, callbackScope: this, loop: true });
    this.gunUpTimer = this.time.addEvent({ delay: 60000, callback: createGunUpgrade, callbackScope: this, loop: true });
    this.fireRateTimer = this.time.addEvent({ delay: 40000, callback: createFireRate, callbackScope: this, loop: true });
    this.slowdownTimer = this.time.addEvent({delay: 45000, callback: createClock, callbackScope: this, loop: true });//75

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

    //count spwaned waves
    var count = -1;

    distance = this.boss.hp;
    //level data
    this.distanceTimer = this.time.addEvent({delay: 10, callback: function(){
      if(this.boss.hp<9500 && count==-1){
        spawnParticles(thisGame,this.boss.x,this.boss.y);
        this.time.delayedCall(1000, sendDestroyer,[], this);
        this.time.delayedCall(1500, sendDestroyer,[], this);
        this.time.delayedCall(2000, sendDestroyer,[], this);

        count++;
      }else if(this.boss.hp<9000 && count==0){
        spawnParticles(thisGame,this.boss.x,this.boss.y);
        this.time.delayedCall(1000, sendDestroyer,[], this);
        this.time.delayedCall(1500, sendDestroyer,[], this);
        this.time.delayedCall(2000, sendDestroyer,[], this);
        this.time.delayedCall(2500, sendDestroyer,[], this);
        count++;
      }
      else if(this.boss.hp<8500 && count==1){
        this.time.delayedCall(1000, sendDestroyer,[], this);
        this.time.delayedCall(1500, sendDestroyer,[], this);
        this.time.delayedCall(2000, sendDestroyer,[], this);
        this.time.delayedCall(2500, sendDestroyer,[], this);
        count++;
      }
      else if(this.boss.hp<8000 && count==2){
        this.time.delayedCall(1000, sendDestroyer,[], this);
        this.time.delayedCall(1500, sendDestroyer,[], this);
        this.time.delayedCall(2000, sendStriker,[], this);
        this.time.delayedCall(2500, sendDestroyer,[], this);
        count++;
      }
      else if(this.boss.hp<7500 && count==3){
        this.time.delayedCall(1000, sendStriker,[], this);
        count++;
      }else if(this.boss.hp<7000 && count==4){
        this.time.delayedCall(1000, sendDestroyer,[], this);
        this.time.delayedCall(1500, sendDestroyer,[], this);
        this.time.delayedCall(2000, sendDestroyer,[], this);
        this.time.delayedCall(2500, sendDestroyer,[], this);
        count++;
      }
      else if(this.boss.hp<6500 && count==5){
        this.time.delayedCall(1000, sendStriker,[], this);
        count++;
      }else if(this.boss.hp<6000 && count==6){
        this.time.delayedCall(1000, sendStriker,[], this);
        this.time.delayedCall(2000, sendDestroyer,[], this);
        this.time.delayedCall(2500, sendDestroyer,[], this);
        count++;
      }else if(this.boss.hp<5500 && count==7){
        this.time.delayedCall(1000, sendDestroyer,[], this);
        this.time.delayedCall(1500, sendDestroyer,[], this);
        this.time.delayedCall(2000, sendDestroyer,[], this);
        this.time.delayedCall(2500, sendDestroyer,[], this);
        count++;
      }else if(this.boss.hp<5000 && count==8){
        this.time.delayedCall(1000, sendStriker,[], this);
        this.time.delayedCall(2500, sendStriker,[], this);
        count++;
      }
      else if(this.boss.hp<4500 && count==9){
        this.time.addEvent({ delay: 1000, callback: function(){
          sendBomber2(thisGame);
          this.time.delayedCall(3000, sendBomber2,[thisGame], this);
          this.time.delayedCall(6000, sendBomber2,[thisGame], this);
          this.time.delayedCall(9000, sendBomber2, [thisGame], this);
        }, callbackScope: this, loop: false });
        count++;
      }else if(this.boss.hp<4000 && count==10){
        this.time.addEvent({ delay: 1000, callback: function(){
          sendBomber2(thisGame);
          this.time.delayedCall(3000, sendBomber2,[thisGame], this);
          this.time.delayedCall(6000, sendBomber2,[thisGame], this);
          this.time.delayedCall(9000, sendBomber2, [thisGame], this);
        }, callbackScope: this, loop: false });
        count++;
      }
      else if(this.boss.hp<3500 && count==11){
        this.time.delayedCall(1000, sendDestroyer,[], this);
        this.time.delayedCall(3500, sendDestroyer,[], this);
        this.time.delayedCall(4500, sendDestroyer,[], this);
        count++;
      }else if(this.boss.hp<3000 && count==12){
        this.time.delayedCall(1000, sendStriker,[], this);
        this.time.delayedCall(3000, sendDestroyer,[], this);
        this.time.delayedCall(3500, sendStriker,[], this);
        this.time.delayedCall(4000, sendDestroyer,[], this);
        count++;
      }
      else if(this.boss.hp<2500 && count==13){
        this.time.addEvent({ delay: 1000, callback: function(){
          sendBomber2(thisGame);
          this.time.delayedCall(3000, sendBomber2,[thisGame], this);
          this.time.delayedCall(6000, sendBomber2,[thisGame], this);
          this.time.delayedCall(9000, sendBomber2, [thisGame], this);
        }, callbackScope: this, loop: false });
        count++;
      }else if(this.boss.hp<1500 && count==14){
        this.time.delayedCall(1000, sendDestroyer,[], this);
        this.time.delayedCall(1500, sendDestroyer,[], this);
        this.time.delayedCall(2000, sendDestroyer,[], this);
        count++;
      }
      else if(this.boss.hp<500 && count==15){
        this.time.addEvent({ delay: 1000, callback: function(){
          sendBomber2(thisGame);
          this.time.delayedCall(3000, sendBomber2,[thisGame], this);
          this.time.delayedCall(6000, sendBomber2,[thisGame], this);
          this.time.delayedCall(9000, sendBomber2, [thisGame], this);
        }, callbackScope: this, loop: false });
        count++;
      }
    }, callbackScope: this, loop: true });
    this.distanceTimer.active = true;
    this.distanceTimer.name = 'distanceTimer';
    this.timers.push(this.distanceTimer);

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
      distance = this.boss.hp;
      updatePlayer(thisGame);
      updateBoss2(thisGame);
      //create an array of enemies that are outside the world and must be removed
      var toRemove = new Array();

      //check if enemy of each type has negative x (enemy left the battlefield)
      //also, fire if needed
      debugger
      updateDestroyers(thisGame,toRemove);
      updateBombers2(thisGame,toRemove);
      updateStrikers(thisGame,toRemove);
      updateBullets(thisGame,toRemove);
      updateParticles(thisGame,toRemove);


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
            this.scene.stop("Level5");
          }, this);
        },[], this);
        gameOver = true;
        score = thisGame.player.points;
      }
    }

    if(distance<0 && !gameOver){
      var congrats = this.add.text(400,300,'GAME COMPLETED',{fontSize: '50px', fill: '#000' });
      this.time.delayedCall(4000, function(){
        congrats.visible = false;
        playerStats.points = thisGame.player.points;
        showForm();
        this.add.text(400,500,'PRESS "S" TO RETRUN TO MAIN MENU',{fontSize: '25px', fill: '#000' });
        this.input.keyboard.on('keyup_S', function(){
          document.getElementById('leaderboard').style.display = "none";
          document.getElementById('leaderboard').innerHTML = '';
          this.scene.start("MenuScene");
          this.scene.stop("Level5");
        }, this);
      },[], this);
      gameOver = true;
      score = thisGame.player.points;
    }
  }
}
