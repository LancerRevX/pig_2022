<template>
  <div class="doctor-card">
    <img :src="doctor.photo">
    <h3>Специализация</h3>
    <p>{{ doctor.speciality.name }}</p>
    <h3>ФИО</h3>
    <p>{{ [doctor.last_name, doctor.first_name, doctor.patronymic].join(' ') }}</p>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  props: {
    doctor: Object as any
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
}

.doctor-card img {
  width: auto;
  min-height: 100px;
}
</style>