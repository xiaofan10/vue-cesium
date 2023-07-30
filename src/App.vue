<script setup>
import { getRoutes } from './router/index'
const routeList = getRoutes()
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink v-for="item in routeList" :to="item.path" :key="item.name">{{
          item.title
        }}</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
.wrapper {
  background: rgba(255,255,255,.7);
}
header {
  position: absolute;
  z-index: 999;
  max-height: 100vh;
  color: #fff;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: left;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
</style>
