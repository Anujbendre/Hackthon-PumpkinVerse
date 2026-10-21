import './style.css'
import { createGardenPreview } from './components/GardenPreview'
import { startGame, stopGame } from './game/startGame'
// ========================================
// APPLICATION ROOT
// ========================================

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('PumpkinVerse application root was not found.')
}

// ========================================
// MAIN APPLICATION INTERFACE
// ========================================

app.innerHTML = `
  <!-- NAVIGATION -->
  <header class="navbar">
    <a href="#" class="brand" aria-label="PumpkinVerse home">
      <span class="brand-icon">🎃</span>

      <span class="brand-text">
        Pumpkin<span>Verse</span>
        <small>A LITTLE WORLD OF MAGIC</small>
      </span>
    </a>

    <nav class="nav-links" aria-label="Main navigation">
      <a href="#features">Discover</a>
      <a href="#garden">Your Garden</a>
      <a href="#world">Your World</a>
      <a href="#about">About</a>
    </nav>

    <button class="nav-button" id="nav-play">
      Play Now <span>↗</span>
    </button>
  </header>

  <main>
  <!-- PLAYABLE GAME SCREEN -->
<section id="game-screen" class="game-screen" hidden>
  <div class="game-header">
    <a href="#top" class="brand game-brand">
      <span class="brand-icon">🎃</span>

      <span class="brand-text">
        Pumpkin<span>Verse</span>
        <small>YOUR MAGICAL GARDEN</small>
      </span>
    </a>

    <div class="game-header-actions">
      <span class="game-badge">🌱 Adventure Mode</span>

      <button id="exit-game" class="secondary-button">
        ← Exit Game
      </button>
    </div>
  </div>

  <div class="game-intro">
    <span class="section-eyebrow">YOUR WORLD IS WAITING</span>

    <h1>
      Welcome to <span class="gradient-text">your garden.</span>
    </h1>

    <p>
      Explore your pumpkin world, find your garden,
      and harvest pumpkins to earn coins.
    </p>
  </div>

  <div class="game-layout">
    <div class="game-canvas-wrapper">
      <div id="pumpkin-game"></div>
    </div>

    <aside class="game-help">
      <h2>🎮 How to Play</h2>

      <div class="control-row">
        <span>Move</span>
        <strong>W A S D</strong>
      </div>

      <div class="control-row">
        <span>Alternative movement</span>
        <strong>Arrow keys</strong>
      </div>

      <div class="control-row">
        <span>Harvest pumpkin</span>
        <strong>E</strong>
      </div>

      <div class="game-tip">
        💡 Walk close to the pumpkin before pressing E.
      </div>

      <button id="restart-game" class="primary-button game-restart">
        Restart Adventure ↻
      </button>
    </aside>
  </div>

  <p class="game-disclaimer">
    PumpkinVerse is a work in progress. Your game progress
    is currently temporary and resets when you restart.
  </p>
</section>
    <!-- HERO SECTION -->
    <section class="hero" id="top">
      <div class="hero-glow"></div>

      <div class="stars" aria-hidden="true">
        <span class="star star-one">✦</span>
        <span class="star star-two">✧</span>
        <span class="star star-three">✦</span>
        <span class="star star-four">✧</span>
        <span class="star star-five">✦</span>
      </div>

      <div class="hero-content">
        <div class="eyebrow">
          <span class="status-dot"></span>
          YOUR MAGICAL AUTUMN ADVENTURE
        </div>

        <h1>
          Plant a seed.<br />
          <span class="gradient-text">Grow a world.</span><br />
          Create your magic.
        </h1>

        <p class="hero-description">
          Welcome to PumpkinVerse, a tiny magical world where pumpkins
          grow, mysteries hide, and every little garden tells a story.
          Your adventure begins with a single seed.
        </p>

        <div class="hero-actions">
          <button class="primary-button" id="start-adventure">
            Start Your Adventure
            <span class="button-arrow">→</span>
          </button>

          <a href="#features" class="secondary-button">
            Explore the World <span>↓</span>
          </a>
        </div>

        <div class="hero-note">
          <span>🌱</span>
          Grow at your own pace
          <span class="note-separator">•</span>
          Made for curious minds
        </div>
      </div>

      <!-- PUMPKIN ARTWORK -->
      <div class="hero-art" aria-label="Magical pumpkin illustration">
        <div class="orbit orbit-one"></div>
        <div class="orbit orbit-two"></div>

        <div class="floating-icon floating-star">✦</div>
        <div class="floating-icon floating-moon">☾</div>
        <div class="floating-icon floating-leaf">🍂</div>

        <div class="small-pumpkin pumpkin-left">🎃</div>
        <div class="small-pumpkin pumpkin-right">🎃</div>

        <div class="main-pumpkin">🎃</div>

        <div class="magic-label">
          <span class="label-sparkle">✧</span>
          Your little world awaits
          <span class="label-sparkle">✧</span>
        </div>
      </div>

      <div class="hero-bottom">
        <span>01 / A WORLD OF WONDER</span>
        <span>SCROLL TO EXPLORE ↓</span>
      </div>
    </section>

    <!-- FEATURES SECTION -->
    <section class="features section-padding" id="features">
      <div class="section-heading">
        <span class="section-eyebrow">
          A LITTLE MAGIC GOES A LONG WAY
        </span>

        <h2>
          Little seeds.<br />
          <span class="gradient-text">Big adventures.</span>
        </h2>

        <p>
          Build your own magical world, one pumpkin at a time.
          Discover, collect, and create something that feels like yours.
        </p>
      </div>

      <div class="feature-grid">
        <!-- FEATURE 1 -->
        <article class="feature-card">
          <div class="feature-visual garden-visual">
            <span class="visual-decoration decoration-one">✦</span>
            <span class="visual-decoration decoration-two">✧</span>
            <span class="feature-emoji">🌱</span>
            <span class="mini-pumpkin">🎃</span>
          </div>

          <span class="feature-number">01 / GROW</span>

          <h3>Grow Your Garden</h3>

          <p>
            Plant magical seeds, nurture your pumpkins,
            and watch your little garden come alive.
          </p>

          <a href="#garden" class="feature-link">
            Try the garden <span>→</span>
          </a>
        </article>

        <!-- FEATURE 2 -->
        <article class="feature-card">
          <div class="feature-visual collection-visual">
            <span class="feature-emoji">🎃</span>
            <span class="rare-pumpkin">✨</span>
            <span class="visual-decoration decoration-three">✦</span>
          </div>

          <span class="feature-number">02 / DISCOVER</span>

          <h3>Find Rare Pumpkins</h3>

          <p>
            Collect unusual varieties, discover hidden treasures,
            and unlock special pumpkin surprises.
          </p>

          <a href="#garden" class="feature-link">
            Start collecting <span>→</span>
          </a>
        </article>

        <!-- FEATURE 3 -->
        <article class="feature-card">
          <div class="feature-visual village-visual">
            <span class="feature-emoji">🏡</span>
            <span class="village-tree">🌳</span>
            <span class="village-pumpkin">🎃</span>
          </div>

          <span class="feature-number">03 / CREATE</span>

          <h3>Build Your Village</h3>

          <p>
            Decorate your world, unlock magical items,
            and create a village that's uniquely yours.
          </p>

          <a href="#world" class="feature-link">
            Explore your world <span>→</span>
          </a>
        </article>
      </div>
    </section>

    <!-- INTERACTIVE GARDEN -->
    ${createGardenPreview()}

    <!-- WORLD PREVIEW -->
    <section class="world-section section-padding" id="world">
      <div class="world-card">
        <div class="world-decoration world-decoration-one">✦</div>
        <div class="world-decoration world-decoration-two">✧</div>

        <div class="world-content">
          <span class="section-eyebrow">
            YOUR NEXT LITTLE ADVENTURE
          </span>

          <h2>
            A tiny garden.<br />
            <span class="gradient-text">An endless world.</span>
          </h2>

          <p>
            Start small, collect magical pumpkins, earn coins,
            and transform your garden into an enchanted village.
            Every adventure begins somewhere.
          </p>

          <button class="primary-button" id="enter-world">
            Enter PumpkinVerse
            <span class="button-arrow">→</span>
          </button>
        </div>

        <div class="world-art">
          <div class="world-moon">🌙</div>
          <div class="world-house">🏡</div>
          <div class="world-big-pumpkin">🎃</div>
          <div class="world-small-pumpkin">🎃</div>
          <div class="world-tree">🌳</div>
          <div class="world-ground"></div>
        </div>
      </div>
    </section>

    <!-- ABOUT SECTION -->
    <section class="about-section section-padding" id="about">
      <div class="about-content">
        <span class="section-eyebrow">A WORLD MADE FOR YOU</span>

        <h2>
          Make room for a little <span>magic.</span>
        </h2>

        <p>
          PumpkinVerse is a cozy, creative world where growing a pumpkin
          is just the beginning. Explore new possibilities, collect
          delightful discoveries, and build your own little escape.
        </p>

        <button class="primary-button" id="about-play">
          Let's Play <span class="button-arrow">→</span>
        </button>
      </div>
    </section>
  </main>

  <!-- FOOTER -->
  <footer class="footer">
    <a href="#top" class="brand footer-brand">
      <span class="brand-icon">🎃</span>

      <span class="brand-text">
        Pumpkin<span>Verse</span>
        <small>A LITTLE WORLD OF MAGIC</small>
      </span>
    </a>

    <p>Made with 🎃 and a little magic.</p>

    <a href="#top" class="footer-top">Back to top ↑</a>
  </footer>

  <!-- ADVENTURE MODAL -->
  <div class="modal-backdrop" id="adventure-modal" hidden>
    <div
      class="adventure-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <button
        class="modal-close"
        id="modal-close"
        aria-label="Close dialog"
      >×</button>

      <div class="modal-pumpkin">🎃</div>

      <span class="section-eyebrow">
        YOUR STORY STARTS HERE
      </span>

      <h2 id="modal-title">Welcome to PumpkinVerse!</h2>

      <p id="modal-description">
        Your magical garden is waiting. Plant seeds, grow pumpkins,
        collect coins, and build your own little world.
      </p>

      <button class="primary-button modal-continue" id="modal-continue">
        Visit My Garden <span class="button-arrow">→</span>
      </button>

      <p class="modal-note">
        Your magical adventure starts with a single seed.
      </p>
    </div>
  </div>
`

// ========================================
// ADVENTURE MODAL
// ========================================

const modal =
  document.querySelector<HTMLDivElement>('#adventure-modal')

const closeButton =
  document.querySelector<HTMLButtonElement>('#modal-close')

const continueButton =
  document.querySelector<HTMLButtonElement>('#modal-continue')

let previouslyFocusedElement: HTMLElement | null = null


function closeModal(): void {
  if (!modal || modal.hidden) return

  modal.hidden = true

  document.body.classList.remove('modal-open')

  previouslyFocusedElement?.focus()
}

// ========================================
// GAME NAVIGATION
// ========================================

const gameScreen =
  document.querySelector<HTMLElement>('#game-screen')

const exitGameButton =
  document.querySelector<HTMLButtonElement>('#exit-game')

const restartGameButton =
  document.querySelector<HTMLButtonElement>('#restart-game')

let gameStarted = false

function enterGame(): void {
  closeModal()

  if (!gameScreen) {
    console.error('Game screen was not found.')
    return
  }

  gameScreen.hidden = false

  document.body.classList.add('playing-game')

  gameScreen.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })

  if (!gameStarted) {
    const container =
      document.querySelector<HTMLElement>('#pumpkin-game')

    if (!container) {
      console.error('Phaser game container was not found.')
      return
    }

    startGame(container)
    gameStarted = true
  }
}

function exitGame(): void {
  stopGame()

  gameStarted = false

  if (gameScreen) {
    gameScreen.hidden = true
  }

  document.body.classList.remove('playing-game')

  document.querySelector('#top')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

document
  .querySelectorAll<HTMLButtonElement>(
    '#nav-play, #start-adventure, #enter-world, #about-play',
  )
  .forEach((button) => {
    button.addEventListener('click', enterGame)
  })

exitGameButton?.addEventListener('click', exitGame)

restartGameButton?.addEventListener('click', () => {
  if (!gameStarted) {
    enterGame()
    return
  }

  const container =
    document.querySelector<HTMLElement>('#pumpkin-game')

  if (!container) return

  stopGame()
  startGame(container)
})

closeButton?.addEventListener('click', closeModal)

// Continue takes the player to the interactive garden.
continueButton?.addEventListener('click', () => {
  closeModal()

  document.querySelector('#garden')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })

  plantButton?.focus()
})

modal?.addEventListener('click', (event: MouseEvent) => {
  if (event.target === modal) {
    closeModal()
  }
})

document.addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeModal()
  }
})

// ========================================
// INTERACTIVE GARDEN
// ========================================

type GardenStage =
  | 'empty'
  | 'seed'
  | 'growing'
  | 'ready'
  | 'harvested'

let gardenStage: GardenStage = 'empty'
let gardenCoins = 0
let growthTimer: number | undefined

const plantButton =
  document.querySelector<HTMLButtonElement>('#plant-seed')

const waterButton =
  document.querySelector<HTMLButtonElement>('#water-plant')

const harvestButton =
  document.querySelector<HTMLButtonElement>('#harvest-plant')

const gardenPlant =
  document.querySelector<HTMLSpanElement>('#garden-plant')

const gardenStatus =
  document.querySelector<HTMLParagraphElement>('#garden-status')

const gardenHint =
  document.querySelector<HTMLParagraphElement>('#garden-hint')

const gardenCoinDisplay =
  document.querySelector<HTMLSpanElement>('#garden-coins')

// Set up the initial garden state.
function updateGarden(
  stage: GardenStage,
  status: string,
  hint: string,
  plant: string,
): void {
  gardenStage = stage

  if (gardenStatus) {
    gardenStatus.textContent = status
  }

  if (gardenHint) {
    gardenHint.textContent = hint
  }

  if (gardenPlant) {
    gardenPlant.textContent = plant
  }

  gardenPlant?.classList.toggle(
    'growing',
    stage === 'growing' || stage === 'ready',
  )

  gardenPlant?.classList.toggle(
    'harvested',
    stage === 'harvested',
  )

  // Planting is allowed when the garden is empty or harvested.
  if (plantButton) {
    plantButton.disabled =
      stage !== 'empty' && stage !== 'harvested'
  }

  // Watering is allowed after planting.
  if (waterButton) {
    waterButton.disabled = stage !== 'seed'
  }

  // Harvesting is allowed when the pumpkin is ready.
  if (harvestButton) {
    harvestButton.disabled = stage !== 'ready'
  }
}

// PLANT SEED
plantButton?.addEventListener('click', () => {
  if (gardenStage !== 'empty' && gardenStage !== 'harvested') {
    return
  }

  window.clearTimeout(growthTimer)

  updateGarden(
    'seed',
    'A tiny seed has been planted!',
    'Your seed is in the soil. Give it some water!',
    '🌱',
  )
})

// WATER THE SEED
waterButton?.addEventListener('click', () => {
  if (gardenStage !== 'seed') {
    return
  }

  updateGarden(
    'growing',
    'Your pumpkin is growing!',
    'Magic is happening beneath the soil. Wait 3 seconds...',
    '🌿',
  )

  growthTimer = window.setTimeout(() => {
    if (gardenStage !== 'growing') {
      return
    }

    updateGarden(
      'ready',
      'Your pumpkin is ready!',
      'Wonderful! Harvest your pumpkin to earn 10 coins.',
      '🎃',
    )
  }, 3000)
})

// HARVEST THE PUMPKIN
harvestButton?.addEventListener('click', () => {
  if (gardenStage !== 'ready') {
    return
  }

  gardenCoins += 10

  if (gardenCoinDisplay) {
    gardenCoinDisplay.textContent = String(gardenCoins)
  }

  updateGarden(
    'harvested',
    'Pumpkin harvested successfully!',
    'You earned 10 coins! Plant another seed to continue.',
    '🪴',
  )
})

// ========================================
// INITIALIZE GARDEN
// ========================================

updateGarden(
  'empty',
  'Your garden is waiting for a seed.',
  'Plant your first seed to begin your adventure!',
  '🌱',
)

console.log('🎃 PumpkinVerse initialized successfully!')