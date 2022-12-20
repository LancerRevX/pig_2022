<template>
  <div class="edit-doctor-block">
    <h1>
      Редактирование врача
    </h1>
    <LoadingIndicator v-if="!doctor" :data-status="dataStatus"></LoadingIndicator>
    <div class="doctor-block" v-else>
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
      <div>
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
      <input type="button" value="Удалить" @click="deleteDoctor()">
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import { 
  type Doctor, type Speciality, 
  getPatients, createAppointment, getSpecialities, getDoctor, updateDoctor,  deleteDoctor,
  ForbiddenError,
} from '@/myapi'
import * as api from '@/api'
import { userStore } from '@/userStore'
import LoadingIndicator from '@/components/LoadingIndicator.vue'
import { DataStatus } from '@/dataStatus'

export default defineComponent({
  data: () => ({
    doctor: null as Doctor | null,
    specialities: [] as Speciality[],
    appointmentDateStr: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, -1),
    userStore: userStore(),
    dataStatus: DataStatus.Loading
  }),
  computed: {
    user() {
      return this.userStore.user
    },
    id() {
      if (this.$route.params.id) {
        return Number(this.$route.params.id)
      } else {
        return null
      }
    }
  },
  methods: {
    async getSpecialities() {
      this.specialities = await getSpecialities(false)
    },
    async getDoctor() {
      if (this.id) {
        try {
          this.doctor = await getDoctor(this.id, true)
          if (this.doctor) {
            this.doctor.speciality = this.specialities.find(speciality => speciality.id == this.doctor?.speciality.id) as Speciality
          }
          this.dataStatus = DataStatus.Ready
        } catch (error) {
          this.doctor = null
          if (error instanceof ForbiddenError) {
            this.dataStatus = DataStatus.Forbidden
          } else {
            this.dataStatus = DataStatus.Error
          }
        }
      } else {
        this.doctor = null
        this.dataStatus = DataStatus.NotFound
      }
    },
    async saveDoctor() {
      if (this.doctor) {
        try {
          await updateDoctor(this.doctor)
          alert('Данные врача успешно изменены')
        } catch (error) {
          console.log(error)
          alert('Ошибка!')
        }
      }
    },
    async deleteDoctor() {
      if (this.doctor) {
        try {
          await deleteDoctor(this.doctor)
          alert('Врач успешно удалён.')
          this.$router.push('/')
        } catch (error) {
          console.log(error)
          alert('Ошибка!')
        }
      }
    }
  },
  created() {
    this.getSpecialities()
    this.getDoctor()
    this.$watch(
      () => this.$route.params,
      () => {
        console.log('watcher')
        this.getDoctor()
      })
  },
  components: {
    LoadingIndicator
  }
})

</script>

<style scoped>
.doctor-block {
  display: grid;
  grid-template: auto / auto 1fr;
  align-items: center;
  text-align: right;
  width: 400px;
  gap: 1em;
}

.doctor-block h2 {
  grid-column: span 2;
}
/* 
.doctor-block p {
  margin-bottom: 1em;
} */

.doctor-block > div {
  justify-self: left;
}

input[type=submit], input[type=button] {
  grid-column: span 2;
  padding: 0px 16px;
  justify-self: center;
  cursor: pointer;
}
</style>
