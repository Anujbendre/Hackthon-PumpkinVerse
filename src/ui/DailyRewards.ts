export interface DailyRewardState {
  lastClaimDate: string | null
  coins: number
  seeds: number
}

export interface DailyRewardResult {
  success: boolean
  message: string
  coinsAwarded: number
  seedsAwarded: number
  state: DailyRewardState
}

const REWARD_STORAGE_KEY = 'pumpkinverse-daily-rewards-v1'

const DAILY_COINS = 15
const DAILY_SEEDS = 2

export class DailyRewards {
  private state: DailyRewardState

  constructor() {
    this.state = this.loadState()
  }

  getState(): DailyRewardState {
    return { ...this.state }
  }

  canClaimToday(): boolean {
    return this.state.lastClaimDate !== this.getToday()
  }

  claim(): DailyRewardResult {
    if (!this.canClaimToday()) {
      return {
        success: false,
        message: 'You have already claimed today’s reward!',
        coinsAwarded: 0,
        seedsAwarded: 0,
        state: this.getState(),
      }
    }

    this.state.lastClaimDate = this.getToday()
    this.state.coins += DAILY_COINS
    this.state.seeds += DAILY_SEEDS

    this.saveState()

    return {
      success: true,
      message: 'Daily reward claimed successfully!',
      coinsAwarded: DAILY_COINS,
      seedsAwarded: DAILY_SEEDS,
      state: this.getState(),
    }
  }

  private getToday(): string {
    const now = new Date()

    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  private loadState(): DailyRewardState {
    const defaultState: DailyRewardState = {
      lastClaimDate: null,
      coins: 0,
      seeds: 0,
    }

    try {
      const raw = localStorage.getItem(REWARD_STORAGE_KEY)

      if (!raw) {
        return defaultState
      }

      const parsed: unknown = JSON.parse(raw)

      if (!parsed || typeof parsed !== 'object') {
        return defaultState
      }

      const saved = parsed as Partial<DailyRewardState>

      return {
        lastClaimDate:
          typeof saved.lastClaimDate === 'string'
            ? saved.lastClaimDate
            : null,

        coins:
          typeof saved.coins === 'number' &&
          Number.isFinite(saved.coins) &&
          saved.coins >= 0
            ? Math.floor(saved.coins)
            : 0,

        seeds:
          typeof saved.seeds === 'number' &&
          Number.isFinite(saved.seeds) &&
          saved.seeds >= 0
            ? Math.floor(saved.seeds)
            : 0,
      }
    } catch {
      return defaultState
    }
  }

  private saveState(): void {
    try {
      localStorage.setItem(
        REWARD_STORAGE_KEY,
        JSON.stringify(this.state),
      )
    } catch {
      console.warn('Could not save daily reward progress.')
    }
  }
}