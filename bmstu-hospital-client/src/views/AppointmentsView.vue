<template>
  <div class="wards-block">
    <h2>Таблица записей к врачам</h2>
    <LoadingIndicator :data-array="appointments" :data-status="status" v-if="!appointments.length"></LoadingIndicator>
    <table class="appointments-table" v-else>
      <thead>
        <tr>
          <th>ID</th>
          <th>Пациент</th>
          <th>Врач</th>
          <th>Дата и время</th>
          <th>Управление</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="appointment in appointments" :key="appointment.id">
          <td>{{ appointment.id }}</td>
          <td>{{ appointment.patient.name }}</td>
          <td>
            <router-link :to="'/doctors/' + appointment.doctor.id">
              {{ appointment.doctor.name }}
            </router-link>
          </td>
          <td>{{ appointment.datetime.toLocaleString() }}</td>
          <td>
            <button @click="deleteAppointment(appointment)">Удалить</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
  
<script lang="ts">
import {defineComponent} from 'vue'
import { DataStatus } from '@/dataStatus'
import { userStore } from '@/userStore'
import LoadingIndicator from '@/components/LoadingIndicator.vue'
import {getAppointments, deleteAppointment, type Appointment, ForbiddenError} from '@/myapi'

export default defineComponent({
  data: () => ({
    status: DataStatus.Loading,
    appointments: [] as Appointment[],
    userStore: userStore()
  }),
  methods: {
    async deleteAppointment(appointment: Appointment) {
      await deleteAppointment(appointment)
      this.getAppointments()
    },
    async getAppointments() {
      this.appointments = []
      try {
        this.appointments = await getAppointments()
        this.status = DataStatus.Ready
      } catch (error) {
        if (error instanceof ForbiddenError) {
          this.status = DataStatus.Forbidden
        } else {
          this.status = DataStatus.Error
          console.log(error)
        }
      }
    }
  },
  watch: {
    'userStore.user'() {
      this.getAppointments()
    }
  },
  components: {
    LoadingIndicator
  },
  created() {
    this.getAppointments()
  }
})
  
</script>

<style scoped>

</style>
    