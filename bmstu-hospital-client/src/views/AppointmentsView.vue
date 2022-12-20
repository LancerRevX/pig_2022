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
          <th>Статус</th>
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
            {{ appointment.status.name }}
          </td>
          <td>
            <button 
              @click="cancelAppointment(appointment)"
              v-if="appointment.status.value == 0"
            >Отменить</button>
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
import {getAppointments, deleteAppointment, type Appointment, type AppointmentStatus, ForbiddenError, getAppointmentStatuses} from '@/myapi'

export default defineComponent({
  data: () => ({
    status: DataStatus.Loading,
    appointments: [] as Appointment[],
    appointmentStatuses: [] as AppointmentStatus[],
    userStore: userStore()
  }),
  methods: {
    async deleteAppointment(appointment: Appointment) {
      await deleteAppointment(appointment)
      this.getData()
    },
    async getData() {
      this.appointmentStatuses = []
      this.appointments = []
      try {
        this.appointmentStatuses = await getAppointmentStatuses()
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
    },
    async cancelAppointment(appointment: Appointment) {
      await deleteAppointment(appointment)
      this.getData()
    }
  },
  watch: {
    'userStore.user'() {
      this.getData()
    }
  },
  components: {
    LoadingIndicator
  },
  created() {
    this.getData()
  }
})
  
</script>

<style scoped>

</style>
    