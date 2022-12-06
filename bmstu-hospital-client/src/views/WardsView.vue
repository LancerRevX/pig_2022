<template>
  <div class="wards-block">
    <h2>Список палат</h2>
    <LoadingIndicator :data-array="wards" :data-status="status" v-if="(wards.length == 0)"></LoadingIndicator>
    <table class="wards-table" v-else>
      <thead>
        <tr>
          <th>Номер</th>
          <th>Кол-во мест</th>
          <!-- <th v-if="userStore.user?.doctor">Занято мест</th>
          <th v-if="userStore.user?.doctor">Пациенты</th> -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="ward in wards" :key="ward.number">
          <td>{{ ward.number }}</td>
          <td>{{ ward.capacity }}</td>
          <!-- <td v-if="userStore.user?.doctor">{{ ward.patients?.length }}</td>
          <td v-if="userStore.user?.doctor">
            <table class="inner-table">
              <tr v-for="patient in ward.patients" :key="patient.id">
                <td>{{ patient.name }}</td>  
              </tr>
            </table>
          </td> -->
        </tr>
      </tbody>
    </table>
  </div>
</template>
  
<script lang="ts">
import {defineComponent} from 'vue'
import { getWards, type Ward, ForbiddenError } from '@/myapi'
import { DataStatus } from '@/dataStatus'
import { userStore } from '@/userStore'
import LoadingIndicator from '@/components/LoadingIndicator.vue'

export default defineComponent({
  data: () => ({
    status: DataStatus.Loading,
    wards: [] as Ward[],
    userStore: userStore()
  }),
  methods: {
    async getWards() {
      this.status = DataStatus.Loading
      try {
        this.wards = await getWards()
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
    this.getWards()
  }
})
  
</script>

<style scoped>

</style>
  