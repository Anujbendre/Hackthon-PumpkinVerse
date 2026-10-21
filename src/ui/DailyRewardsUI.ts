import { DailyRewards } from './DailyRewards'

export interface DailyRewardsUIOptions {
  getInventory: () => {
    coins: number
    seeds: number
  }

  onClaim: (reward: {
    coins: number
    seeds: number
  }) => void
}

export class DailyRewardsUI {
  private readonly rewards = new DailyRewards()
  private readonly options: DailyRewardsUIOptions

  private overlay: HTMLDivElement | null = null

  constructor(options: DailyRewardsUIOptions) {
    this.options = options
  }

  open(): void {
    if (this.overlay) {
      return
    }

    const overlay = document.createElement('div')
    overlay.className = 'daily-rewards-overlay'
    overlay.setAttribute('role', 'dialog')
    overlay.setAttribute('aria-modal', 'true')
    overlay.setAttribute('aria-labelledby', 'daily-rewards-title')

    overlay.innerHTML = `
      <section class="daily-rewards-panel">
        <button
          class="daily-rewards-close"
          type="button"
          data-action="close"
          aria-label="Close daily rewards"
        >✕</button>

        <div class="daily-rewards-icon">🎁</div>

        <p class="daily-rewards-eyebrow">
          PUMPKINVERSE BONUS
        </p>

        <h2 id="daily-rewards-title">
          Daily Rewards
        </h2>

        <p class="daily-rewards-description">
          Come back every day to collect your garden bonus!
        </p>

        <div class="daily-rewards-cards">
          <article class="daily-reward-card">
            <span>🪙</span>
            <strong>+15</strong>
            <small>Coins</small>
          </article>

          <article class="daily-reward-card">
            <span>🌱</span>
            <strong>+2</strong>
            <small>Seeds</small>
          </article>
        </div>

        <p
          class="daily-rewards-message"
          data-role="message"
          role="status"
          aria-live="polite"
        ></p>

        <button
          type="button"
          class="daily-rewards-claim"
          data-action="claim"
        >
          Claim Daily Reward
        </button>

        <p class="daily-rewards-note">
          One claim per calendar day.
        </p>
      </section>
    `

    this.overlay = overlay
    document.body.appendChild(overlay)

    overlay.addEventListener('click', this.handleClick)
    overlay.addEventListener('keydown', this.handleKeyDown)

    this.updateButton()

    overlay.querySelector<HTMLButtonElement>(
      '[data-action="close"]',
    )?.focus()
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

    if (target.closest('[data-action="close"]')) {
      this.close()
      return
    }

    if (target.closest('[data-action="claim"]')) {
      this.claimReward()
    }
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      this.close()
    }
  }

  private claimReward(): void {
    const result = this.rewards.claim()

    const message = this.overlay?.querySelector<HTMLElement>(
      '[data-role="message"]',
    )

    if (message) {
      message.textContent = result.message
      message.classList.toggle('is-success', result.success)
      message.classList.toggle('is-error', !result.success)
    }

    if (result.success) {
      this.options.onClaim({
        coins: result.coinsAwarded,
        seeds: result.seedsAwarded,
      })
    }

    this.updateButton()
  }

  private updateButton(): void {
    const button = this.overlay?.querySelector<HTMLButtonElement>(
      '[data-action="claim"]',
    )

    if (!button) {
      return
    }

    const canClaim = this.rewards.canClaimToday()

    button.disabled = !canClaim
    button.textContent = canClaim
      ? 'Claim Daily Reward'
      : 'Already Claimed Today'
  }
}