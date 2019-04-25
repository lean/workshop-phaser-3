import Phaser from 'phaser'

import ScrollingBackground from '../utils/ScrollingBackground'
import Player from '../sprites/Player'

var bulletTime = 0
var firingTimer = 0
var livingEnemies = []

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'GameScene' })
  }

  create () {
    this.enemies = this.add.group()
    this.enemyLasers = this.add.group()
    this.playerLasers = this.add.group()

    this.backgrounds = []
    for (let i = 0; i < 5; i++) {
      const keys = ['bg0', 'bg1']
      const key = keys[Phaser.Math.Between(0, keys.length - 1)]
      const bg = new ScrollingBackground(this, key, i * 10)
      this.backgrounds.push(bg)
    }

    this.player = new Player(
      this,
      this.game.config.width * 0.5,
      this.game.config.height * 0.5,
      'player'
    )

    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    this.keySpace = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    )
  }

  update () {
    if (!this.player.getData('isDead')) {
      this.player.update()
      if (this.keyW.isDown) {
        this.player.moveUp()
      } else if (this.keyS.isDown) {
        this.player.moveDown()
      }
      if (this.keyA.isDown) {
        this.player.moveLeft()
      } else if (this.keyD.isDown) {
        this.player.moveRight()
      }

      if (this.keySpace.isDown) {
        this.player.setData('isShooting', true)
      } else {
        this.player.setData(
          'timerShootTick',
          this.player.getData('timerShootDelay') - 1
        )
        this.player.setData('isShooting', false)
      }
    }

    for (var i = 0; i < this.backgrounds.length; i++) {
      this.backgrounds[i].update()
    }
  }
}
