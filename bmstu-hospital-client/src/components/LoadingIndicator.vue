<template>
  <div>
    <span v-if="dataStatus == DataStatus.Loading">
      Загрузка...
    </span>
    <span v-else-if="dataStatus == DataStatus.Forbidden" class="forbidden">
      Доступ запрещён!
    </span>
    <span v-else-if="(dataStatus == DataStatus.Error)" class="error">
      Ошибка загрузки данных! Подробности в консоли.
    </span>
    <span v-else-if="dataStatus == DataStatus.NotFound">
      Данные не найдены!
    </span>
    <span v-else-if="(dataArray && (dataStatus == DataStatus.Ready) && dataArray.length == 0)">
      Пусто!
    </span>
  </div>
</template>

<script lang="ts">
import {defineComponent, type Prop} from 'vue'
import type { PropType } from 'vue'
import { DataStatus } from '@/dataStatus'

export default defineComponent({
  data: () => ({
    DataStatus
  }),
  props: {
    dataStatus: {
      type: Number as PropType<DataStatus>,
      required: true
    },
    dataArray: {
      type: Array as PropType<any[]>,
      required: false
    }
  }
})
</script>

<style scoped>
.forbidden {
  color: red;
  font-weight: bold;
}

.error {
  color: purple;
  font-weight: bold;
}
</style>