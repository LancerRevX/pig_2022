<template>
  <router-link class="doctor-card" :to="'/doctors/' + doctor.id">
    <img v-if="doctor.photo" :src="doctor.photo">
    <img v-else-if="doctor.gender == 1" src="@/assets/placeholder_male.jpg">
    <img v-else src="@/assets/placeholder_female.jpg">
    <p>{{ doctor.name }}</p>
    <p>{{ doctor.speciality.name }}</p>
    <p>Стоимость приёма: {{ doctor.cost }}&nbsp;руб.</p>
    <router-link :to="'/manager/edit-doctor/' + String(doctor.id)" v-if="userStore.user?.manager">
      <button>
        Редактировать
      </button>
    </router-link>
  </router-link>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import type { Doctor } from "@/myapi"
import type { PropType } from 'vue'
import { userStore } from '@/userStore'

export default defineComponent({
  data() {
    return {
      userStore: userStore()
    }
  },
  props: {
    doctor: {
      type: Object as PropType<Doctor>,
      required: true
    }
  }
})
</script>

<style scoped>
.doctor-card {
  width: 256px;
  height: 256px;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  text-decoration: none;
  color: inherit;
  padding: 8px;
}

.doctor-card img {
  width: auto;
  min-height: 0px;
}

.doctor-card:hover {
  background-color: greenyellow;
}

.doctor-card:active {
  background-color: green;
  color: white;
}

.doctor-card button {
  cursor: pointer;
}
</style>