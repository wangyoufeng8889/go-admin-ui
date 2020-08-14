<template>
  <div class="dashboard-container">
    <component :is="currentPage" @goBatteryPage="chargepage" />
  </div>
</template>

<script>
import Batterylist from './components/Batterylist'
import Batterydetail from './components/Batterydetail'
export default {
  name: 'Batterymanage',
  components: { Batterylist, Batterydetail },
  data() {
    return {
      currentPage: 'Batterylist',
      goPage: '',
      pkgid: ''
    }
  },
  created() {
    // if (!this.roles.includes('admin')) {
    //   this.currentPage = 'editorDashboard'
    // }
  },
  methods: {
    chargepage(data) {
      this.pkgid = data.pkgid
      this.currentPage = data.goPage
      console.log(data)
    }
  }
}
</script>
