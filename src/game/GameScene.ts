import Phaser from 'phaser'
import { ShopUI } from '../ui/ShopUI'
import type { ShopInventory } from '../ui/Shop'
import { DailyRewardsUI } from '../ui/DailyRewardsUI'

type PumpkinStage = 'empty' | 'seed' | 'growing' | 'ready'

interface GardenPlot {
  x: number
  y: number
  stage: PumpkinStage
  pumpkin: Phaser.GameObjects.Text
  growthTimer?: Phaser.Time.TimerEvent
  soil: Phaser.GameObjects.Ellipse
  readyAt?: number
}

interface SavedPlot {
  stage: PumpkinStage
  readyAt?: number
}

interface SavedGame {
  coins: number
  seeds: number
  harvested: number
  plots: SavedPlot[]
  decorations?: string[]
}

const SAVE_KEY = 'pumpkinverse-save-v2'
const INITIAL_SEEDS = 5
const HARVEST_REWARD = 10
const GROWTH_TIME = 5000

export default class GameScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Text

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

  private wasd!: {
    up: Phaser.Input.Keyboard.Key
    down: Phaser.Input.Keyboard.Key
    left: Phaser.Input.Keyboard.Key
    right: Phaser.Input.Keyboard.Key
  }

  private plots: GardenPlot[] = []

  private statusText!: Phaser.GameObjects.Text
  private coinsText!: Phaser.GameObjects.Text
  private seedsText!: Phaser.GameObjects.Text
  private harvestedText!: Phaser.GameObjects.Text
  private interactionText!: Phaser.GameObjects.Text

  private coins = 0
  private seeds = INITIAL_SEEDS
  private harvested = 0
  private shopUI!: ShopUI
  private dailyRewardsUI!: DailyRewardsUI
  private decorations: string[] = []
  private purchasedDecorationObjects: Phaser.GameObjects.Text[] = []

  private selectedPlot: GardenPlot | null = null

  private readonly moveSpeed = 220
  private readonly interactionDistance = 115

  private shuttingDown = false

  constructor() {
    super('GameScene')
  }

  // ========================================
  // LOAD SAVED PROGRESS
  // ========================================

  private loadProgress(): SavedGame | null {
    try {
      const raw = localStorage.getItem(SAVE_KEY)

      if (!raw) return null

      const data: unknown = JSON.parse(raw)

      if (!data || typeof data !== 'object') return null

      const saved = data as Partial<SavedGame>

      this.coins =
        typeof saved.coins === 'number' &&
        Number.isFinite(saved.coins) &&
        saved.coins >= 0
          ? Math.floor(saved.coins)
          : 0

      this.seeds =
        typeof saved.seeds === 'number' &&
        Number.isFinite(saved.seeds) &&
        saved.seeds >= 0
          ? Math.floor(saved.seeds)
          : INITIAL_SEEDS

      this.harvested =
        typeof saved.harvested === 'number' &&
        Number.isFinite(saved.harvested) &&
        saved.harvested >= 0
          ? Math.floor(saved.harvested)
          : 0

      this.decorations = Array.isArray(saved.decorations)
        ? saved.decorations.filter((item): item is string => typeof item === 'string')
        : []

      return saved as SavedGame
    } catch {
      console.warn('Could not load saved garden progress.')
      return null
    }
  }

  // ========================================
  // SAVE PROGRESS
  // ========================================

  private saveProgress(): void {
    const data: SavedGame = {
      coins: this.coins,
      seeds: this.seeds,
      harvested: this.harvested,
      decorations: [...this.decorations],

      plots: this.plots.map((plot) => ({
        stage: plot.stage,
        readyAt: plot.readyAt,
      })),
    }

    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data))
    } catch {
      this.setStatus(
        'Unable to save progress. Check browser storage settings.',
      )
    }
  }

  // ========================================
  // CREATE SCENE
  // ========================================

  create(): void {
    this.shuttingDown = false
    this.plots = []
    this.selectedPlot = null
    this.decorations = []

    const { width, height } = this.scale

    const saved = this.loadProgress()

    // Sky background.
    this.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x49304f,
    )

    this.add.rectangle(
      width / 2,
      height * 0.25,
      width,
      height * 0.5,
      0x49304f,
    )

    // Grass.
    this.add.rectangle(
      width / 2,
      height * 0.75,
      width,
      height * 0.5,
      0x35513a,
    )

    // Sky decorations.
    this.add.text(35, 25, '🌙', {
      fontSize: '30px',
    })

    this.add.text(width - 90, 25, '☀️', {
      fontSize: '30px',
    })

    this.add.text(width * 0.2, height * 0.25, '☁️', {
      fontSize: '28px',
    })

    this.add.text(width * 0.8, height * 0.3, '☁️', {
      fontSize: '25px',
    })

    // Game title.
    this.add.text(20, 18, 'PUMPKINVERSE', {
      fontSize: '19px',
      color: '#ffb366',
      fontStyle: 'bold',
    })

    // HUD.
    this.coinsText = this.add.text(20, 55, '', {
      fontSize: '14px',
      color: '#ffd166',
      fontStyle: 'bold',
    })

    this.seedsText = this.add.text(20, 78, '', {
      fontSize: '14px',
      color: '#c6f6a3',
      fontStyle: 'bold',
    })

    this.harvestedText = this.add.text(20, 101, '', {
      fontSize: '14px',
      color: '#ffffff',
    })

    this.statusText = this.add.text(20, 130, '', {
      fontSize: '13px',
      color: '#ffffff',
      wordWrap: {
        width: width - 40,
      },
    })

    this.interactionText = this.add.text(
      width / 2,
      height - 28,
      '',
      {
        fontSize: '13px',
        color: '#ffffff',
        align: 'center',
      },
    ).setOrigin(0.5)

    // Create three plots and restore their saved states.
    this.createPlots(saved?.plots ?? [])

    // Connect shop and daily rewards to the real inventory and save system.
    this.initializeShop()
    this.initializeDailyRewards()

    // Show decorations purchased in earlier sessions.
    this.renderPurchasedDecorations()

    // Daily rewards button.
    const rewardsButton = this.add
      .text(width - 150, 18, '🎁 REWARDS', {
        fontSize: '14px',
        color: '#ffffff',
        backgroundColor: '#b45309',
        padding: { x: 10, y: 10 },
        fontStyle: 'bold',
      })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(1000)
      .setInteractive({ useHandCursor: true })

    rewardsButton.on('pointerdown', () => {
      this.dailyRewardsUI.open()
    })

    // Shop button.
    const shopButton = this.add
      .text(width - 20, 18, '🛒 SHOP', {
        fontSize: '16px',
        color: '#ffffff',
        backgroundColor: '#7c3aed',
        padding: { x: 12, y: 9 },
        fontStyle: 'bold',
      })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(1000)
      .setInteractive({ useHandCursor: true })

    shopButton.on('pointerdown', () => {
      this.shopUI.open()
    })

    // Flowers.
    this.add.text(50, height * 0.7, '🌼', {
      fontSize: '24px',
    })

    this.add.text(width - 65, height * 0.7, '🌷', {
      fontSize: '24px',
    })

    // Farmer starts below the plots.
    this.player = this.add.text(
      width / 2,
      height * 0.82,
      '🧑‍🌾',
      {
        fontSize: '42px',
      },
    ).setOrigin(0.5)

    this.player.setDepth(10)

    // Keyboard.
    if (!this.input.keyboard) {
      throw new Error('Keyboard input is unavailable.')
    }

    this.cursors = this.input.keyboard.createCursorKeys()

    this.wasd = {
      up: this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.W,
      ),
      down: this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.S,
      ),
      left: this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.A,
      ),
      right: this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.D,
      ),
    }

    this.input.keyboard.on('keydown-E', this.interact, this)

    this.events.once('shutdown', this.handleShutdown, this)
    this.events.once('destroy', this.handleShutdown, this)

    this.updateHUD()

    this.setStatus(
      'Welcome to your garden! Walk beside a plot and press E.',
    )

    this.updateSelectedPlot()
  }

  // ========================================
  // SHOP INTEGRATION
  // ========================================

  private initializeShop(): void {
    this.shopUI = new ShopUI({
      getInventory: (): ShopInventory => ({
        coins: this.coins,
        seeds: this.seeds,
        decorations: [...this.decorations],
      }),
      onInventoryChange: (inventory: ShopInventory): void => {
        this.coins = inventory.coins
        this.seeds = inventory.seeds
        this.decorations = [...inventory.decorations]
        this.renderPurchasedDecorations()
        this.updateHUD()
        this.saveProgress()
        this.setStatus('Shop purchase successful! Your inventory has been saved.')
      },
    })
  }


  // ========================================
  // DAILY REWARDS INTEGRATION
  // ========================================

  private initializeDailyRewards(): void {
    this.dailyRewardsUI = new DailyRewardsUI({
      getInventory: () => ({
        coins: this.coins,
        seeds: this.seeds,
      }),
      onClaim: (reward) => {
        this.coins += reward.coins
        this.seeds += reward.seeds
        this.updateHUD()
        this.saveProgress()
        this.setStatus(
          `Daily reward claimed! +${reward.coins} coins and +${reward.seeds} seeds.`,
        )
      },
    })
  }

  // ========================================
  // DISPLAY PURCHASED DECORATIONS
  // ========================================

  private renderPurchasedDecorations(): void {
    // Remove the previously rendered purchased decorations before redrawing.
    for (const object of this.purchasedDecorationObjects) {
      object.destroy()
    }
    this.purchasedDecorationObjects = []

    const { width, height } = this.scale
    const positions = [
      { x: width * 0.12, y: height * 0.66 },
      { x: width * 0.88, y: height * 0.66 },
      { x: width * 0.12, y: height * 0.76 },
      { x: width * 0.88, y: height * 0.76 },
      { x: width * 0.5, y: height * 0.70 },
    ]

    const decorationEmoji: Record<string, string> = {
      'garden-flower': '🌻',
      'garden-lantern': '🏮',
    }

    this.decorations.forEach((decorationId, index) => {
      const emoji = decorationEmoji[decorationId]
      if (!emoji) return

      const position = positions[index % positions.length]
      const decoration = this.add.text(position.x, position.y, emoji, {
        fontSize: decorationId === 'garden-lantern' ? '30px' : '28px',
      })
      decoration.setOrigin(0.5)
      decoration.setDepth(5)
      decoration.setData('purchasedDecorationId', decorationId)
      this.purchasedDecorationObjects.push(decoration)
    })
  }

  // ========================================
  // CREATE THREE GARDEN PLOTS
  // ========================================

  private createPlots(savedPlots: SavedPlot[]): void {
    const { width, height } = this.scale

    const positions = [
      { x: width * 0.25, y: height * 0.53 },
      { x: width * 0.5, y: height * 0.53 },
      { x: width * 0.75, y: height * 0.53 },
    ]

    const validStages: PumpkinStage[] = [
      'empty',
      'seed',
      'growing',
      'ready',
    ]

    const emojis: Record<PumpkinStage, string> = {
      empty: '🪴',
      seed: '🌱',
      growing: '🌿',
      ready: '🎃',
    }

    positions.forEach((position, index) => {
      // Outer soil.
      const outerSoil = this.add.ellipse(
        position.x,
        position.y,
        125,
        85,
        0x70452e,
      )

      outerSoil.setDepth(1)

      // Inner soil.
      const soil = this.add.ellipse(
        position.x,
        position.y,
        110,
        70,
        0x96603b,
      )

      soil.setDepth(2)

      // Plot label.
      const label = this.add.text(
        position.x,
        position.y - 58,
        `PLOT ${index + 1}`,
        {
          fontSize: '12px',
          color: '#ffe0b0',
          fontStyle: 'bold',
        },
      ).setOrigin(0.5)

      label.setDepth(3)

      const saved = savedPlots[index]

      const stage: PumpkinStage =
        saved && validStages.includes(saved.stage)
          ? saved.stage
          : 'empty'

      // Crop emoji.
      const pumpkin = this.add.text(
        position.x,
        position.y,
        emojis[stage],
        {
          fontSize: '34px',
        },
      ).setOrigin(0.5)

      pumpkin.setDepth(4)

      const plot: GardenPlot = {
        ...position,
        stage,
        pumpkin,
        soil,
        readyAt:
          typeof saved?.readyAt === 'number'
            ? saved.readyAt
            : undefined,
      }

      this.plots.push(plot)

      // Restore growth using its saved timestamp.
      if (plot.stage === 'growing') {
        this.resumeGrowth(plot)
      }
    })
  }

  // ========================================
  // PLAYER MOVEMENT AND COLLISION
  // ========================================

  update(
    _time: number,
    delta: number,
  ): void {
    if (this.shuttingDown) return

    const distance = this.moveSpeed * delta / 1000

    let dx = 0
    let dy = 0

    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      dx -= 1
    }

    if (this.cursors.right.isDown || this.wasd.right.isDown) {
      dx += 1
    }

    if (this.cursors.up.isDown || this.wasd.up.isDown) {
      dy -= 1
    }

    if (this.cursors.down.isDown || this.wasd.down.isDown) {
      dy += 1
    }

    if (dx !== 0 || dy !== 0) {
      const direction = new Phaser.Math.Vector2(dx, dy).normalize()

      const nextX = this.player.x + direction.x * distance
      const nextY = this.player.y + direction.y * distance

      // Resolve horizontal and vertical movement separately.
      if (!this.collidesWithPlot(nextX, this.player.y)) {
        this.player.x = nextX
      }

      if (!this.collidesWithPlot(this.player.x, nextY)) {
        this.player.y = nextY
      }
    }

    const { width, height } = this.scale

    this.player.x = Phaser.Math.Clamp(
      this.player.x,
      25,
      width - 25,
    )

    this.player.y = Phaser.Math.Clamp(
      this.player.y,
      155,
      height - 45,
    )

    this.updateSelectedPlot()
  }

  // ========================================
  // COLLISION DETECTION
  // ========================================

  private collidesWithPlot(x: number, y: number): boolean {
    const radiusX = 78
    const radiusY = 57

    for (const plot of this.plots) {
      const dx = x - plot.x
      const dy = y - plot.y

      const normalizedDistance =
        (dx * dx) / (radiusX * radiusX) +
        (dy * dy) / (radiusY * radiusY)

      if (normalizedDistance < 1) {
        return true
      }
    }

    return false
  }

  // ========================================
  // SELECT NEAREST PLOT
  // ========================================

  private updateSelectedPlot(): void {
    let nearest: GardenPlot | null = null
    let nearestDistance = this.interactionDistance

    for (const plot of this.plots) {
      const distance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        plot.x,
        plot.y,
      )

      if (distance <= nearestDistance) {
        nearest = plot
        nearestDistance = distance
      }
    }

    this.selectedPlot = nearest

    for (const plot of this.plots) {
      plot.soil.setStrokeStyle(
        plot === nearest ? 3 : 0,
        0xffb366,
      )
    }

    if (!nearest) {
      this.interactionText.setText(
        'Walk beside a garden plot to interact.',
      )
      return
    }

    const instructions: Record<PumpkinStage, string> = {
      empty: 'Press E to plant a seed.',
      seed: 'Press E to water the seed.',
      growing: 'Your pumpkin is growing...',
      ready: 'Press E to harvest (+10 coins, +1 seed).',
    }

    this.interactionText.setText(
      `Plot ${this.plots.indexOf(nearest) + 1}: ${instructions[nearest.stage]}`,
    )
  }

  // ========================================
  // INTERACT
  // ========================================

  private interact(): void {
    if (this.shuttingDown) return

    if (!this.selectedPlot) {
      this.setStatus(
        'Walk beside a garden plot before pressing E.',
      )
      return
    }

    const plot = this.selectedPlot

    switch (plot.stage) {
      case 'empty':
        this.plantSeed(plot)
        break

      case 'seed':
        this.waterSeed(plot)
        break

      case 'growing':
        this.setStatus('This pumpkin is still growing!')
        break

      case 'ready':
        this.harvestPumpkin(plot)
        break
    }

    this.updateHUD()
    this.saveProgress()
    this.updateSelectedPlot()
  }

  // ========================================
  // PLANT
  // ========================================

  private plantSeed(plot: GardenPlot): void {
    if (this.seeds <= 0) {
      this.setStatus(
        'No seeds left! Harvest a pumpkin to receive another seed.',
      )
      return
    }

    this.seeds -= 1
    plot.stage = 'seed'
    plot.readyAt = undefined

    plot.pumpkin.setText('🌱')

    this.setStatus(
      `Seed planted in Plot ${this.plots.indexOf(plot) + 1}. Press E again to water it.`,
    )
  }

  // ========================================
  // WATER
  // ========================================

  private waterSeed(plot: GardenPlot): void {
    plot.stage = 'growing'
    plot.readyAt = Date.now() + GROWTH_TIME

    plot.pumpkin.setText('🌿')

    this.setStatus(
      'Watered! Your pumpkin will be ready in five seconds.',
    )

    this.startGrowthTimer(plot)
  }

  // ========================================
  // GROWTH AND RESTORE
  // ========================================

  private resumeGrowth(plot: GardenPlot): void {
    const readyAt =
      typeof plot.readyAt === 'number'
        ? plot.readyAt
        : Date.now() + GROWTH_TIME

    plot.readyAt = readyAt

    const remaining = readyAt - Date.now()

    if (remaining <= 0) {
      plot.stage = 'ready'
      plot.readyAt = undefined
      plot.pumpkin.setText('🎃')

      return
    }

    plot.pumpkin.setText('🌿')

    this.startGrowthTimer(plot, remaining)
  }

  private startGrowthTimer(
    plot: GardenPlot,
    duration = GROWTH_TIME,
  ): void {
    plot.growthTimer?.remove()

    plot.growthTimer = this.time.delayedCall(
      Math.max(0, duration),
      () => {
        if (this.shuttingDown) return

        if (plot.stage !== 'growing') return

        plot.stage = 'ready'
        plot.readyAt = undefined

        plot.pumpkin.setText('🎃')

        this.setStatus(
          `Plot ${this.plots.indexOf(plot) + 1}: Pumpkin ready to harvest!`,
        )

        this.updateHUD()
        this.saveProgress()
        this.updateSelectedPlot()
      },
    )
  }

  // ========================================
  // HARVEST
  // ========================================

  private harvestPumpkin(plot: GardenPlot): void {
    if (plot.stage !== 'ready') return

    this.coins += HARVEST_REWARD
    this.harvested += 1
    this.seeds += 1

    plot.stage = 'empty'
    plot.readyAt = undefined

    plot.pumpkin.setText('🪴')

    this.setStatus(
      `Pumpkin harvested! +${HARVEST_REWARD} coins and +1 seed.`,
    )
  }

  // ========================================
  // HUD
  // ========================================

  private updateHUD(): void {
    this.coinsText.setText(`🪙 Coins: ${this.coins}`)
    this.seedsText.setText(`🌱 Seeds: ${this.seeds}`)

    this.harvestedText.setText(
      `🎃 Harvested: ${this.harvested}`,
    )
  }

  private setStatus(message: string): void {
    if (this.statusText) {
      this.statusText.setText(message)
    }
  }

  // ========================================
  // SHUTDOWN
  // ========================================

  private handleShutdown(): void {
    if (this.shuttingDown) return

    this.shuttingDown = true

    this.shopUI?.close()
    this.dailyRewardsUI?.close()

    for (const plot of this.plots) {
      plot.growthTimer?.remove()
    }

    this.shopUI?.close()
    this.saveProgress()

    this.input.keyboard?.off(
      'keydown-E',
      this.interact,
      this,
    )
  }
}