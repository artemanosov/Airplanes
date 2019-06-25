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
  else{
    //it is a bullet
    game.bullets.remove(object);
  }
}

function enemyCollide(player, enemy){
  if(!player.shield){
    this.player.hp -= enemy.damage;
  }
  explode(this,enemy.x,enemy.y);
  removeObject(this,enemy);
}

function hitPlayer(player, bullet){
  //apply damage if shield is off
  if(!player.shield){
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
    spawnParticles(this,enemy.x,enemy.y);
    this.player.points += enemy.points;
  }
}

function getCollectible(player,collectible){
  collectible.disableBody(true,true);
  if(collectible.name == 'healthPoint'){
    player.hp += 50;
    if(player.hp>200){
      player.hp = 200;
    }
    this.healthPoints.remove(collectible);
  }else if(collectible.name == 'fireRate'){
    player.fireDelay = 100;
    this.fireRates.remove(collectible);
    this.time.delayedCall(10000, restoreFireRate, [this.player], this);
  }else if(collectible.name == 'slowdown'){
    //slowdown all objects except player for 10 seconds
    slowdown = true;
    this.time.delayedCall(7000, function(){slowdown=false;}, [this.player], this);
  }else if(collectible.name == 'gunUpgrade'){
    this.gunUpgrades.remove(collectible);

    //choose a new gun randomly
    //var upgrade = Phaser.Math.Between(0, 2);
    var upgrade = 1;
    if(upgrade==1){
      player.gunType = 'lazer';
      player.fireDelay = 0;
    }else if(upgrade==2){
      player.gunType = 'triple';
    }else{
      player.gunType = 'missile';
    }
    //set gun type to default in 10 seconds
    this.time.delayedCall(10000, restoreGun, [this.player], this);
  }
  else{
    //it is Shield
    player.shield = true;
    this.shields.remove(collectible);
    this.time.delayedCall(7000, shieldOff, [this.player], this);
    player.setTint(0x00ccff);
  }
}

function restoreFireRate(player){player.fireDelay = 200;}

function shieldOff(player){
  player.shield = false;
  player.clearTint();
}

function restoreGun(player){
  player.gunType = 'regular';
  player.fireDelay = 200;
}

function particleCollision(player, particle){
  particle.disableBody(true,true);
  createSparkles(this,particle.x,particle.y);
  particle.disableBody(true,true);
  player.hp-=5;
  this.particles.remove(particle);
}
