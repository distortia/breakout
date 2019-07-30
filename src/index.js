import Phaser from "phaser"
import ballImage from './assets/ball.png'
import greenBrick from './assets/green-brick.png'
import redBrick from './assets/red-brick.png'
import yellowBrick from './assets/yellow-brick.png'
import playerImage from './assets/player.png'

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 600,
  height: 800,
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    }
  }
}

const game = new Phaser.Game(config)
const ballSpeed = 200
const playerSpeed = 500
let ball, redBricks, yellowBricks, greenBricks, scoreText, player, floor, gameOverText
let score = 0

function preload() {
  this.load.image('ball', ballImage)
  this.load.image('greenBrick', greenBrick)
  this.load.image('yellowBrick', yellowBrick)
  this.load.image('redBrick', redBrick)
  this.load.image('player', playerImage)
  scoreText = this.add.text(20, 16, 'Score: 0', {fontSize: '32px', fill: '#000'})
}

function create() {
  this.cameras.main.backgroundColor.setTo(255,255,255)
  this.physics.world.setBounds(0, 0, 600, 800)

  gameOverText = this.add.text(250, 400, '', {fontSize: '32px', fill: '#000'})
  floor        = this.physics.add.sprite(600, 800, '').setScale(100, 1).setImmovable(true)
  player       = this.physics.add.sprite(300, 750, 'player').setScale(2, 1).setImmovable(true)
  ball         = this.physics.add.sprite(300, 400, 'ball')
  redBricks    = this.physics.add.staticGroup({
    key: 'redBrick',
    repeat: 8,
    setXY: {x: 25, y: 200, stepX: 75},
  })
  yellowBricks = this.physics.add.staticGroup({
    key: 'yellowBrick',
    repeat: 8,
    setXY: {x: 50, y: 225, stepX: 75},
  })
  greenBricks = this.physics.add.staticGroup({
    key: 'greenBrick',
    repeat: 8,
    setXY: {x: 25, y: 250, stepX: 75},
  })


  this.physics.add.collider(player, ball, reflectBall, null, null)
  this.physics.add.collider(ball, floor, endGame, null, null)
  this.physics.add.overlap(ball, redBricks, hitBrick, null, this)
  this.physics.add.overlap(ball, yellowBricks, hitBrick, null, this)
  this.physics.add.overlap(ball, greenBricks, hitBrick, null, this)

  floor.setBounce(0).setAlpha(0)
  player.setCollideWorldBounds(true).setBounce(0)
  ball.setCollideWorldBounds(true).setBounce(1)
  ball.setVelocityY(ballSpeed)
  ball.setFriction(0)
}

function update() {
  let cursors = this.input.keyboard.createCursorKeys()
  if(cursors.left.isDown) {
    player.setVelocityX(-playerSpeed)
  } else if(cursors.right.isDown) {
    player.setVelocityX(playerSpeed)
  } else {
    player.setVelocityX(0)
  }
}

function hitBrick(ball, brick) {
  brick.disableBody(true, true)
  // brick.disableBody(true, true)
  reflectBall(brick, ball)
  updateScore()
  // if (greenBricks.countActive(true) === 0 && yellowBricks.countActive(true) === 0 && redBricks.countActive(true) === 0) {
  //   gameOverText.setText('You win!')
  // } 
}

function reflectBall(player,ball) {
  let newY = -ballSpeed
  let newX
  // beepSound.play()
  if (ball.x < player.x) {
    newX = -(player.x - ball.x) * ball.body.angle * 2
  } else if (ball.x > player.x) {
    newX = -(player.x - ball.x) * ball.body.angle * 2
  } else {
    newX = 0
  }
  ball.setVelocity(newX, newY)
}

function updateScore() {
  score += 10
  scoreText.setText(`Score: ${score}`)
}
function endGame () {
  gameOverText.setText('GAME OVER')
  ball.setVelocity(0)
}