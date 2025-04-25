<!-- Enhanced App.vue with Accessibility Features -->
<template>
  <div class="app" :class="{ 'high-contrast': highContrastMode }">
    <!-- Skip to main content link for keyboard users -->
    <a href="#main-content" class="skip-link">Skip to main content</a>

    <header class="app-header" role="banner">
      <div class="container">
        <div class="app-header__logo">
          <router-link to="/">Sports Management</router-link>
        </div>

        <div class="accessibility-controls">
          <button
            class="accessibility-btn"
            @click="toggleHighContrast"
            :aria-pressed="highContrastMode"
          >
            <span v-if="highContrastMode">Standard Contrast</span>
            <span v-else>High Contrast</span>
          </button>

          <button
            class="accessibility-btn"
            @click="increaseFontSize"
            aria-label="Increase font size"
          >
            A+
          </button>

          <button
            class="accessibility-btn"
            @click="decreaseFontSize"
            aria-label="Decrease font size"
          >
            A-
          </button>
        </div>

        <nav class="app-header__nav" role="navigation" aria-label="Main Navigation">
          <router-link to="/" class="nav-link">Dashboard</router-link>
          <router-link to="/teams" class="nav-link">Teams</router-link>
          <router-link to="/players" class="nav-link">Players</router-link>
          <router-link to="/draft-picks" class="nav-link">Draft Picks</router-link>
          <router-link to="/schedule" class="nav-link">Schedule</router-link>
        </nav>
      </div>
    </header>

    <main id="main-content" class="app-content" role="main">
      <router-view />
    </main>

    <footer class="app-footer" role="contentinfo">
      <div class="container">
        <p>&copy; {{ currentYear }} Sports Management App</p>
        <div class="footer-links">
          <a href="#" class="footer-link">Accessibility Statement</a>
          <a href="#" class="footer-link">Privacy Policy</a>
          <a href="#" class="footer-link">Terms of Use</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue'

export default defineComponent({
  name: 'App',
  setup() {
    const currentYear = computed(() => new Date().getFullYear())
    const highContrastMode = ref(false)
    const baseFontSize = ref(16)

    // Toggle high contrast mode
    const toggleHighContrast = () => {
      highContrastMode.value = !highContrastMode.value
      // Save preference to localStorage
      localStorage.setItem('highContrast', highContrastMode.value.toString())
    }

    // Font size adjustments (limited range for usability)
    const increaseFontSize = () => {
      if (baseFontSize.value < 24) {
        baseFontSize.value += 2
        updateFontSize()
      }
    }

    const decreaseFontSize = () => {
      if (baseFontSize.value > 14) {
        baseFontSize.value -= 2
        updateFontSize()
      }
    }

    const updateFontSize = () => {
      document.documentElement.style.fontSize = `${baseFontSize.value}px`
      // Save preference to localStorage
      localStorage.setItem('fontSize', baseFontSize.value.toString())
    }

    // Load user preferences on mount
    onMounted(() => {
      // Load contrast preference
      const savedContrast = localStorage.getItem('highContrast')
      if (savedContrast === 'true') {
        highContrastMode.value = true
      }

      // Load font size preference
      const savedFontSize = localStorage.getItem('fontSize')
      if (savedFontSize) {
        baseFontSize.value = parseInt(savedFontSize)
        updateFontSize()
      }
    })

    return {
      currentYear,
      highContrastMode,
      toggleHighContrast,
      increaseFontSize,
      decreaseFontSize
    }
  }
})
</script>

<style>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  background-color: var(--primary-bg-color);
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.app-header .container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.app-header__logo {
  font-size: 1.75rem;
  font-weight: 700;
}

.app-header__logo a {
  color: var(--light-color);
  text-decoration: none;
}

.app-header__nav {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.nav-link {
  color: var(--alternate-accent);
  text-decoration: none;
  font-weight: 600;
  padding: 0.25rem 0;
  transition: color 0.2s ease;
  position: relative;
  font-size: 1.1rem;
}

.nav-link:hover {
  color: var(--accent-color);
}

.nav-link.router-link-active {
  color: var(--light-color);
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -3px;
  width: 100%;
  height: 3px;
  background-color: var(--accent-color);
}

.app-content {
  flex-grow: 1;
  background-color: var(--primary-bg-color);
  color: var(--light-color);
  padding: 2rem 0;
}

.app-footer {
  background-color: var(--primary-bg-color);
  color: var(--light-color);
  padding: 1.5rem 0;
  text-align: center;
  border-top: 1px solid rgba(233, 196, 106, 0.2);
}

/* Accessibility features */
.accessibility-controls {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.accessibility-btn {
  background-color: var(--secondary-bg-color);
  color: var(--white);
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: background-color 0.2s;
}

.accessibility-btn:hover {
  background-color: #238076;
}

.accessibility-btn:focus {
  outline: 3px solid var(--alternate-accent);
  outline-offset: 2px;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--accent-color);
  color: white;
  padding: 8px;
  z-index: 100;
  transition: top 0.3s;
}

.skip-link:focus {
  top: 0;
  outline: 3px solid var(--alternate-accent);
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1rem;
}

.footer-link {
  color: var(--alternate-accent);
  text-decoration: underline;
  font-size: 0.9rem;
}

.footer-link:hover {
  color: var(--accent-color);
}

@media (min-width: 768px) {
  .app-header .container {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .accessibility-controls {
    order: 3;
    margin-bottom: 0;
  }

  .app-header__nav {
    order: 2;
  }
}
</style>
