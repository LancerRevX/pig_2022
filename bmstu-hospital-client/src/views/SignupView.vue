<template>
  <div class="signup-box">
      <h2>Регистрация</h2>
      <div class="signup-params-box">
          <label>Имя пользователя</label>
          <input type="text" v-model="signupParams.username">
          <label>Пароль</label>
          <input type="password" v-model="signupParams.password">
          <label>Повторите пароль</label>
          <input type="password" v-model="signupParams.password_repeat">
          <label>Имя</label>
          <input type="text" v-model="signupParams.first_name">
          <label>Фамилия</label>
          <input type="text" v-model="signupParams.last_name">
          <label>Отчество</label>
          <input type="text" v-model="signupParams.patronymic">
          <label>Дата рождения</label>
          <input type="date" v-model="signupParams.birth_date">
          <label>Пол</label>
          <div>
            <label>Мужской</label>
            <input type="radio" :value="1" v-model="signupParams.gender">
            <label>Женский</label>
            <input type="radio" :value="0" v-model="signupParams.gender">
          </div>
      </div>
      <button @click="signup">Зарегистрироваться</button>
  </div>
</template>

<script lang="ts">
import {defineComponent, inject} from 'vue'
import { login, logout, type Doctor, type SignupParams, signup } from '@/myapi'
import type { PropType } from 'vue'
import { userStore } from '@/userStore'
import { RouterLink } from 'vue-router'
import * as errors from '@/myapi/errors'

export default defineComponent({
  data: () => ({
    userStore: userStore(),
    signupParams: {
      username: '',
      password: '',
      password_repeat: '',
      first_name: '',
      last_name: '',
      patronymic: '',
      birth_date: new Date,
      gender: 1
    } as SignupParams
  }),
  methods: {
    async signup() {
      try {
        await signup(this.signupParams)
        alert('Вы успешно зарегистрировались!')
        this.$router.push('/')
      } catch (error) {
        if (error instanceof errors.UsernameTaken) {
          alert('Это имя пользователя уже занято!')
        } else if (error instanceof errors.BadRequest) {
          alert('Заполните все поля! Пароли должны совпадать!')
        } else {
          console.log(error)
        }
      }
    }
  },
  created() {
    if (this.userStore.user) {
      this.$router.push('/')
    }
  }
})
</script>

<style scoped>
.signup-params-box {
  display: grid;
  max-width: 400px;
  grid-template-columns: 1fr 1fr;
  align-items: flex-start;
  row-gap: 4px;
}
</style>