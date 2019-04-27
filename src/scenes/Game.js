import Phaser from 'phaser'

import ScrollingBackground from '../utils/ScrollingBackground'
import Player from '../sprites/Player'
import Enemy from '../sprites/Enemy'

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'GameScene' })
  }

  create () {
    this.anims.create({
      key: 'sprExplosion',
      frames: this.anims.generateFrameNumbers('sprExplosion'),
      frameRate: 20,
      repeat: 0
    })

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

    this.time.addEvent({
      delay: 1000,
      callback: function () {
        var enemy = null

        if (Phaser.Math.Between(0, 10) >= 3) {
          enemy = new Enemy(
            this,
            Phaser.Math.Between(0, this.game.config.width),
            0
          )
        }

        if (enemy !== null) {
          enemy.setScale(Phaser.Math.Between(10, 20) * 0.1)
          this.enemies.add(enemy)
        }
      },
      callbackScope: this,
      loop: true
    })

    this.physics.add.collider(this.playerLasers, this.enemies, function (
      playerLaser,
      enemy
    ) {
      if (enemy) {
        if (enemy.onDestroy !== undefined) {
          enemy.onDestroy()
        }
        enemy.explode(true)
        playerLaser.destroy()
      }
    })

    this.physics.add.overlap(this.player, this.enemies, function (
      player,
      enemy
    ) {
      if (!player.getData('isDead') && !enemy.getData('isDead')) {
        player.explode(false)
        player.onDestroy()
        enemy.explode(true)
      }
    })

    this.physics.add.overlap(this.player, this.enemyLasers, function (
      player,
      laser
    ) {
      if (!player.getData('isDead') && !laser.getData('isDead')) {
        player.explode(false)
        player.onDestroy()
        laser.destroy()
      }
    })
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
