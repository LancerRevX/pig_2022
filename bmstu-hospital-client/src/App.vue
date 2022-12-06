<script lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import {defineComponent} from 'vue'
import UserCard from './components/UserCard.vue'

export default defineComponent({
  components: {
    RouterLink, RouterView, UserCard
  }
})
</script>

<template>
  <header>
    <h1>Моя больница</h1>

    <UserCard></UserCard>

    <nav> 
      <RouterLink to="/">Главная</RouterLink>
      <RouterLink to="/doctors">Список врачей</RouterLink>
      <RouterLink to="/patients">Список пациентов</RouterLink>
      <RouterLink to="/wards">Список палат</RouterLink>
      <RouterLink to="/cases">История болезней</RouterLink>
      <RouterLink to="/appointments">Записи</RouterLink>
    </nav>    
  </header>

  <RouterView />
</template>

<style>

header {
  margin-bottom: 1rem;
  display: grid;
  grid-template: 1fr auto / 1fr auto;
}

nav {
  display: flex;
  flex-wrap: wrap;
  column-gap: 1em;
  border-collapse: collapse;
  row-gap: 1em;
  grid-column: span 2;
  /* border-left: 1px solid black; */
}

nav a {
  padding: 0 1em 0 1em;
  border: 1px solid black;
  text-decoration: none;
  color: inherit;
  font-size: 18px;
}

nav a.router-link-active {
  background-color: black;
  color: white;
}
</style>
