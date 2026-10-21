import Phaser from 'phaser'
import GameScene from './GameScene'

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,

  width: 960,
  height: 540,

  parent: 'pumpkin-game',

  backgroundColor: '#25172f',

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 960,
    height: 540,
  },

  scene: [GameScene],
}