import { defineStore } from "pinia"
import type {User} from '@/myapi'

export let userStore = defineStore('user', {
    state: () => ({
        user: null as User | null
    })
})