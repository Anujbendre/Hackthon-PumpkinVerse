export function createGardenPreview(): string {
  return `
    <section class="garden-section section-padding" id="garden">
      <div class="section-heading">
        <span class="section-eyebrow">YOUR FIRST LITTLE GARDEN</span>

        <h2>
          Every pumpkin starts<br />
          with <span class="gradient-text">one little seed.</span>
        </h2>

        <p>
          Try a tiny preview of your future magical garden.
          Plant, water, and harvest your first pumpkin!
        </p>
      </div>

      <div class="garden-demo">
        <div class="garden-toolbar">
          <div>
            <span class="garden-status-label">GARDEN STATUS</span>
            <p id="garden-status">Your garden is waiting for a seed.</p>
          </div>

          <div class="garden-coins">
            <span>🪙</span>
            <span id="garden-coins">0</span>
          </div>
        </div>

        <div class="garden-sky">
          <span class="garden-cloud cloud-one">☁️</span>
          <span class="garden-cloud cloud-two">☁️</span>
          <span class="garden-sun">☀️</span>

          <div class="garden-plot" id="garden-plot">
            <span id="garden-plant" class="garden-plant">🌱</span>
          </div>

          <span class="garden-butterfly">🦋</span>
          <span class="garden-flower flower-one">🌼</span>
          <span class="garden-flower flower-two">🌷</span>
        </div>

        <div class="garden-actions">
          <button class="garden-action primary-button" id="plant-seed">
            🌱 Plant Seed
          </button>

          <button class="garden-action secondary-button" id="water-plant" disabled>
            💧 Water
          </button>

          <button class="garden-action secondary-button" id="harvest-plant" disabled>
            🎃 Harvest
          </button>
        </div>

        <p class="garden-hint" id="garden-hint" aria-live="polite">
          Plant your first seed to begin.
        </p>
      </div>
    </section>
  `
}