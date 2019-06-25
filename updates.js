function updatePlayer(thisGame){
  if(!paused){
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


  //make player fire bullets only after fire delay
    if((thisGame.time.now-thisGame.player.lastFired)>thisGame.player.fireDelay){
      //check if gunType is lazer, if so shoot only if airplane is not rotated
      if(thisGame.player.gunType!='lazer' || (thisGame.player.gunType=='lazer' && thisGame.player.rotation==0)){
        fire(thisGame,thisGame.player.x+30, thisGame.player.y, thisGame.player.angle, 600, 'playerBullet');
        thisGame.player.lastFired = thisGame.time.now;
      }
    }
  }
  else{
    thisGame.player.setVelocityY(0);
    thisGame.player.setVelocityX(0);
  }

}

function updateBoss(thisGame){
  if(!paused){
    //MOVEMENTS
    if(thisGame.boss.body.x <= 1080){
      thisGame.boss.body.x+=1;
      thisGame.boss.setVelocityX(0);
    }

    if(thisGame.boss.direction == 'up'){
      //boss going up
      //check if boss is on the upper edge of the battlefield
      if(thisGame.boss.body.y<=0){
        thisGame.boss.direction = 'down';
        thisGame.boss.setVelocityY(50);
      }
      //restore velocity if boss was paused
      if(thisGame.boss.paused == true){
        thisGame.boss.paused = false;
        thisGame.boss.setVelocityY(-50);
        thisGame.boss.setVelocityX(-50);
      }
    }else{
      //boss going down
      //check if boss is on the lower edge of the battlefield
      if(thisGame.boss.body.y>=366){
        thisGame.boss.direction = 'up';
        thisGame.boss.setVelocityY(-50);
      }
      //restore velocity if boss was paused
      if(thisGame.boss.paused == true){
        thisGame.boss.paused = false;
        thisGame.boss.setVelocityY(50);
        thisGame.boss.setVelocityX(-50);
      }
    }

    //ATTACK
    if((thisGame.time.now - thisGame.boss.lastFired)>thisGame.boss.fireDelay){
      if(thisGame.boss.hp<500){
        var angle = Phaser.Math.Angle.Between(thisGame.boss.x,thisGame.boss.y+30,thisGame.player.x,thisGame.player.y);
        fire(thisGame,thisGame.boss.x, thisGame.boss.y+30, angle , 450, 'missile2');
      }else{
        fire(thisGame,thisGame.boss.x, thisGame.boss.y+30, 180 , 450, 'missile1');
      }

      thisGame.boss.lastFired = thisGame.time.now;
    }
  }
  else{
    thisGame.boss.setVelocityY(0);
    thisGame.boss.setVelocityX(0);
    thisGame.boss.paused = true;
  }
}
  function updateCorndusters(thisGame, toRemove){
    thisGame.corndusters.children.iterate(function(child){
      if(!paused){
        if(child.x < -20 || child.hp<=0){
          toRemove.push(child);
        }else{
          var angle = child.ang;
          if(child.direction == 'down'){
            if(angle <= 134){
              child.direction = 'up';
            }
            angle -= 1;
          }else{
            if(angle >= 224){
              child.direction = 'down';
            }
            angle += 1;
          }
          if(slowdown){
            //if slowdown was picked by player, reduce the speed of a child by 70%
            thisGame.physics.velocityFromAngle(angle, 60, child.body.velocity);
          }else{
            thisGame.physics.velocityFromAngle(angle, 200, child.body.velocity);
          }
          child.ang = angle;
        }
        if(child.hp<=0){
          //play death animation
          explode(thisGame,child.x,child.y);
        }
      }else{
        child.setVelocityX(0);
        child.setVelocityY(0);
      }

    });
  }



function updateInterceptors(thisGame,toRemove){
  var delay;
  thisGame.interceptors.children.iterate(function(child){
    if(!paused){
      if(child.x < -20 || child.hp<=0){
        toRemove.push(child);
      }else if(slowdown){
        child.setVelocityX(-105)
        delay = 3400;
      }else{
        child.setVelocityX(-350)
        delay = 2000;
      }

      if((thisGame.time.now - child.lastFired)>delay){
        fire(thisGame,child.x, child.y+30, 180, 450, 'enemyBullet');
        child.lastFired = thisGame.time.now;
      }
      if(child.hp<=0){
        //play death animation
        explode(thisGame,child.x,child.y);
      }
    }else{
      child.setVelocityX(0);
      child.setVelocityY(0);
    }

  });
}

function updateDestroyers(thisGame,toRemove){
  var delay;
  thisGame.destroyers.children.iterate(function(child){
    if(!paused){
      if(child.x < -20 || child.hp<=0){
        toRemove.push(child);
      }else if(slowdown){
        //if there is slowdown, reduce the fire rate and speed by 70%
        delay = 1700;
        child.setVelocityX(-90);
      }else{
        //no slowdown
        delay = 1000;
        //restore velocity
        child.setVelocityX(-300);
      }

      if((thisGame.time.now - child.lastFired)>delay){
        fire(thisGame,child.x, child.y+30, 180, 450, 'enemyBullet');
        child.lastFired = thisGame.time.now;
      }

      if(child.hp<=0){
        //play death animation
        explode(thisGame,child.x,child.y);
      }
    }else{
      child.setVelocityX(0);
      child.setVelocityY(0);
    }

  });
}

function updateBombers1(thisGame,toRemove){
  var delay;
  thisGame.bombers1.children.iterate(function(child){
    if(!paused){
      if(child.y < -20 || child.hp<=0){
        toRemove.push(child);
      }else if(slowdown){
        child.setVelocityY(-15);
        delay = 1700;
      }else{
        child.setVelocityY(-50);
        delay = 1000;
      }

      if((thisGame.time.now - child.lastFired)>delay){
        fire(thisGame,child.x, child.y+30, 180, 450, 'missile1');
        child.lastFired = thisGame.time.now;
      }
      if(child.hp<=0){
        //play death animation
        explode(thisGame,child.x,child.y);
      }
    }else{
      child.setVelocityX(0);
      child.setVelocityY(0);
    }
  });
}

  function updateBombers2(thisGame, toRemove){
    var delay;
    thisGame.bombers2.children.iterate(function(child){
    if(!paused){
      if(child.y < -20 || child.hp<=0){
        toRemove.push(child);
      }else if(slowdown){
        //if slowdown reduce the speed and fire rate
        delay = 3400;
        child.setVelocityY(-15);
      }else{
        // no slowdown
        delay = 2000;
        child.setVelocityY(-50);
      }

      if((thisGame.time.now - child.lastFired)>delay){
        var angle = Phaser.Math.Angle.Between(child.x,child.y+30,thisGame.player.x,thisGame.player.y);
        fire(thisGame,child.x, child.y+30, angle , 450, 'missile2');
        child.lastFired = thisGame.time.now;
      }

      if(child.hp<=0){
        //play death animation
        explode(thisGame,child.x,child.y);
      }
    }else{
      child.setVelocityX(0);
      child.setVelocityY(0);
    }
  });
}

function updateStrikers(thisGame, toRemove){
  var delay;
  thisGame.strikers.children.iterate(function(child){
    if(!paused){
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
        var delay;
        //make striker move according to the angle of rotation
        if(slowdown){
          //if slowdown was picked by player, reduce the speed of a child
          thisGame.physics.velocityFromAngle(angle, 36, child.body.velocity);
          delay = 1360;
        }else{
          thisGame.physics.velocityFromAngle(angle, 120, child.body.velocity);
          delay = 800;
        }
        child.ang = angle;

        //fire if needed
        if((thisGame.time.now - child.lastFired)>delay){
          fire(thisGame,child.x, child.y+90, 180, 450, 'missile1');
          fire(thisGame,child.x, child.y+10, 180, 450, 'missile1');
          child.lastFired = thisGame.time.now;
        }
      }
      if(child.hp<=0){
        //play death animation
        explode(thisGame,child.x,child.y);
      }
    }else{
      child.setVelocityX(0);
      child.setVelocityY(0);
    }

  });
}

function updateBullets(thisGame, toRemove){
  //remove bullet when it is out of game world bounds
  thisGame.bullets.children.iterate(function(child){
    if(!paused){
      if(child.x<0 || child.x>1200 || child.y<0 || child.y>600){
        toRemove.push(child);
      }
      else if(!slowdown && child.modified){
        //if there was a slowdown and the enemy bullet/missile velocity was modified
        //restore it
        child.body.velocity.x = child.velX;
        child.body.velocity.y = child.velY;
        child.modified = false;
      }
      else if(child.name != 'playerBullet' && slowdown && !child.modified){
        //if slowdown was initiated and bullet was not reduced in speed, reduce it
        child.body.velocity.x *= 0.3;
        child.body.velocity.y *= 0.3;
        child.modified = true;
      }else if(child.paused==true){
        child.body.velocity.x = child.prevVelX;
        child.body.velocity.y = child.prevVelY;
        child.paused = false;
      }
    }else{
      //if game was paused, save previous velocities of the bullet to restore them later
      if(child.paused!=true){
        child.prevVelX = child.body.velocity.x;
        child.prevVelY = child.body.velocity.y;
        child.paused = true;
      }
      child.setVelocityX(0);
      child.setVelocityY(0);

    }
  });
}

function updateGunUpgrades(thisGame,toRemove){
  thisGame.gunUpgrades.children.iterate(function(child){
    if(!paused){
      if(child.x<0){
        toRemove.push(child);
      }else{
        child.setVelocityX(-50);
      }
    }else{
      child.setVelocityX(0);
    }
  });
}

function updateShields(thisGame,toRemove){
  thisGame.shields.children.iterate(function(child){
    if(!paused){
      if(child.x<0){
        toRemove.push(child);
      }else{
        child.setVelocityX(-50);
      }
    }else{
      child.setVelocityX(0);
    }
  });
}

function updateFireRates(thisGame,toRemove){
  thisGame.fireRates.children.iterate(function(child){
    if(!paused){
      if(child.x<0){
        toRemove.push(child);
      }else{
        child.setVelocityX(-50);
      }
    }else{
      child.setVelocityX(0);
    }
  });
}

function updateHealthPoints(thisGame,toRemove){
  thisGame.healthPoints.children.iterate(function(child){
    if(!paused){
      if(child.x<0){
        toRemove.push(child);
      }else{
        child.setVelocityX(-50);
      }
    }else{
      child.setVelocityX(0);
    }
  });
}

function updateParticles(thisGame,toRemove){
  thisGame.particles.children.iterate(function(child){
    if(!paused){
      if(child.x<0 || child.x>1200 || child.y<0 || child.y>600){
        toRemove.push(child);
      }
      else if(slowdown && !child.modified){
        //if slowdown was initiated and particle's velocities were not reduced, reduce them by 70%
        child.setVelocityX(child.body.velocity.x*0.3);
        child.setVelocityY(child.body.velocity.y*0.3);
        child.modified = true;
      }else if(!slowdown && child.modified){
        //if particle was slowdowned and slowdown event is finished, restore previous velocities
        child.body.velocity.x = child.velX;
        child.body.velocity.y = child.velY;
        child.modified = false;
      }else if(child.paused == true){
        child.body.velocity.x = child.prevVelX;
        child.body.velocity.y = child.prevVelY;
        child.paused = false;
      }
    }else{
      if(child.paused!=true){
        child.prevVelX = child.body.velocity.x;
        child.prevVelY = child.body.velocity.y;
        child.paused = true;
      }
      child.setVelocityX(0);
      child.setVelocityY(0);
    }
  });
}
