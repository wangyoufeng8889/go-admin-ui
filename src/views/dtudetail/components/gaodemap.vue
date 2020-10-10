<template>
  <div class="amap-page-container">
    <div v-if="ISdata" :style="{width:'100%',height:'300px', overflow: 'hidden'}">
      <el-amap vid="amap" class="amap-demo" :center="center" :zoom="zoom">
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
import { getBatteryLocationInfo } from '@/api/batterymanage/batterylocaltion'
export default {
  props: ['dataInit'],
  data() {
    return {
      ISdata: false,
      label: {
        content: '',
        offset: [10, 12]
      },
      pkg_id: '',
      center: [],
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
      this.queryParams = this.dataInit
      console.log('map this.pkg_id', this.queryParams)
      // 去后端提取定位
      this.getLocation()
    }, 1000)
  },
  methods: {
    getLocation() {
      getBatteryLocationInfo(this.queryParams).then(response => {
        console.log('response=', response)
        this.trackdata = response.data
        const add = []
        add.push(this.trackdata[0].dtu_longitude)
        add.push(this.trackdata[0].dtu_latitude)
        console.log('addcenter', add)
        this.center = add
        console.log('mapcenter=', this.center)
        this.ISdata = true
      })
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
