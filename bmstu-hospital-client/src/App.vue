<script lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import {defineComponent} from 'vue'
import UserCard from './components/UserCard.vue'
import { userStore } from './userStore'

export default defineComponent({
  data: () => ({
    userStore: userStore()
  }),
  components: {
    RouterLink, RouterView, UserCard
  },
  computed: {
    // user() {
    //   return this.userStore.user
    // }
  }
})
</script>

<template>
  <header>
    <h1>Моя больница</h1>
    <div class="spacer"></div>
    <UserCard></UserCard>

    <nav> 
      <RouterLink to="/">Главная</RouterLink>
      <RouterLink to="/doctors">Список врачей</RouterLink>
      <RouterLink to="/patients">Список пациентов</RouterLink>
      <RouterLink to="/wards">Список палат</RouterLink>
      <RouterLink to="/cases">История болезней</RouterLink>
      <RouterLink to="/appointments">Записи</RouterLink>
    </nav>
    <nav v-if="userStore.user?.manager">
      <span>Инструменты менеджера:</span>
      <RouterLink to="/manager/create-doctor">Добавить врача</RouterLink>
      <RouterLink to="/manager/appointments">Редактировать записи</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  margin-bottom: 1rem;
  display: grid;
  grid-template: 1fr auto / auto 1fr auto;
  row-gap: 1em;
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

@media (max-width: 480px) {
  header {
    display: flex;
    flex-direction: column;
    text-align: center;
    gap: 0;
  }

  nav {
    display: flex;
    flex-direction: column;
    margin-top: 16px;
  }
}
</style>
