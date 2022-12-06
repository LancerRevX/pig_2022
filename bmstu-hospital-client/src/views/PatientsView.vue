<template>
    <div class="patients-block">
      <h2>Список пациентов</h2>
      <LoadingIndicator :data-array="patients" :data-status="status" v-if="(patients.length == 0)"></LoadingIndicator>
      <table class="patients-table" v-else>
        <thead>
          <tr>
            <th>ФИО</th>
            <th>Пол</th>
            <th>Дата рождения</th>
            <th>Возраст</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="patient in patients" :key="patient.id">
            <td>{{ patient.name }}</td>
            <td>{{ patient.gender ? 'Мужчина' : 'Женщина' }}</td>
            <td>{{ patient.birthDate.toLocaleDateString() }}</td>
            <td>{{ patient.age }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
<script lang="ts">
import {defineComponent} from 'vue'
import { getPatients, type Patient, ForbiddenError } from '@/myapi'
import { DataStatus } from '@/dataStatus'
import LoadingIndicator from '@/components/LoadingIndicator.vue'

export default defineComponent({
  data: () => ({
    status: DataStatus.Loading,
    patients: [] as Patient[]
  }),
  methods: {
    async getPatients() {
      this.status = DataStatus.Loading
      try {
        this.patients = await getPatients({})
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
  components: {
    LoadingIndicator
  },
  created() {
    this.getPatients()
  }
})

</script>

<style scoped>

</style>
