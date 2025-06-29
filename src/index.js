import vuefstable from './components/vuefstable.vue'

const VueFsTablePlugin = {
  install(Vue) {
    Vue.component('vuefstable', vuefstable)
  }
}

export default VueFsTablePlugin
export { vuefstable }