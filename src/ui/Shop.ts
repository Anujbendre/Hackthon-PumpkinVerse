export interface ShopItem {
  id: string
  name: string
  emoji: string
  description: string
  price: number
  type: 'seed' | 'decoration'
  seedAmount?: number
}

export interface ShopInventory {
  coins: number
  seeds: number
  decorations: string[]
}

export interface PurchaseResult {
  success: boolean
  message: string
  inventory: ShopInventory
}

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'pumpkin-seed',
    name: 'Pumpkin Seed',
    emoji: '🌱',
    description: 'Plant a new pumpkin in your garden.',
    price: 5,
    type: 'seed',
    seedAmount: 1,
  },
  {
    id: 'magic-seed',
    name: 'Magic Seeds',
    emoji: '✨',
    description: 'Get three extra pumpkin seeds.',
    price: 15,
    type: 'seed',
    seedAmount: 3,
  },
  {
    id: 'garden-flower',
    name: 'Garden Flower',
    emoji: '🌻',
    description: 'Decorate your garden with a beautiful flower.',
    price: 20,
    type: 'decoration',
  },
  {
    id: 'garden-lantern',
    name: 'Magic Lantern',
    emoji: '🏮',
    description: 'Add a magical lantern to your garden.',
    price: 30,
    type: 'decoration',
  },
]

export class Shop {
  private inventory: ShopInventory

  constructor(initialInventory: ShopInventory) {
    this.inventory = this.normalizeInventory(initialInventory)
  }

  getInventory(): ShopInventory {
    return {
      coins: this.inventory.coins,
      seeds: this.inventory.seeds,
      decorations: [...this.inventory.decorations],
    }
  }

  setInventory(inventory: ShopInventory): void {
    this.inventory = this.normalizeInventory(inventory)
  }

  buyItem(itemId: string): PurchaseResult {
    const item = SHOP_ITEMS.find((entry) => entry.id === itemId)

    if (!item) {
      return this.result(false, 'Item not found.')
    }

    if (item.type === 'decoration') {
      if (this.inventory.decorations.includes(item.id)) {
        return this.result(false, 'You already own this decoration.')
      }
    }

    if (this.inventory.coins < item.price) {
      return this.result(
        false,
        `Not enough coins! You need ${item.price} coins.`,
      )
    }

    this.inventory.coins -= item.price

    if (item.type === 'seed') {
      this.inventory.seeds += item.seedAmount ?? 1

      return this.result(
        true,
        `Purchased ${item.name}! Seeds added to your inventory.`,
      )
    }

    this.inventory.decorations.push(item.id)

    return this.result(
      true,
      `${item.name} purchased! Check your garden.`,
    )
  }

  private normalizeInventory(
    inventory: ShopInventory,
  ): ShopInventory {
    return {
      coins:
        Number.isFinite(inventory.coins) && inventory.coins >= 0
          ? Math.floor(inventory.coins)
          : 0,

      seeds:
        Number.isFinite(inventory.seeds) && inventory.seeds >= 0
          ? Math.floor(inventory.seeds)
          : 0,

      decorations: Array.isArray(inventory.decorations)
        ? [...new Set(inventory.decorations.filter(
            (id): id is string => typeof id === 'string',
          ))]
        : [],
    }
  }

  private result(
    success: boolean,
    message: string,
  ): PurchaseResult {
    return {
      success,
      message,
      inventory: this.getInventory(),
    }
  }
}