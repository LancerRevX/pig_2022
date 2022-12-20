<template>
  <div>
    <h2>Таблица записей к врачам</h2>
    <LoadingIndicator :data-status="DataStatus.Forbidden" v-if="!userStore.user?.manager"></LoadingIndicator>
    <div class="appointments-box" v-else>
      <div class="filter-box">
        <span>Пациент</span>
        <select v-model="appointmentFilter.patient" @change="getData()">
          <option :value="undefined">Любой</option>
          <option v-for="patient of patients" :key="patient.id" :value="patient">
            {{ patient.name }}
          </option>
        </select>
        <span>Врач</span>
        <select v-model="appointmentFilter.doctor" @change="getData()">
          <option :value="undefined">Любой</option>
          <option v-for="doctor of doctors" :key="doctor.id" :value="doctor">
            {{ doctor.name }}
          </option>
        </select>
        <span>Статус</span>
        <select v-model="appointmentFilter.status" @change="getData()">
          <option :value="undefined">Любой</option>
          <option v-for="status of appointmentStatuses" :key="status.value" :value="status">
            {{ status.name }}
          </option>
        </select>
        <span>Дата и время</span>
        <div class="datetime-filter-box">
          <span>С</span>
          <input type="datetime-local" v-model="datetimeAfterStr">
          <span>до</span>
          <input type="datetime-local" v-model="datetimeBeforeStr">
        </div>
      </div>
      <LoadingIndicator :data-status="DataStatus.Ready" :data-array="[]" v-if="!appointments.length"></LoadingIndicator>
      <table class="appointments-table" v-else>
        <thead>
          <tr>
            <th>ID</th>
            <th>Пациент</th>
            <th>Врач</th>
            <th>Дата и время</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="appointment in appointments" :key="appointment.id"
            :class="isFuture(appointment) ? 'future' : 'past'"
          >
            <td>{{ appointment.id }}</td>
            <td>{{ appointment.patient.name }}</td>
            <td>
              <router-link :to="'/doctors/' + appointment.doctor.id">
                {{ appointment.doctor.name }}
              </router-link>
            </td>
            <td>
              {{ appointment.datetime.toLocaleString() }}
            </td>
            <td>
              <select v-on:change="changeAppointment(appointment)" v-model="appointment.status">
                <option v-for="status of appointmentStatuses" :key="status.value" :value="status">
                  {{ status.name }}
                </option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
  
<script lang="ts">
import {defineComponent} from 'vue'
import { DataStatus } from '@/dataStatus'
import { userStore } from '@/userStore'
import LoadingIndicator from '@/components/LoadingIndicator.vue'
import {
  getAppointments, updateAppointment, type Appointment, 
  type AppointmentStatus,
  type AppointmentFilter,
  ForbiddenError,
type Patient,
type Doctor,
getPatients,
getDoctors,
getAppointmentStatuses,
} from '@/myapi'

export default defineComponent({
  data: () => ({
    appointments: [] as Appointment[],
    patients: [] as Patient[],
    doctors: [] as Doctor[],
    userStore: userStore(),
    DataStatus,
    appointmentFilter: {
      patient: undefined,
      doctor: undefined,
      status: undefined,
      datetimeAfter: undefined,
      datetimeBefore: undefined,
    } as AppointmentFilter,
    datetimeAfterStr: '',
    datetimeBeforeStr: '',
    appointmentStatuses: [] as AppointmentStatus[]
  }),
  methods: {
    async changeAppointment(appointment: Appointment) {
      await updateAppointment(appointment)
    },
    async getData() {
      this.patients = await getPatients()
      this.doctors = await getDoctors()
      this.appointmentStatuses = await getAppointmentStatuses()
      this.appointments = await getAppointments(this.appointmentFilter)
      for (let appointment of this.appointments) {
        appointment.status = this.appointmentStatuses.find(status => status.value == appointment.status.value) as AppointmentStatus
      }
    },
    isFuture(appointment: Appointment) {
      return appointment.datetime > new Date()
    },
    async updateDatetimeFilter() {
      this.appointmentFilter.datetimeAfter = this.datetimeAfterStr ? new Date(this.datetimeAfterStr) : undefined
      this.appointmentFilter.datetimeBefore = this.datetimeBeforeStr ? new Date(this.datetimeBeforeStr) : undefined
      await this.getData()
    }
  },
  watch: {
    'userStore.user'() {
      this.getData()
    },
    datetimeAfterStr() {
      this.updateDatetimeFilter()
    },
    datetimeBeforeStr() {
      this.updateDatetimeFilter()
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
.appointments-box {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}

.filter-box {
  display: grid;
  grid-template: auto / auto 1fr;
  gap: 4px 8px;
}

.datetime-filter-box {
  display: flex;
  align-items: center;
  gap: 4px;
}

.future {
  background-color: aquamarine;
}

.past {
  background-color: grey;
  color: lightgray;
}

.past a:visited {
  color: inherit;
}
</style>
    