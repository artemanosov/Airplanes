var config = {
    type: Phaser.AUTO,
    backgroundColor: 0x0066ff,
    physics: {
        default: 'arcade',
        arcade: {
          fps: 60,
          gravity: { y: 0 }
        }
    },
    scale: {
      mode: Phaser.Scale.NONE,
      _parent: 'airplanes',
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 1200,
      height: 600
  },
    scene: [MenuScene,GameScene]
};

var game = new Phaser.Game(config);
