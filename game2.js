var config = {
  type: Phaser.AUTO,
  width: 640,
  height: 480,
  backgroundColor: "#008000",
  parent: 'VectorSnake',
  dom: {
    createContainer: true
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var snake;
var x = 1;
var y = 28;
var food;
var score = 0;
var scoreText;
var moves = 0;
var moveText;

var game = new Phaser.Game(config);

function preload() {
  this.load.image('food', 'assets/food.png');
  this.load.image('body', 'assets/body.png');
  this.load.html("form", "assets/two_coordinates.html")
}

function create() {
  scoreText = this.add.text(16, 39, 'score: 0', {
    fontSize: '24px',
    fill: '#000'
  }).setDepth(11);
  moveText = this.add.text(16, 16, 'moves: 0', {
    fontSize: '24px',
    fill: '#000'
  }).setDepth(11);
  var Food = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,
    initialize: function Food(scene, x, y) {
      Phaser.GameObjects.Image.call(this, scene)

      this.setTexture('food');
      this.setPosition(x * 16, y * 16);
      this.setOrigin(0);
      this.setDepth(13)

      this.total = 0;

      scene.children.add(this);
    },
    eat: function ()
        {
            var x = Phaser.Math.Between(0, 39);
            var y = Phaser.Math.Between(0, 29);

            this.setPosition(x * 16, y * 16);
        }
  })

  var Snake = new Phaser.Class({
    initialize:
      function Snake(scene, x, y) {
        this.headPosition = new Phaser.Geom.Point(x, y);

        this.body = scene.add.group();

        this.head = this.body.create(x * 16, y * 16, 'body');
        this.head.setOrigin(0);
        this.head.setDepth(14)
        this.alive = true;
        this.x = x
        this.y = y

        this.speed = 100;

        this.moveTime = 0;


      },
    update: function (time) {
      if (time >= this.moveTime) {
        return this.move(time)
      }
    },
    move: function (time) {
      this.headPosition.x = globalThis.x;
      this.headPosition.y = globalThis.y;
      //  Update the body segments
      Phaser.Actions.ShiftPosition(this.body.getChildren(), this.headPosition.x * 16, this.headPosition.y * 16, 1);

      //  Update the timer ready for the next movement
      this.moveTime = time + this.speed;
      
      return true;
    },
    collideWithFood: function (food) {
      if(score >= 5) {
        scoreText.setText("Done! You did it in "+moves+" moves")
      }
      else if (this.head.x === food.x && this.head.y === food.y) {
        food.eat();
        score += 1;
        console.log(score)
        scoreText.setText("Score: "+score)
        return true;
      }
      else {
        return false;
      }
    }

  });
  
  snake = new Snake(this, 1, 29);
  snake.depth = 13
  food = new Food(this, Math.floor(Math.random() * 40), Math.floor(Math.random() * 30));
  food.depth = 12
  this.element = this.add.dom(580, 423).createFromCache('form');
  this.element.addListener('click');
  this.element.on('click', function (event) {
    if (event.target.name === 'GoButton') {
      moves += 1;
      moveText.setText("moves: "+moves)
      newY1 = Number.parseInt(this.getChildByName('y1').value);
      newX1 = Number.parseInt(this.getChildByName('x1').value);
      newY2 = Number.parseInt(this.getChildByName('y2').value);
      newX2 = Number.parseInt(this.getChildByName('x2').value);
      globalThis.x += Phaser.Math.Wrap((newX1 ? newX1 : 0),0,30)+Phaser.Math.Wrap((newX2 ? newX2 : 0),0,30);
      globalThis.y -= Phaser.Math.Wrap((newY1 ? newY1 : 0),0,30)+Phaser.Math.Wrap((newY2 ? newY2 : 0),0,30);
      console.log(globalThis.x, globalThis.y)
    }
  })
  var g1 = this.add.grid(320, 240, 640, 480, 16, 16, 0xffffff).depth = 0;
}

function update(time, delta) {
  if (snake.update(time)) {
    snake.collideWithFood(food);
  }
  
}