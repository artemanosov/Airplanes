function fire(game,x, y, angle, velocity, type){
  //create a bullet
  if(type == 'playerBullet' && thisGame.player.gunType=='missile'){
    //if it is player's missile, create missile of type1
    var bullet = game.bullets.create(x+10,y+10,'missile1').setOrigin(0);
    bullet.rotation = 3.1;
    bullet.damage = 30;
  }else if(type == 'playerBullet' && thisGame.player.gunType=='lazer'){
    //if it laser, create a laser bullet
    var bullet = game.bullets.create(x,y,'lazer').setOrigin(0);
    bullet.damage = 1;
    bullet.anims.play('lazer', true);
  }else if(type == 'playerBullet' && thisGame.player.gunType == 'triple'){
    //create three bullets
    var bullet = game.bullets.create(x,y,type).setOrigin(0);
    var bullet2 = game.bullets.create(x,y,type).setOrigin(0);
    var bullet3 = game.bullets.create(x,y,type).setOrigin(0);
    //save bullet original x and y velocities
    bullet2.velX = bullet2.body.velocity.x;
    bullet2.velY = bullet2.body.velocity.y;
    bullet3.velX = bullet3.body.velocity.x;
    bullet3.velY = bullet3.body.velocity.y;

    bullet2.name = type;
    bullet2.modified = false;
    bullet3.name = type;
    bullet3.modified = false;

    bullet2.damage = 10;
    bullet3.damage = 10;
    bullet.damage = 10;

    //triple gun of player is fired in three directions
    //first bullet goes straight
    game.physics.velocityFromAngle(angle, velocity, bullet.body.velocity);
    game.physics.velocityFromAngle(angle-20, velocity, bullet2.body.velocity);
    game.physics.velocityFromAngle(angle+20, velocity, bullet3.body.velocity);

    //add collisions for each bullet with enemies depending on the level
    game.physics.add.overlap(game.corndusters, bullet2, hitEnemy, null, game);
    game.physics.add.overlap(game.corndusters, bullet3, hitEnemy, null, game);
    if(level == 1 || level == 2){
      game.physics.add.overlap(game.interceptors, bullet2, hitEnemy, null, game);
      game.physics.add.overlap(game.interceptors, bullet3, hitEnemy, null, game);
      game.physics.add.overlap(game.bombers1, bullet2, hitEnemy, null, game);
      game.physics.add.overlap(game.bombers1, bullet3, hitEnemy, null, game);
    }
    if(level == 2 || level == 3){
      game.physics.add.overlap(game.destroyers, bullet2, hitEnemy, null, game);
      game.physics.add.overlap(game.destroyers, bullet3, hitEnemy, null, game);
      game.physics.add.overlap(game.bombers2, bullet2, hitEnemy, null, game);
      game.physics.add.overlap(game.bombers2, bullet3, hitEnemy, null, game);
    }
    if(level == 3){
      game.physics.add.overlap(game.strikers, bullet2, hitEnemy, null, game);
      game.physics.add.overlap(game.strikers, bullet3, hitEnemy, null, game);
    }
  }
  else{
    //otherwise create a bullet based on the type
    var bullet = game.bullets.create(x,y,type).setOrigin(0);
    //if it is a missile of any type, give damage of 30
    if(type == 'missile1' || type=='missile2'){
      bullet.damage = 30;
    }else{
      bullet.damage = 10;
    }
  }

  //save bullet original x and y velocities
  //console.log(bullet.body.velocity.x);
  bullet.velX = bullet.body.velocity.x;
  bullet.velY = bullet.body.velocity.y;

  bullet.name = type;
  bullet.modified = false;

  //determine the direction of the bullet depending on the type
  if(type == 'missile2'){
    //missile from bobmber2 is fired at the last player's position
    game.physics.velocityFromRotation(angle, velocity, bullet.body.velocity);
    bullet.rotation = angle;
  }
  else{
    //regular bullets or missiles of player and bobmber1
    //fired on lineraly with direction depending on the shooter
    game.physics.velocityFromAngle(angle, velocity, bullet.body.velocity);
  }
  //depending on the type determine collision detection
  if(type=='playerBullet'){
    //it is a player bullet.
    //depending on the level collisions are different due to different enemies on different levels

    if(level == 1 || level == 2){
      game.physics.add.overlap(game.corndusters, bullet, hitEnemy, null, game);
      game.physics.add.overlap(game.interceptors, bullet, hitEnemy, null, game);
      game.physics.add.overlap(game.bombers1, bullet, hitEnemy, null, game);
    }
    if(level == 2 || level == 3){
      game.physics.add.overlap(game.destroyers, bullet, hitEnemy, null, game);
      game.physics.add.overlap(game.bombers2, bullet, hitEnemy, null, game);
    }
    if(level == 3){
      game.physics.add.overlap(game.strikers, bullet, hitEnemy, null, game);
      game.physics.add.overlap(game.corndusters, bullet, hitEnemy, null, game);
    }
    if(level==4){
      game.physics.add.overlap( bullet, game.boss, hitEnemy, null, game);
    }
  }
  else{
    //it is enemy bullet and must have collision detection with player
    game.physics.add.overlap(game.player, bullet, hitPlayer, null, game);
  }
}
