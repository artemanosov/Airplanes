class Hangar extends Phaser.Scene{
  constructor(){
    super({key:"Hangar"})
  }
  create(data){
    //add background
    playerStats = data;
    this.tileSprite = this.add.tileSprite(0,0,1200,600,'sky').setOrigin(0);
    //create logo
    this.add.image(600,50,'hangarLogo');
    //create player coins text
    this.playerCoins = this.add.text(480,130,'PLAYER COINS:',{font: "20px Arial", fill: "#ff0044", align: "center" });

    //add upgrades
    this.add.image(170,230,'shopHealth');
    this.add.image(470,230,'shopGunUp');
    this.add.image(770,230,'shopShield');
    this.add.image(1070,230,'shopDamage');
    this.add.image(230,430,'shopSpeedUp');
    this.add.image(600,430,'shopClock');
    this.add.image(930,430,'shopFireRate');

    //add description to each upgrade
    this.add.text(120,180,'+10 MAX HP',{font: "17px Arial", fill: "#00000", align: "center" });
    this.add.text(340,180,'+1 SEC GUN UPGRADE DURATION',{font: "17px Arial", fill: "#00000", align: "center" });
    this.add.text(680,180,'+1 SEC SHIELD DURATION',{font: "17px Arial", fill: "#00000", align: "center" });
    this.add.text(980,180,'+1 TO FIRE DAMAGE',{font: "17px Arial", fill: "#00000", align: "center" });
    this.add.text(150,380,'+2% SPEED INCREASE',{font: "17px Arial", fill: "#00000", align: "center" });
    this.add.text(470,380,'+1 SEC SLOWDOWN DURATION',{font: "17px Arial", fill: "#00000", align: "center" });
    this.add.text(820,380,'+1 SEC FIRE RATE DURATION',{font: "17px Arial", fill: "#00000", align: "center" });

    //add counts to each upgrades
    this.totalText1 = this.add.text(165,260,'0',{font: "17px Arial", fill: "#00000", align: "center" });
    this.total1 = 0;
    this.totalText2 = this.add.text(465,260,'0',{font: "17px Arial", fill: "#00000", align: "center" });
    this.total2 = 0;
    this.totalText3 = this.add.text(765,260,'0',{font: "17px Arial", fill: "#00000", align: "center" });
    this.total3 = 0;
    this.totalText4 = this.add.text(226,460,'0',{font: "17px Arial", fill: "#00000", align: "center" });
    this.total4 = 0;
    this.totalText5 = this.add.text(596,460,'0',{font: "17px Arial", fill: "#00000", align: "center" });
    this.total5 = 0;
    this.totalText6 = this.add.text(926,460,'0',{font: "17px Arial", fill: "#00000", align: "center" });
    this.total6 = 0;
    this.totalText7 = this.add.text(1065,260,'0',{font: "17px Arial", fill: "#00000", align: "center" });
    this.total7 = 0;

    //add cost to each upgrade
    this.add.text(120,300,'Cost: 20 coins',{font: "17px Arial", fill: "#ff0044", align: "center" });
    this.add.text(420,300,'Cost: 10 coins',{font: "17px Arial", fill: "#ff0044", align: "center" });
    this.add.text(720,300,'Cost: 20 coins',{font: "17px Arial", fill: "#ff0044", align: "center" });
    this.add.text(180,500,'Cost: 20 coins',{font: "17px Arial", fill: "#ff0044", align: "center" });
    this.add.text(550,500,'Cost: 30 coins',{font: "17px Arial", fill: "#ff0044", align: "center" });
    this.add.text(880,500,'Cost: 10 coins',{font: "17px Arial", fill: "#ff0044", align: "center" });
    this.add.text(1020,300,'Cost: 30 coins',{font: "17px Arial", fill: "#ff0044", align: "center" });

    //for each upgrade, add adders and subtractors
    var add1 = this.add.image(140,270,'add');
    var sub1 = this.add.image(200,270,'subtract');
    var add2 = this.add.image(440,270,'add');
    var sub2 = this.add.image(500,270,'subtract');
    var add3 = this.add.image(740,270,'add');
    var sub3 = this.add.image(800,270,'subtract');
    var add4 = this.add.image(200,470,'add');
    var sub4 = this.add.image(260,470,'subtract');
    var add5 = this.add.image(570,470,'add');
    var sub5 = this.add.image(630,470,'subtract');
    var add6 = this.add.image(900,470,'add');
    var sub6 = this.add.image(960,470,'subtract');
    var add7 = this.add.image(1040,270,'add');
    var sub7 = this.add.image(1100,270,'subtract');

    //make each button interactive
    add1.setInteractive();
    add1.on('pointerdown', function(){
      //increase health points
      if(playerStats.coins>=20){
        playerStats.coins-=20;
        playerStats.hp+=10;
        this.total1 += 1;
      }
    },this);

    sub1.setInteractive();
    sub1.on('pointerdown', function(){
      //decrease health points
      if(this.total1>0){
        playerStats.coins+=20;
        playerStats.hp-=10;
        this.total1 -= 1;
      }
    },this);

    add2.setInteractive();
    add2.on('pointerdown', function(){
      //increase gun upgrade duration time
      if(playerStats.coins>=10){
        playerStats.coins-=10;
        playerStats.gunUp+=1000;
        this.total2 += 1;
      }
    },this);

    sub2.setInteractive();
    sub2.on('pointerdown', function(){
      //decrease gun upgrade duration time
      if(this.total2>0){
        playerStats.coins+=10;
        playerStats.gunUp-=1000;
        this.total2 -= 1;
      }
    },this);

    add3.setInteractive();
    add3.on('pointerdown', function(){
      //increase shield duration time
      if(playerStats.coins>=20){
        playerStats.coins-=20;
        playerStats.shield+=1000;
        this.total3 += 1;
      }
    },this);

    sub3.setInteractive();
    sub3.on('pointerdown', function(){
      //decrease shield duration time
      if(this.total3>0){
        playerStats.coins+=20;
        playerStats.shield-=1000;
        this.total3 -= 1;
      }
    },this);

    add4.setInteractive();
    add4.on('pointerdown', function(){
      //increase speed
      if(playerStats.coins>=20){
        playerStats.coins-=20;
        playerStats.speed+=0.1;
        this.total4 += 1;
      }
    },this);

    sub4.setInteractive();
    sub4.on('pointerdown', function(){
      //decrease speed
      if(this.total4>0){
        playerStats.coins+=20;
        playerStats.speed-=0.1;
        this.total4 -= 1;
      }
    },this);

    add5.setInteractive();
    add5.on('pointerdown', function(){
      //increase slowdown duration time
      if(playerStats.coins>=30){
        playerStats.coins-=30;
        playerStats.slowdown+=1000;
        this.total5 += 1;
      }
    },this);

    sub5.setInteractive();
    sub5.on('pointerdown', function(){
      //decrease slowdown duration time
      if(this.total5>0){
        playerStats.coins+=30;
        playerStats.slowdown-=1000;
        this.total5 -= 1;
      }
    },this);

    add6.setInteractive();
    add6.on('pointerdown', function(){
      //increase fire rate upgrade duration time
      if(playerStats.coins>=10){
        playerStats.coins-=10;
        playerStats.fireRate+=1000;
        this.total6 += 1;
      }
    },this);

    sub6.setInteractive();
    sub6.on('pointerdown', function(){
      //decrease fire rate upgrade duration time
      if(this.total6>0){
        playerStats.coins+=10;
        playerStats.fireRate-=1000;
        this.total6 -= 1;
      }
    },this);

    add7.setInteractive();
    add7.on('pointerdown', function(){
      //increase fire rate upgrade duration time
      if(playerStats.coins>=30){
        playerStats.coins-=30;
        playerStats.damage+=1;
        this.total7 += 1;
      }
    },this);

    sub7.setInteractive();
    sub7.on('pointerdown', function(){
      //decrease fire rate upgrade duration time
      if(this.total7>0){
        playerStats.coins+=30;
        playerStats.damage-=1;
        this.total7 -= 1;
      }
    },this);


    this.add.text(320,570,'PRESS "SPACE" TO SAVE CHANGES AND START NEXT LEVEL',{font: "20px Arial", fill: "#00cc00", align: "center" });

    this.input.keyboard.on('keyup_SPACE', function(){
      //pass player's stats to the next scene
      this.scene.start(playerStats.nextLevel,{
        hp:playerStats.hp,
        points:playerStats.points,
        speed:playerStats.speed,
        damage:playerStats.damage,
        coins:playerStats.coins,
        shield:playerStats.shield,
        slowdown:playerStats.slowdown,
        gunUp:playerStats.gunUp,
        fireRate:playerStats.fireRate,
        velocity:playerStats.velocity,
      });
      this.scene.stop('Hangar');
    }, this);
  }
  update(){
    this.playerCoins.text = 'PLAYER COINS: '+playerStats.coins;
    this.totalText1.text = this.total1;
    this.totalText2.text = this.total2;
    this.totalText3.text = this.total3;
    this.totalText4.text = this.total4;
    this.totalText5.text = this.total5;
    this.totalText6.text = this.total6;
    this.totalText7.text = this.total7;
  }
}
