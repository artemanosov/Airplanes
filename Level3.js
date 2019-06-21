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

    this.time.addEvent({ delay: 1000, callback: sendDestroyer, callbackScope: this, loop: false });

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

    //add cursor keys
    cursors = this.input.keyboard.createCursorKeys();

    //level data
    distance = 200;
    this.time.addEvent({delay: 1000, callback: function(){distance-=1}, callbackScope: this, loop: true });
  }

  update(){
    if(thisGame.player.hp>0){
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

      //make player fire bullets
      if((this.time.now-thisGame.player.lastFired)>thisGame.player.fireDelay){
        fire(this,thisGame.player.x+30, thisGame.player.y, thisGame.player.angle, 600, 'playerBullet');
        thisGame.player.lastFired = this.time.now;
      }

      //create an array of enemies that are outside the world and must be removed
      var toRemove = new Array();

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

      this.strikers.children.iterate(function(child){
        if(child.x < -20 || child.hp<=0){
          toRemove.push(child);
        }else{
          //striker changes its angle depending on the way it goes (up or down) until some limit(234 and 134 degrees)
          //it changes the way it moves on the Y-axis when it hits upper or lower edge of the battlefield
          var angle = child.ang;
          if(child.direction == 'down'){
            if(angle > 134){
              angle -= 3;
            }
            if(child.y>485){
              //if strike hits the lower edge of the battlefield change its direction so it goes up
              child.direction = 'up';
            }
          }else{
            if(angle < 224){
              angle += 3;
            }
            if(child.y<10){
              //if strike hits the upper edge of the battlefield change his direction so it goes down
              child.direction = 'down';
            }
          }
          //make striker move according to the angle of rotation
          thisGame.physics.velocityFromAngle(angle, 120, child.body.velocity);
          child.ang = angle;

          //fire needed
          if((thisGame.time.now - child.lastFired)>800){
            fire(thisGame,child.x, child.y+90, 180, 450, 'missile1');
            fire(thisGame,child.x, child.y+10, 180, 450, 'missile1');
            child.lastFired = thisGame.time.now;
          }
        }
        if(child.hp<=0){
          //play death animation
          explode(thisGame,child.x,child.y);
        }
      });

      //remove bullet when it is out of game world bounds
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
