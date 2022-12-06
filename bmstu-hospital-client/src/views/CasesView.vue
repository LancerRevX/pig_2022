<template>
  <div class="wards-block">
    <h2>Список палат</h2>
      <LoadingIndicator :data-array="cases" :data-status="status" v-if="(cases.length == 0)"></LoadingIndicator>
      <table class="cases-table" v-else>
      <thead>
        <tr>
          <th>Дата поступления</th>
          <th>Выписан</th>
          <th>Дата выписки</th>
          <th>Пациент</th>
          <th>Врач</th>
          <th>Номер палаты</th>
          <th>Описание</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="case_ in cases" :key="case_.id">
          <td>{{ case_.startDate.toLocaleString() }}</td>
          <td>{{ case_.active ? 'Нет' : 'Да' }}</td>
          <td>{{ case_.endDate?.toLocaleString() || 'Нет' }}</td>
          <td>{{ case_.patient.name }}</td>
          <td>{{ case_.doctor.name }}</td>
          <td>{{ case_.wardNumber }}</td>
          <td>{{ case_.description }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
  
<script lang="ts">
import {defineComponent} from 'vue'
import { DataStatus } from '@/dataStatus'
import LoadingIndicator from '@/components/LoadingIndicator.vue'
import {type Case, getCases, ForbiddenError} from '@/myapi'
import { userStore } from '@/userStore'
  
export default defineComponent({
  data: () => ({
    status: DataStatus.Loading,
    cases: [] as Case[]
  }),
  methods: {
    async getCases() {
      try {
        this.cases = await getCases()
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
      this.getCases()
    }
  },
  components: {
    LoadingIndicator
  },
  created() {
    this.getCases()
  }
})
  
</script>

<style scoped>

</style>
  