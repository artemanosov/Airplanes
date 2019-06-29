//collectibles indecators
var fireUpOn;
var shieldOn;
var gunUpOn;
var slowdown;
var shieldCountdown;
var fireUpCountdown;
var gunUpCountdown;
var slowdownCountdown;


function removeObject(game,object){
  object.disableBody(true,true);
  //remove enemy from the group
  if(object.name == 'cornduster'){
    game.corndusters.remove(object);
  }
  else if(object.name == 'interceptor'){
    game.interceptors.remove(object)
  }
  else if(object.name == 'destroyer'){
    game.destroyers.remove(object);
  }
  else if(object.name == 'bomber1'){
    game.bombers1.remove(object);
  }
  else if(object.name == 'bomber2'){
    game.bombers2.remove(object);
  }
  else if(object.name == 'striker'){
    game.strikers.remove(object);
  }
  else if(object.name == 'particle'){
    game.particles.remove(object);
  }
  else if(object.name == 'coin'){
    game.coins.remove(object);
  }
  else{
    //it is a bullet
    game.bullets.remove(object);
  }
}

function enemyCollide(player, enemy){
  if(!shieldOn){
    this.player.hp -= enemy.damage;
    if(this.player.hp<0){
      this.player.hp=0;
    }
  }
  explode(this,enemy.x,enemy.y);
  removeObject(this,enemy);
}

function hitPlayer(player, bullet){
  //apply damage if shield is off
  if(!shieldOn){
    player.hp -= bullet.damage;
  }
  createSparkles(this,bullet.x,bullet.y);
  bullet.disableBody(true,true);
  this.bullets.remove(bullet);
}

function hitEnemy(bullet, enemy){
  enemy.hp -= bullet.damage;
  bullet.disableBody(true,true);
  createSparkles(this,bullet.x,bullet.y);
  this.bullets.remove(bullet);
  if(enemy.hp<=0){
    spawnCoin(this,enemy.x,enemy.y);
    spawnParticles(this,enemy.x,enemy.y);
    this.player.points += enemy.points;
  }
}


function getCollectible(player,collectible){
  collectible.disableBody(true,true);
  if(collectible.name == 'healthPoint'){
    player.hp += 30;
    if(player.hp>player.maxHP){
      player.hp = player.maxHP;
    }
    this.healthPoints.remove(collectible);
  }else if(collectible.name == 'fireRate'){
    //increase fire rate if gun type is not lazer
    fireUpOn = true;
    fireUpCountdown = playerStats.fireRate/1000;
    //add timer to event
    var timer = this.time.addEvent({ delay: 1000, callback: function(){
      if(fireUpCountdown==0){
        restoreFireRate(this.player);
        timer.remove(false);
      }else{
        fireUpCountdown-=1;
      }
    }, callbackScope: this, loop: true });

    if(player.gunType!='lazer'){
      player.fireDelay = 100;
    }
    this.fireRates.remove(collectible);
    powerupSound.play();
  }else if(collectible.name == 'slowdown'){
    //slowdown all objects except player for 10 seconds
    slowdown = true;
    //slowdown all enemyspawns
    for(var i=0;i<this.timers.length;i++){
      if(this.timers[i].name == 'enemyTimer' || this.timers[i].name == 'distanceTimer'){
        this.timers[i].delay *= 1.7;
      }
    }
    slowdownCountdown = playerStats.slowdown/1000;

    //restore all delays
    //add timer to event
    var timer = this.time.addEvent({ delay: 1000, callback: function(){
      if(slowdownCountdown==0){
        restoreDelays(this);
        timer.remove(false);
      }else{
        slowdownCountdown-=1;
      }
    }, callbackScope: this, loop: true });
    powerupSound.play();
  }else if(collectible.name == 'gunUpgrade'){
    this.gunUpgrades.remove(collectible);
    gunUpOn = true;
    //choose a new gun randomly
    var upgrade = Phaser.Math.Between(0, 2);
    if(upgrade==1){
      player.gunType = 'lazer';
      player.fireDelay = 0;
    }else if(upgrade==2){
      player.gunType = 'triple';
    }else{
      player.gunType = 'missile';
      player.fireDelay *= 2;
    }
    gunUpCountdown = playerStats.gunUp/1000;
    //add timer to event
    var timer = this.time.addEvent({ delay: 1000, callback: function(){
      if(gunUpCountdown==0){
        restoreGun(this.player);
        timer.remove(false);
      }else{
        gunUpCountdown-=1;
      }
    }, callbackScope: this, loop: true });
    powerupSound.play();
  }else if(collectible.name == 'coin'){
    player.coins+=1;
    this.coins.remove(collectible);
    coinSound.play();
  }
  else{
    //it is Shield
    shieldOn = true;
    this.shields.remove(collectible);
    shieldCountdown = playerStats.shield/1000;
    //add timer to event
    var timer = this.time.addEvent({ delay: 1000, callback: function(){
      if(shieldCountdown==0){
        shieldOff(this.player);
        timer.remove(false);
      }else{
        shieldCountdown-=1;
      }
    }, callbackScope: this, loop: true });
    player.setTint(0x00ccff);
    powerupSound.play();
  }
}

function restoreFireRate(player){
  if(player.gunType!='lazer')
    player.fireDelay = 200;
  fireUpOn = false;
}

function shieldOff(player){
  shieldOn = false;
  player.clearTint();
}

function restoreGun(player){
  gunUpOn = false;
  player.gunType = 'regular';
  player.fireDelay = 200;
}

function particleCollision(player, particle){
  particle.disableBody(true,true);
  createSparkles(this,particle.x,particle.y);
  particle.disableBody(true,true);
  if(!shieldOn){
    player.hp-=5;
    if(player.hp<0){
      player.hp=0;
    }
  }
  this.particles.remove(particle);
}

function restoreDelays(thisGame){
  slowdown=false;
  for(var i=0;i<thisGame.timers.length;i++){
    if(thisGame.timers[i].name == 'enemyTimer' || thisGame.timers[i].name == 'distanceTimer')
      thisGame.timers[i].delay /= 1.7;
  }
}
