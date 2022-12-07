<template>
  <div v-if="!user" class="user-card">
    <span>Анонимный пользователь</span>
    <input type="text" v-model="username" placeholder="Username">
    <input type="password" v-model="password" placeholder="Password">
    <button @click="login()">Войти в систему</button>
    <RouterLink to="/signup"><button>Регистрация</button></RouterLink>
  </div>
  <div v-else class="user-card">
    <span>{{ user.username }}&nbsp;</span>
    <span v-if="user.doctor">{{ user.doctor.name }} - {{ user.doctor.speciality.name }}&nbsp;</span>
    <span v-else-if="user.patient">{{ user.patient.name }} - пациент&nbsp;</span>
    <button @click="logout()">Выйти</button>
  </div>
</template>

<script lang="ts">
import {defineComponent, inject} from 'vue'
import { login, logout } from '@/myapi/types'
import type { Doctor } from '@/myapi/types'
import type { PropType } from 'vue'
import { userStore } from '@/userStore'
import { RouterLink } from 'vue-router'

export default defineComponent({
  data: () => ({
    userStore: userStore(),
    username: '',
    password: ''
  }),
  methods: {
    async login() {
      let user = await login(this.username, this.password)
      if (!user) {
        alert('Неверный логин или пароль!')
      } else {
        this.userStore.user = user
      }
    },
    async logout() {
      await logout()
      this.userStore.user = null
    }
  },
  computed: {
    user() {
      return this.userStore.user
    }
  },
  async created() {
    this.userStore.user = await login()
  },
  components: {
    RouterLink
  }
})
</script>

<style>

</style>