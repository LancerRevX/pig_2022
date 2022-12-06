<template>
  <div class="single-doctor-block">
    <p v-if="doctor === undefined">Загрузка...</p>
    <p v-else-if="doctor === null">Доктор с ID = {{ id }} не найден</p>
    <div class="doctor-block" v-else>
      <h2>{{ doctor.name }}</h2>
      <img v-if="doctor.photo" :src="doctor.photo">
      <img v-else-if="doctor.gender == 1" height=500 src="@/assets/placeholder_male.jpg">
      <img v-else height=500 src="@/assets/placeholder_female.jpg">
      <div>
        <h3>{{ doctor.speciality.name }}</h3>
        <p>{{ doctor.speciality.description }}</p>
        <br>
        <h3>Стаж</h3>
        <p>{{ years_to_str(doctor.work_record) }}</p>
        <br>
        <h3>Стоимость приёма</h3>
        <p>{{ doctor.cost }} руб.</p>
        <br>

        <div class="make-appointment-box" v-if="user?.patient">
          <input type="datetime-local" v-model="appointmentDateStr">
          <button @click="makeAppointment()">Записаться на приём</button>
        </div>

        <br><br>
        <div v-if="doctor.speciality.doctors.length">
          <h3>Врачи с той же специальностью</h3>
          <RouterLink
            v-for="similar_doctor in doctor.speciality.doctors" 
            :key="similar_doctor.id" 
            :to="'/doctors/' + similar_doctor.id">
            <p>{{ similar_doctor.name }}</p>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import { type Doctor, type Speciality, getPatients, createAppointment, getDoctor } from '@/myapi/types'
import * as api from '@/api'
import { userStore } from '@/userStore'

export default defineComponent({
  data: () => ({
    doctor: undefined as Doctor | null | undefined,
    id: 0,
    appointmentDateStr: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, -1),
    userStore: userStore()
  }),
  computed: {
    user() {
      return this.userStore.user
    }
  },
  methods: {
    async makeAppointment() {
      if (!this.appointmentDateStr) {
        alert('Введите желаемую дату записи!')
        return
      }
      let appointmentDate = new Date(this.appointmentDateStr)
      if (this.doctor) {
        let result = await createAppointment(this.doctor, appointmentDate)
        if (result) {
          alert('Вы успешно записались к врачу!')
        } else {
          alert('Не удалось записаться на выбранное время!')
        }
      }
    },
    async getDoctor() {
      this.id = Number(this.$route.params.id)
      this.doctor = await getDoctor(this.id, true)
    },
    years_to_str(years: number) {
      let txt
      let count = years % 100
      if (count >= 5 && count <= 20) {
        txt = 'лет'
      } else {
        count = count % 10
        if (count == 1) {
          txt = 'год'
        } else if (count >= 2 && count <= 4) {
          txt = 'года'
        } else {
          txt = 'лет'
        }
      }
      return years + " " + txt
    }
  },
  created() {
    this.getDoctor()
    this.$watch(
      () => this.$route.params,
      () => {
        console.log('watcher')
        this.getDoctor()
      })
  }
})

</script>

<style>
.doctor-block {
  display: grid;
  grid-template: auto 1fr / auto 1fr;
  gap: 1em;
}

.doctor-block h2 {
  grid-column: span 2;
}
/* 
.doctor-block p {
  margin-bottom: 1em;
} */
</style>
