function sendCornduster() {
  var x = 1200;
  var y = Phaser.Math.Between(35, 400);
  var cornduster = this.corndusters.create(x,y,'cornduster').setOrigin(0);
  cornduster.anims.play('cornduster', true);
  cornduster.name = 'cornduster';
  cornduster.damage = 20;
  cornduster.hp = 30;
  cornduster.points = 5;
  cornduster.direction = 'down';
  cornduster.ang = 180;
}

function sendInterceptor() {
  var x = 1200;
  var y = Phaser.Math.Between(0, 530);
  var interceptor = this.interceptors.create(x,y,'interceptor').setOrigin(0);
  interceptor.anims.play('interceptor', true);
  interceptor.name = 'interceptor';
  interceptor.damage = 20;
  interceptor.hp = 30;
  interceptor.lastFired = 0;
  interceptor.points = 10;
}

function sendDestroyer() {
  var x = 1200;
  var y = Phaser.Math.Between(0, 520);
  var destroyer = this.destroyers.create(x,y,'destroyer').setOrigin(0);
  destroyer.anims.play('destroyer', true);
  destroyer.name = 'destroyer';
  destroyer.damage = 25;
  destroyer.hp = 50;
  destroyer.lastFired = 0;
  destroyer.points = 20;
}


function sendBomber1(game) {
  var x = 1000;
  var y = 630;
  var bomber1 = game.bombers1.create(x,y,'bomber1').setOrigin(0);
  bomber1.name = 'bomber1';
  bomber1.damage = 25;
  bomber1.hp = 70;
  bomber1.lastFired = 0;
  bomber1.points = 15;
}

function sendBomber2(game) {
  var x = 1000;
  var y = 630;
  var bomber2 = game.bombers2.create(x,y,'bomber2').setOrigin(0);
  bomber2.name = 'bomber2';
  bomber2.damage = 25;
  bomber2.hp = 70;
  bomber2.lastFired = 0;
  bomber2.points = 20;
}

function sendStriker() {
  var x = 1200;
  var y = Phaser.Math.Between(35, 400);
  var striker = this.strikers.create(x,y,'striker').setOrigin(0);
  striker.name = 'striker';
  striker.damage = 20;
  striker.hp = 100;
  striker.points = 25;
  striker.lastFired = 0;
  striker.direction = 'down';
  striker.ang = 180;
}

function createHP(){
  var x = 1200;
  var y = Phaser.Math.Between(10, 550);
  var healthPoint = this.healthPoints.create(x,y,'health').setOrigin(0);
  healthPoint.name = 'healthPoint';
}

function createShield() {
  var x = 1200;
  var y = Phaser.Math.Between(10, 550);
  var shield = this.shields.create(x,y,'shield').setOrigin(0);
  shield.name = 'shield';
}

function createGunUpgrade(){
  var x = 1200;
  var y = Phaser.Math.Between(10, 550);
  var gunUpgrade = this.gunUpgrades.create(x,y,'gunUpgrade').setOrigin(0);
  gunUpgrade.name = 'gunUpgrade';
}

function createFireRate(){
  var x = 1200;
  var y = Phaser.Math.Between(10, 550);
  var fireRate = this.fireRates.create(x,y,'fireRate').setOrigin(0);
  fireRate.name = 'fireRate';
}

function createClock(){
  var x = 1200;
  var y = Phaser.Math.Between(10, 550);
  var clock = this.clocks.create(x,y,'clock').setOrigin(0);
  clock.name = 'slowdown';
}

function spawnParticles(thisGame,x,y){
  //create 16 particles for 16 directions. Direction will depend on Angle
  //Angle starts from 0 and is increases by 22.5 for each particle
  var particle;
  var angle = 0;
  //make sure only 16 particles will be spawned
  while(angle!=360){
    //create particle
    particle = thisGame.particles.create(x,y,'particle').setOrigin(0);
    //sets its velocity depending on angle
    thisGame.physics.velocityFromAngle(angle, 150, particle.body.velocity);
    //save current velocities for a case of slowdown velocities recovery
    particle.velX = particle.body.velocity.x;
    particle.velY = particle.body.velocity.y;
    particle.modified = false;
    particle.name = 'particle';
    //increase an angle for the next particle
    angle+=22.5;
  }
}

function spawnCoin(thisGame,x,y){
  //create coin
  var coin = thisGame.coins.create(x,y,'coin').setOrigin(0);
  coin.name = 'coin';
  coin.anims.play('coin', true);
}
