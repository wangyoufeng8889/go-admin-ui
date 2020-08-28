<template>
  <div class="amap-page-container">
    <div v-if="ISdata" :style="{width:'100%',height:'300px'}">
      <el-amap vid="amap" :plugin="plugin" class="amap-demo" :center="center" :zoom="zoom">
        <el-amap-marker
          vid="marker"
          :position="center"
          :label="label"
        />
      </el-amap>
    </div>
  </div>
</template>
<script>
export default {
  props: ['dataInit'],
  data() {
    return {
      ISdata: false,
      localmarkers: [{}],
      localInfo: [],
      label: {
        content: '',
        offset: [10, 12]
      },
      pkg_id: '',
      center: [],
      marker2: [],
      zoom: 16,
      // 查询参数
      queryParams: {
        dtu_id: undefined,
        pkg_id: undefined
      },
      trackdata: []
    }
  },
  created() {
    setTimeout(() => {
      // this.center = this.dataInit
      this.localInfo = this.dataInit
      console.log('localInfo', this.localInfo)
      this.showLocation()
      // 去后端提取定位
    }, 1000)
  },
  methods: {
    showLocation() {
      const marker = []
      var position = []
      var vid = ''
      position.push(this.localInfo[0].dtu_longitude)
      position.push(this.localInfo[0].dtu_latitude)
      this.center = position
      vid = this.localInfo[0].dtu_id

      marker.push(position)
      marker.push(vid)
      this.localmarkers.push(marker)
      console.log('this.localmarkers', this.localmarkers)
      // this.mapcenter.center.push(add)

      this.ISdata = true
    }
  }
}
</script>
<style>
  html, body, #container {
      height: 100%;
      width: 100%;
  }

  .amap-icon img,
  .amap-marker-content img{
      width: 25px;
      height: 34px;
  }

  .marker {
      position: absolute;
      top: -20px;
      right: -118px;
      color: #fff;
      padding: 4px 10px;
      box-shadow: 1px 1px 1px rgba(10, 10, 10, .2);
      white-space: nowrap;
      font-size: 12px;
      font-family: "";
      background-color: #25A5F7;
      border-radius: 3px;
  }

  .input-card{
      width: 18rem;
      z-index: 170;
  }

  .input-card .btn{
      margin-right: .8rem;
  }

  .input-card .btn:last-child{
      margin-right: 0;
  }
</style>
