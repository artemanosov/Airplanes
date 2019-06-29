var distanceText;
var distance;
var scoreText;
var healthText;
var coinsText;
var score;
var levelText;
var pauseText;
var shieldTime;
var gunUpTime;
var fireUpTime;
var slowdownTime;
var paused;

function addStatsTexts(thisGame){
  distanceText = thisGame.add.text(1000,5,'distance: 0',{fontSize: '20px', fill: '#000' });
  scoreText = thisGame.add.text(550,580,'score: 0',{fontSize: '20px', fill: '#000' });
  healthText = thisGame.add.text(550,5,'HP: 0',{fontSize: '20px', fill: '#000' });
  levelText = thisGame.add.text(5,580,'',{fontSize: '20px', fill: '#000' });
  levelText.text = 'Level: '+level;
  coinsText = thisGame.add.text(1000,580,'coins:',{fontSize: '20px', fill: '#000' });
  //conditional texts
  pauseText = thisGame.add.text(530,300,'PAUSED',{fontSize: '50px', fill: '#000' });
  shieldTime = thisGame.add.text(5,5,'',{fontSize: '15px', fill: '#000' });
  gunUpTime = thisGame.add.text(5,25,'',{fontSize: '15px', fill: '#000' });
  fireUpTime = thisGame.add.text(5,45,'',{fontSize: '15px', fill: '#000' });
  slowdownTime = thisGame.add.text(5,65,'',{fontSize: '15px', fill: '#000' });

  pauseText.visible = false;
  shieldTime.visible = false;
  gunUpTime.visible = false;
  fireUpTime.visible = false;
  slowdownTime.visible = false;
}

function updateStatsTexts(thisGame,distance){
  distanceText.text = 'distance: '+distance;
  scoreText.text = 'score: '+thisGame.player.points;
  healthText.text = 'HP: '+thisGame.player.hp;
  coinsText.text = 'coins: '+thisGame.player.coins;
  //update conditional stats
  if(gunUpOn){
    gunUpTime.visible = true;
    gunUpTime.text = 'Gun Upgrade: '+gunUpCountdown;
  }else{
    gunUpTime.visible = false;
  }
  if(fireUpOn){
    fireUpTime.visible = true;
    fireUpTime.text = 'Fire Rate Up: '+fireUpCountdown;
  }else{
    fireUpTime.visible = false;
  }
  if(shieldOn){
    shieldTime.visible = true;
    shieldTime.text = 'Shield: '+shieldCountdown;
  }else{
    shieldTime.visible = false;
  }
  if(slowdown){
    slowdownTime.visible = true;
    slowdownTime.text = 'Slowdown: '+slowdownCountdown;
  }else{
    slowdownTime.visible = false;
  }
}

function showPauseText(){pauseText.visible = true;}
function hidePauseText(){pauseText.visible = false;}
