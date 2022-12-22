<template>
  <div class="doctors-block">
    <h2>Список врачей</h2>
    <span>Специальность</span>
    <select v-model="specialityFilter">
      <option :value="undefined">Любая</option>
      <option v-for="speciality in specialities" :key="speciality.id" :value="speciality">
        {{ speciality.name }}
      </option>
    </select>
    <br>
    <span>Стоимость приема</span>
    <input type="number" placeholder="От" v-model="minCostFilter">
    <input type="number" placeholder="До" v-model="maxCostFilter">
    <div class="doctors-cards" v-if="doctors.length">
      <DoctorCard v-for="doctor in doctors" :key="doctor.id" :doctor="doctor"></DoctorCard>
    </div>
    <p v-else>Список пуст.</p>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import DoctorCard from '@/components/DoctorCard.vue'
import { type Doctor, type Speciality, getDoctors, getSpecialities } from '@/myapi'
import { userStore } from '@/userStore'

export default defineComponent({
  data: () => ({
    doctors: [] as Doctor[],
    specialities: [] as Speciality[],
    specialityFilter: undefined as Speciality | undefined,
    minCostFilter: undefined as number | undefined,
    maxCostFilter: undefined as number | undefined,
    user: userStore().user
  }),
  components: {
    DoctorCard
  },
  methods: {
    async getDoctors() {
      this.doctors = await getDoctors({
        speciality: this.specialityFilter,
        minCost: this.minCostFilter,
        maxCost: this.maxCostFilter
      }, false)
    }
  },
  watch: {
    specialityFilter(newFilter) {
      this.getDoctors()
    },
    minCostFilter(newFilter) {
      this.getDoctors()
    },
    maxCostFilter(newFilter) {
      this.getDoctors()
    }
  },
  async created() {
    this.specialities = await getSpecialities(false)
    this.getDoctors()
  }
})

</script>

<style>
.doctors-cards {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1em;
}

@media (max-width: 480px) {
  .doctors-block {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .doctors-cards {
    margin-top: 16px;
    justify-content: center;
  }
}
</style>
