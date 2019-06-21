function fire(game,x, y, angle, velocity, type){
  var bullet = game.bullets.create(x,y,type).setOrigin(0);
  if(type == 'missile2'){

    bullet.damage = 30;
    game.physics.velocityFromRotation(angle, velocity, bullet.body.velocity);
    bullet.rotation = angle;
  }else{
    bullet.damage = 10;
    game.physics.velocityFromAngle(angle, velocity, bullet.body.velocity);
  }

  bullet.name = type;


  if(type=='playerBullet'){

    game.physics.add.overlap(game.corndusters, bullet, hitEnemy, null, game);

    if(level == 1){
      game.physics.add.overlap(game.interceptors, bullet, hitEnemy, null, game);
      game.physics.add.overlap(game.bombers1, bullet, hitEnemy, null, game);
    }
    else if(level == 2){
      game.physics.add.overlap(game.interceptors, bullet, hitEnemy, null, game);
      game.physics.add.overlap(game.bombers1, bullet, hitEnemy, null, game);
      game.physics.add.overlap(game.destroyers, bullet, hitEnemy, null, game);
      game.physics.add.overlap(game.bombers2, bullet, hitEnemy, null, game);
    }
    else if(level == 3){
      game.physics.add.overlap(game.strikers, bullet, hitEnemy, null, game);
      game.physics.add.overlap(game.destroyers, bullet, hitEnemy, null, game);
      game.physics.add.overlap(game.bombers2, bullet, hitEnemy, null, game);
    }



  }
  else{
    game.physics.add.overlap(game.player, bullet, hitPlayer, null, game);
  }
}

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
  else{
    //it is a bullet
    game.bullets.remove(object);
  }
}
