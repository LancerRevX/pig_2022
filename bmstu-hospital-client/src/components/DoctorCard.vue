<template>
  <router-link class="doctor-card" :to="'/doctors/' + doctor.id">
    <img v-if="doctor.photo" :src="doctor.photo">
    <img v-else-if="doctor.gender == 1" src="@/assets/placeholder_male.jpg">
    <img v-else src="@/assets/placeholder_female.jpg">
    <h3>Специализация</h3>
    <p>{{ doctor.speciality.name }}</p>
    <h3>ФИО</h3>
    <p>{{ doctor.name }}</p>
    <h3>Стоимость приёма</h3>
    <p>{{ doctor.cost }} руб.</p>
  </router-link>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import type { Doctor } from "@/myapi"
import type { PropType } from 'vue'

export default defineComponent({
  props: {
    doctor: {
      type: Object as PropType<Doctor>,
      required: true
    }
  }
})
</script>

<style>
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
}

.doctor-card img {
  width: auto;
  min-height: 100px;
}

.doctor-card:hover {
  background-color: greenyellow;
}

.doctor-card:active {
  background-color: green;
  color: white;
}
</style>