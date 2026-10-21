import Phaser from 'phaser'
import { gameConfig } from './gameConfig'

let activeGame: Phaser.Game | null = null

export function startGame(container: HTMLElement): Phaser.Game {
  if (activeGame) {
    activeGame.destroy(true)
    activeGame = null
  }

  activeGame = new Phaser.Game({
    ...gameConfig,
    parent: container,
  })

  return activeGame
}

export function stopGame(): void {
  if (activeGame) {
    activeGame.destroy(true)
    activeGame = null
  }
}