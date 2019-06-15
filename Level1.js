class Level1 extends Phaser.Scene{
  constructor(){
    super({key:"Level1"})
  }

  create(){
    thisGame = this;

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

    //add game elements
    thisGame.player = this.physics.add.sprite(400,400,'player');
    thisGame.player.hp = 2000000000;
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
    //CREATE ENEMIES:
    //1. Corn Duster
    //2. Interceptor
    //3. Destroyer
    //4. Bomber 1
    //5. Bomber 2

    //Create Corn Dusters
    this.corndusters = this.physics.add.group();
    this.physics.add.overlap(thisGame.player, this.corndusters, enemyCollide, null, this);

    //Create Interceptors
    this.interceptors = this.physics.add.group();
    this.physics.add.overlap(thisGame.player, this.interceptors, enemyCollide, null, this);

    //Create Destroyers
    this.destroyers = this.physics.add.group();
    this.physics.add.overlap(thisGame.player, this.destroyers, enemyCollide, null, this);

    //Create Bombers 1
    this.bombers1 = this.physics.add.group();
    this.physics.add.overlap(thisGame.player, this.bombers1, enemyCollide, null, this);

    //Create Bombers 2
    this.bombers2 = this.physics.add.group();
    this.physics.add.overlap(thisGame.player, this.bombers2, enemyCollide, null, this);


    //ADD COLLECTIBLES
    //1. First Aid Kit
    //2. Shield
    //3. Gun upgrade

    //Create First Aid Kit
    this.healthPoints = this.physics.add.group();
    this.physics.add.overlap(thisGame.player, this.healthPoints, getCollectible, null, this);

    //Create Shield
    this.shields = this.physics.add.group();
    this.physics.add.overlap(thisGame.player, this.shields, getCollectible, null, this);

    //Create Gun Upgrade
    this.gunUpgrades = this.physics.add.group();
    this.physics.add.overlap(thisGame.player, this.gunUpgrades, getCollectible, null, this);

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


    //set spawns of enemies
    this.time.addEvent({ delay: 3000, callback: sendCornduster, callbackScope: this, loop: true });
    this.time.addEvent({ delay: 2000, callback: sendInterceptor, callbackScope: this, loop: true });
    this.time.addEvent({ delay: 4000, callback: sendDestroyer, callbackScope: this, loop: true });
    //this.time.addEvent({ delay: 10000, callback: sendBombers1, callbackScope: this, loop: false });
    //this.time.addEvent({ delay: 5000, callback: function(){
      //sendBomber1(thisGame);
      //this.time.delayedCall(3000, sendBomber1,[thisGame], this);
      //this.time.delayedCall(6000, sendBomber1,[thisGame], this);
      //this.time.delayedCall(9000, sendBomber1, [thisGame], this);
    //}, callbackScope: this, loop: true });
    //this.time.addEvent({ delay: 10000, callback: sendBombers2, callbackScope: this, loop: false });
    //this.time.addEvent({ delay: 5000, callback: function(){
      //sendBomber2(thisGame);
      //this.time.delayedCall(3000, sendBomber2,[thisGame], this);
      //this.time.delayedCall(6000, sendBomber2,[thisGame], this);
      //this.time.delayedCall(9000, sendBomber2, [thisGame], this);
    //}, callbackScope: this, loop: true });

    //set spawns of collectibles
    this.time.addEvent({ delay: 25000, callback: createHP, callbackScope: this, loop: true });
    this.time.addEvent({ delay: 20000, callback: createShield, callbackScope: this, loop: true });
    this.time.addEvent({ delay: 15000, callback: createGunUpgrade, callbackScope: this, loop: true });

    //add cursor keys
    cursors = this.input.keyboard.createCursorKeys();

    //level data
    distance = 1000;
    this.time.addEvent({delay: 1000, callback: function(){distance-=1}, callbackScope: this, loop: true });
  }

  update(){
    if(!gameOver){
      //player moves

       if (cursors.left.isDown)
      {
          thisGame.player.setVelocityX(-200);
      }
      else if (cursors.right.isDown)
      {
          thisGame.player.setVelocityX(200);
      }
      else
      {
          thisGame.player.setVelocityX(0);

      }

      if (cursors.up.isDown)
      {
          thisGame.player.setVelocityY(-300);
          if(thisGame.player.rotation >= -0.5){
            thisGame.player.rotation -= 0.1;
          }
      }
      else if(cursors.down.isDown){
         thisGame.player.setVelocityY(300)
         if(thisGame.player.rotation <= 0.5){
           thisGame.player.rotation += 0.1;
         }
      }
      else{
         thisGame.player.setVelocityY(0);
         if(thisGame.player.rotation > 0){
           thisGame.player.rotation -= 0.1;
           if(thisGame.player.rotation < 0){
             thisGame.player.rotation = 0;
           }
         }else if(thisGame.player.rotation < 0){
           thisGame.player.rotation +=0.1;
           if(thisGame.player.rotation > 0){
             thisGame.player.rotation = 0;
           }
         }
      }


      //make player fire bullets
      if((this.time.now-thisGame.player.lastFired)>thisGame.player.fireDelay){
        //debugger
        fire(this,thisGame.player.x+30, thisGame.player.y, thisGame.player.angle, 600, 'playerBullet');
        thisGame.player.lastFired = this.time.now;
      }

      //create an array of enemies that are outside the world and must be removed
      var toRemove = new Array();

      //check if enemy of each type has negative x (enemy left the battlefield)
      //also, fire if needed
      this.corndusters.children.iterate(function(child){
        if(child.x < -20 || child.hp<=0){
          toRemove.push(child);
        }else{
          var angle = child.ang;
          if(child.direction == 'down'){
            if(angle <= 134){
              child.direction = 'up';
            }
            angle -= 1;

            thisGame.physics.velocityFromAngle(angle, 200, child.body.velocity);
          }else{
            if(angle >= 224){
              child.direction = 'down';
            }
            angle += 1;
            thisGame.physics.velocityFromAngle(angle, 200, child.body.velocity);
          }
          child.ang = angle;


        }
        if(child.hp<=0){
          //play death animation
          explode(thisGame,child.x,child.y);
        }

      });

      this.interceptors.children.iterate(function(child){
        if(child.x < -20 || child.hp<=0){
          toRemove.push(child);
        }else if((thisGame.time.now - child.lastFired)>2000){
          fire(thisGame,child.x, child.y+30, 180, 450, 'enemyBullet');
          child.lastFired = thisGame.time.now;
        }
        if(child.hp<=0){
          //play death animation
          explode(thisGame,child.x,child.y);
        }
      });

      this.destroyers.children.iterate(function(child){
        if(child.x < -20 || child.hp<=0){
          toRemove.push(child);
        }else if((thisGame.time.now - child.lastFired)>1000){
          fire(thisGame,child.x, child.y+30, 180, 450, 'enemyBullet');
          child.lastFired = thisGame.time.now;
        }
        if(child.hp<=0){
          //play death animation
          explode(thisGame,child.x,child.y);
        }
      });

      this.bombers1.children.iterate(function(child){
        if(child.y < -20 || child.hp<=0){
          toRemove.push(child);
        }else if((thisGame.time.now - child.lastFired)>1000){
          fire(thisGame,child.x, child.y+30, 180, 450, 'missile1');
          child.lastFired = thisGame.time.now;
        }
        if(child.hp<=0){
          //play death animation
          explode(thisGame,child.x,child.y);
        }
      });

      this.bombers2.children.iterate(function(child){
        if(child.y < -20 || child.hp<=0){
          toRemove.push(child);
        }else if((thisGame.time.now - child.lastFired)>2000){
          var angle = Phaser.Math.Angle.Between(child.x,child.y+30,thisGame.player.x,thisGame.player.y);
          fire(thisGame,child.x, child.y+30, angle , 450, 'missile2');
          child.lastFired = thisGame.time.now;
        }
        if(child.hp<=0){
          //play death animation
          explode(thisGame,child.x,child.y);
        }
      });

      this.bullets.children.iterate(function(child){
        if(child.x<0 || child.x>1200 || child.y<0 || child.y>600){
          toRemove.push(child);
        }
      });

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
      this.time.removeAllEvents();
      thisGame.player.disableBody(true,true);
    }

  }
}
