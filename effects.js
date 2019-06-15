function explode(game,x,y){
  var explosion = game.explosions.get(x,y).setActive(true);
  explosion.setOrigin(0);
  explosion.play('explode');
  explosion.on('animationcomplete', function(){explosion.destroy();});
}

function createSparkles(game,x,y){
  var hitSparkles = game.sparkles.get(x,y).setActive(true);
  hitSparkles.play('hit');
  hitSparkles.on('animationcomplete', function(){hitSparkles.destroy();});
}
