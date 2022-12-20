<template>
  <div v-if="!user" class="user-card">
    <span>Анонимный пользователь</span>
    <input type="text" v-model="username" placeholder="Username">
    <input type="password" v-model="password" placeholder="Password">
    <input @click="login()" type="submit" value="Войти в систему">
    <RouterLink to="/signup"><button>Регистрация</button></RouterLink>
  </div>
  <div v-else class="user-card">
    <span>{{ userName }} - {{ userRole }}&nbsp;</span>
    <button @click="logout()">Выйти</button>
  </div>
</template>

<script lang="ts">
import {defineComponent, inject} from 'vue'
import { login, logout, type Doctor} from '@/myapi'
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
    },
    userName() {
      if (this.user) {
        if (this.user.patient) {
          return this.user.patient.name
        }
        if (this.user.doctor) {
          return this.user.doctor.name
        }
        if (this.user.manager) {
          return this.user.manager.name
        }
      }
      return ''
    },
    userRole() {
      if (this.user) {
        if (this.user.patient) {
          return 'пациент'
        } else if (this.user.doctor) {
          return this.user.doctor.speciality.name
        } else if (this.user.manager) {
          return 'менеджер'
        } else {
          return 'без прав'
        }
      }
      return ''
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