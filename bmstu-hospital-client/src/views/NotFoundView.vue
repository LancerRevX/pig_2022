<template>
  <div class="not-found-box">
      <h2>404 не найдено!</h2>
  </div>
</template>

<script lang="ts">
import {defineComponent, inject} from 'vue'
import { login, logout, type Doctor, type SignupParams, signup } from '@/myapi'
import type { PropType } from 'vue'
import { userStore } from '@/userStore'
import { RouterLink } from 'vue-router'
import * as errors from '@/myapi/errors'

export default defineComponent({
  data: () => ({
  }),
  created() {
  }
})
</script>

<style scoped>
</style>