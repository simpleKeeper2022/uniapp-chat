import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'

export const useMainStore = defineStore('main', () => {
  const state = reactive({
    count: 0
  })

  /**
   * 加法
   */
  function increment() {
    state.count++
  }

  /**
   * 减法
   */
  function decrement() {
    state.count--
  }

  return {
    ...toRefs(state),
    increment,
    decrement
  }
})
