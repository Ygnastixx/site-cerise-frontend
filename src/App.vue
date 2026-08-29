<template>
  <div id="app">

    <nav class="navbar">

      <div class="logo">
        🍒 Site Cerise
      </div>

      <div class="links">

        <RouterLink to="/inventory">
          Inventaire
        </RouterLink>

        <RouterLink to="/sessions">
          Sessions
        </RouterLink>

        <RouterLink to="/studio">
          Studio
        </RouterLink>

      </div>

    </nav>

    <main>
      <RouterView />
    </main>

  </div>
</template>

<script setup>
import {
  RouterLink,
  RouterView,
} from "vue-router";
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 1rem 2rem;

  background-color: var(--color-eni-green);
}

.logo {
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
}

.links {
  display: flex;
  gap: 1.5rem;
}

.links a {
  color: white;
  text-decoration: none;
}

.links a.router-link-active {
  color: #ffd0d0;
  font-weight: bold;
}

main {
  min-height: calc(100vh - 70px);
  background: #f7f7f7;
}
</style>