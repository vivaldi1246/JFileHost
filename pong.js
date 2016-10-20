var game = new Phaser.Game(600, 600, Phaser.AUTO, 'gameDiv');
var game_state = {};

// Creates a new 'main' state that wil contain the game
game_state.main = function() {};
game_state.main.prototype = {

  preload: function() {
    
  },

  create: function() {
    game.paddleHeight = 30;
    game.paddleWidth = 100;
    var Paddle = function(low){
      if(low) {
        this.yPos = game.height - (game.paddleHeight / 2 +5);
      } else{
        this.yPos = game.paddleHeight / 2 + 5;
      }
      this.graphics = game.add.graphics(0,0);
      this.graphics.beginFill(0xFFFFFF);
      this.graphics.drawRect(0,0,game.paddleWidth, game.paddleHeight);
      this.paddle = game.add.sprite(game.width / 2, this.yPos, this.graphics.generateTexture());
      this.paddle.anchor.setTo(0.5, 0.5);
      this.graphics.destroy();
      return this.paddle;
    };
    var Ball = function(){
      this.graphics = game.add.graphics(0, 0);
      this.graphics.beginFill(0xFFFFFF);
      this.graphics.drawCircle(0, 0, 40);
      
      this.ball = game.add.sprite(game.width / 4 + (game.width / 2 * Math.random()), game.height * .5, this.graphics.generateTexture());
      this.ball.anchor.setTo(0.5, 0.5);
      this.graphics.destroy();
      return this.ball;
    };
    game.paddle1 = new Paddle(false);
    game.paddle1.velocity = 0;
    game.paddle2 = new Paddle(true);
    game.paddle2.velocity = 0;
    game.ball = new Ball();
    game.ball.direction = Math.floor(Math.random() * 360);
    game.speed = 5;
    game.over = false;
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.enable([game.paddle1, game.paddle2, game.ball]);
    game.paddle1.body.collideWorldBounds = true;
    game.paddle1.body.immovable = true;
    game.paddle2.body.collideWorldBounds =true;
    game.paddle2.body.immovable = true;
    var initialYVel = Math.random() > 0.5 ? -300 : 300;
    var initialXVel = Math.random() * 200 + 100;
    if (Math.random() > 0.5) {
      initialXVel *= -1;
    }
    game.ball.body.velocity.setTo(initialXVel, initialYVel);
    game.ball.body.maxVelocity.setTo(800, 800);
    if(initialYVel < 0){
      game.ball.y += game.height * .10;
    }else{
      game.ball.y -= game.height * .10;
    }
    game.ball.body.collideWorldBounds = true;
    game.ball.body.bounce.set(1.05);
    game.zKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    game.xKey = game.input.keyboard.addKey(Phaser.Keyboard.X);
    game.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    game.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
  },

  update: function() {
    var accel = 50;
    if(game.xKey.isDown){
      game.paddle1.body.velocity.x += accel;
    }else if(game.zKey.isDown){
      game.paddle1.body.velocity.x -= accel;
    }
    game.paddle1.body.velocity.x *= 0.95;
    if(game.rightKey.isDown){
      game.paddle2.body.velocity.x += accel;
    }else if(game.leftKey.isDown){
      game.paddle2.body.velocity.x -= accel;
    }
    game.paddle2.body.velocity.x *= 0.95;
    if(game.physics.arcade.collide(game.ball, game.paddle1)){
      game.ball.body.velocity.x += (game.ball.x - game.paddle1.x) *3;
    }
    if(game.physics.arcade.collide(game.ball, game.paddle2)){
      game.ball.body.velocity.x += (game.ball.x - game.paddle2.x) * 3;
    }
    var gap = 40;
    if(game.ball.y < gap || game.ball.y > game.height - gap){
      if(game.ball.y < gap){
        game.winner = 2;
      }else{
        game.winner = 1;
      }
      game.state.start('endGame');
    }
  },
};
game.state.add('main', game_state.main);

// Creates a new 'endGame' state that will contain the endGame
game_state.endGame = function() {};
game_state.endGame.prototype = {

  preload: function() {
    game.spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
  },

  create: function() {
    var style = {
      font: 'bold 60pt Arial',
      fill: 'white',
      align: 'center',
      wordWrap: true,
      wordWrapWidth: game.width -50
    };
    var title = game.add.text(game.width /2, game.height /2, "Player " + game.winner + " wins!", style);
    title.anchor.setTo(0.5, 0.5);
  },

  update: function() {
    if(game.spaceBar.isDown){
      game.state.start('main');
    }
  },
};

game.state.add('endGame', game_state.endGame);
game.state.start('main');
