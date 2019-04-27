import Phaser from 'phaser'
import Entity from './Entity'

export default class Enemy extends Entity {
  constructor (scene, x, y) {
    super(scene, x, y, 'enemy', 'enemy')

    this.body.velocity.y = Phaser.Math.Between(50, 100)
  }
}
