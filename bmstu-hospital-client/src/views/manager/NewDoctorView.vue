<template>
  <div class="edit-doctor-box">
    <h1>
      Добавить нового врача
    </h1>
    <LoadingIndicator :data-status="DataStatus.Forbidden" v-if="!userStore.user?.manager"></LoadingIndicator>
    <div class="doctor-box" v-else>
      <div class="fields-box">
        <span>Пользователь</span>
        <div class="switcher-box">
          <label>
            Новый
            <input type="radio" v-model="userType" :value="UserType.NEW">
          </label>
          <label>
            Существующий
            <input type="radio" v-model="userType" :value="UserType.EXISTING">
          </label>
        </div>
      </div>
      <div class="fields-box" v-if="userType == UserType.NEW">
        <span>Имя пользователя</span>
        <input type="text" v-model="username">
        <span>Пароль</span>
        <input type="text" v-model="password">
      </div>
      <div class="fields-box" v-if="userType == UserType.EXISTING">
        <select class="user-select" v-model="doctorUser">
          <option v-for="user of users" :key="user.id" :value="user">
            {{ user.username }}
          </option>
        </select>
      </div>
      <div class="fields-box">
        <span>Имя</span>
        <input type="text" v-model="doctor.firstName">
        <span>Фамилия</span>
        <input type="text" v-model="doctor.lastName">
        <span>Отчество</span>
        <input type="text" v-model="doctor.patronymic">
        <span>Специальность</span>
        <select v-model="doctor.speciality">
          <option v-for="speciality of specialities" :key="speciality.id" :value="speciality">
            {{ speciality.name }}
          </option>
        </select>
        <span>Стоимость приёма</span>
        <input type="number" v-model="doctor.cost">
        <span>Пол</span>
        <div class="switcher-box">
          <label>
            Мужчина
            <input type="radio" v-model="doctor.gender" :value="1">
          </label>
          <label>
            Женщина
            <input type="radio" v-model="doctor.gender" :value="0">
          </label>
        </div>
        <input type="submit" value="Сохранить" @click="saveDoctor()">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import { 
  type Doctor, type Speciality, type User, 
  getSpecialities, getUsers, createDoctor,
  BadRequest, ForbiddenError, createUser, UsernameTaken
} from '@/myapi'
import { userStore } from '@/userStore'
import { DataStatus } from '@/dataStatus'
import LoadingIndicator from '@/components/LoadingIndicator.vue'

enum UserType {
  NEW, EXISTING
}

export default defineComponent({
  data: () => ({
    doctor: {} as Doctor,
    doctorUser: {} as User,
    username: '',
    password: '',
    specialities: [] as Speciality[],
    users: [] as User[],
    userStore: userStore(),
    userType: UserType.NEW,
    UserType,
    DataStatus
  }),
  computed: {
    id() {
      if (this.$route.params.id) {
        return Number(this.$route.params.id)
      } else {
        return null
      }
    }
  },
  methods: {
    async getUsers() {
      let users = await getUsers()
      this.users = users.filter(user => !user.doctor)
    },
    async getSpecialities() {
      this.specialities = await getSpecialities(false)
    },
    async saveDoctor() {
      try {
        if (this.userType == UserType.NEW) {
          this.doctorUser = await createUser(this.username, this.password)
        }
        await createDoctor(this.doctor, this.doctorUser)
        alert(`Новый ${this.doctor.speciality.name} успешно сохранён.`)
      } catch (error) {
        console.log(error)
        if (error instanceof UsernameTaken) {
          alert('Данное имя пользователя уже занято!')
        } else if (error instanceof BadRequest) {
          alert('Заполните все поля!')
        } else {
          alert('Неизвестная ошибка!')
        }
      }
    }
  },
  async created() {
    await this.getSpecialities()
    await this.getUsers()
    this.doctor = {
      id: -1,
      firstName: '',
      lastName: '',
      patronymic: '',
      speciality: this.specialities[0],
      gender: 1,
      cost: 0,
      name: '',
      photo: '',
      work_record: 0
    }
    this.doctorUser = this.users[0]
  },
  components: {
    LoadingIndicator
  }
})

</script>

<style scoped>
.doctor-box {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.doctor-box h2 {
  grid-column: span 2;
}

.fields-box {
  display: grid;
  grid-template: auto / 150px 250px;
  align-items: center;
  text-align: right;
  gap: 1em;
}
/* 
.doctor-block p {
  margin-bottom: 1em;
} */

/* .user-switcher {
  grid-column: span 2;
}

.gender-switcher {
  justify-self: left;
} */

.user-select {
  grid-column: 2;
}

.switcher-box {
  justify-self: left;
}

.doctor-box input[type=submit] {
  grid-column: span 2;
  padding: 0px 16px;
  justify-self: center;
  cursor: pointer;
}
</style>
