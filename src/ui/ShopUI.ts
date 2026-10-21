import {
  SHOP_ITEMS,
  Shop,
  type ShopInventory,
} from './Shop'

export interface ShopUIOptions {
  getInventory: () => ShopInventory
  onInventoryChange: (inventory: ShopInventory) => void
}

export class ShopUI {
  private readonly shop: Shop
  private readonly options: ShopUIOptions

  private overlay: HTMLDivElement | null = null
  private message = ''
  private messageSuccess = false

  constructor(options: ShopUIOptions) {
    this.options = options
    this.shop = new Shop(options.getInventory())
  }

  open(): void {
    if (this.overlay) {
      return
    }

    this.shop.setInventory(this.options.getInventory())

    const overlay = document.createElement('div')
    overlay.className = 'shop-overlay'
    overlay.setAttribute('role', 'dialog')
    overlay.setAttribute('aria-modal', 'true')
    overlay.setAttribute('aria-labelledby', 'pumpkin-shop-title')

    overlay.innerHTML = `
      <section class="shop-panel">
        <header class="shop-header">
          <div>
            <p class="shop-eyebrow">PUMPKINVERSE MARKET</p>
            <h2 id="pumpkin-shop-title">🎃 Garden Shop</h2>
            <p class="shop-subtitle">
              Grow your garden and make it magical.
            </p>
          </div>

          <button
            type="button"
            class="shop-close"
            data-action="close"
            aria-label="Close shop"
          >✕</button>
        </header>

        <div class="shop-wallet">
          <span>🪙 Coins: <strong data-wallet="coins">0</strong></span>
          <span>🌱 Seeds: <strong data-wallet="seeds">0</strong></span>
          <span>🎒 Decorations: <strong data-wallet="decorations">0</strong></span>
        </div>

        <div
          class="shop-message"
          data-role="message"
          role="status"
          aria-live="polite"
        ></div>

        <div class="shop-grid">
          ${SHOP_ITEMS.map((item) => `
            <article class="shop-item">
              <div class="shop-item-emoji" aria-hidden="true">
                ${item.emoji}
              </div>

              <h3>${item.name}</h3>
              <p class="shop-item-description">
                ${item.description}
              </p>

              <p class="shop-price">🪙 ${item.price} coins</p>

              <button
                type="button"
                class="shop-buy"
                data-buy="${item.id}"
              >
                Buy
              </button>
            </article>
          `).join('')}
        </div>

        <footer class="shop-footer">
          <span>Harvest pumpkins to earn more coins!</span>
        </footer>
      </section>
    `

    this.overlay = overlay
    document.body.appendChild(overlay)

    overlay.addEventListener('click', this.handleClick)
    overlay.addEventListener('keydown', this.handleKeyDown)

    this.updateWallet()

    const closeButton = overlay.querySelector<HTMLButtonElement>(
      '[data-action="close"]',
    )

    closeButton?.focus()
  }

  close(): void {
    if (!this.overlay) {
      return
    }

    this.overlay.removeEventListener('click', this.handleClick)
    this.overlay.removeEventListener('keydown', this.handleKeyDown)
    this.overlay.remove()

    this.overlay = null
  }

  private handleClick = (event: MouseEvent): void => {
    const target = event.target

    if (!(target instanceof Element)) {
      return
    }

    if (target === this.overlay) {
      this.close()
      return
    }

    const closeButton = target.closest('[data-action="close"]')

    if (closeButton) {
      this.close()
      return
    }

    const buyButton = target.closest<HTMLButtonElement>('[data-buy]')

    if (buyButton) {
      const itemId = buyButton.dataset.buy

      if (itemId) {
        this.purchase(itemId)
      }
    }
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      this.close()
    }
  }

  private purchase(itemId: string): void {
    this.shop.setInventory(this.options.getInventory())

    const result = this.shop.buyItem(itemId)

    this.message = result.message
    this.messageSuccess = result.success

    if (result.success) {
      this.options.onInventoryChange(result.inventory)
    }

    this.updateWallet()
  }

  private updateWallet(): void {
    if (!this.overlay) {
      return
    }

    this.shop.setInventory(this.options.getInventory())

    const inventory = this.shop.getInventory()

    const coins = this.overlay.querySelector<HTMLElement>(
      '[data-wallet="coins"]',
    )

    const seeds = this.overlay.querySelector<HTMLElement>(
      '[data-wallet="seeds"]',
    )

    const decorations = this.overlay.querySelector<HTMLElement>(
      '[data-wallet="decorations"]',
    )

    if (coins) coins.textContent = String(inventory.coins)
    if (seeds) seeds.textContent = String(inventory.seeds)

    if (decorations) {
      decorations.textContent = String(inventory.decorations.length)
    }

    const messageElement = this.overlay.querySelector<HTMLElement>(
      '[data-role="message"]',
    )

    if (messageElement) {
      messageElement.textContent = this.message
      messageElement.classList.toggle(
        'is-success',
        this.messageSuccess,
      )
      messageElement.classList.toggle(
        'is-error',
        this.message !== '' && !this.messageSuccess,
      )
    }

    for (const item of SHOP_ITEMS) {
      const button = this.overlay.querySelector<HTMLButtonElement>(
        `[data-buy="${item.id}"]`,
      )

      if (!button) {
        continue
      }

      const owned =
        item.type === 'decoration' &&
        inventory.decorations.includes(item.id)

      const affordable = inventory.coins >= item.price

      button.disabled = owned || !affordable

      if (owned) {
        button.textContent = 'Owned ✓'
      } else if (!affordable) {
        button.textContent = 'Not enough coins'
      } else {
        button.textContent = 'Buy'
      }
    }
  }
}