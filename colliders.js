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
  console.log(this);
  this.player.points += enemy.points;
}

function getCollectible(player,collectible){
  collectible.disableBody(true,true);
  if(collectible.name == 'healthPoint'){
    player.hp += 50;
    if(player.hp>200){
      player.hp = 200;
    }
    this.healthPoints.remove(collectible);
  }else if(collectible.name == 'gunUpgrade'){
    player.fireDelay = 100;
    this.gunUpgrades.remove(collectible);
    this.time.delayedCall(10000, restoreFireRate, [this.player], this);
  }else{
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
