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
import { getBatteryLocationInfo } from '@/api/batterymanage/batterylocaltion'
export default {
  props: ['dataInit'],
  data() {
    const self = this
    return {
      ISdata: false,
      label: {
        content: '',
        offset: [10, 12]
      },
      pkg_id: '',
      center: [],
      lng: 119.987803,
      lat: 30.276918,
      zoom: 16,
      loaded: false,
      plugin: [{
        enableHighAccuracy: true, // 是否使用高精度定位，默认:true
        timeout: 100, // 超过10秒后停止定位，默认：无穷大
        maximumAge: 0, // 定位结果缓存0毫秒，默认：0
        convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        showButton: false, // 显示定位按钮，默认：true
        buttonPosition: 'RB', // 定位按钮停靠位置，默认：'LB'，左下角
        showMarker: true, // 定位成功后在定位到的位置显示点标记，默认：true
        showCircle: true, // 定位成功后用圆圈表示定位精度范围，默认：true
        panToLocation: true, // 定位成功后将定位到的位置作为地图中心点，默认：true
        zoomToAccuracy: true, // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：f
        extensions: 'all',
        pName: 'Geolocation',
        events: {
          init(o) {
            // o 是高德地图定位插件实例
            o.getCurrentPosition((status, result) => {
              if (result && result.position) {
                self.lng = 110.987803
                self.lat = 30.276918
                self.center = [self.lng, self.lat]
                self.loaded = true
                self.$nextTick()
              }
            })
          }
        }
      }],
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
      this.pkg_id = this.dataInit
      console.log('map this.pkg_id', this.pkg_id)
      // 去后端提取定位
      this.getLocation()
    }, 1000)
  },
  methods: {
    getLocation() {
      this.queryParams.pkg_id = this.pkg_id
      getBatteryLocationInfo(this.queryParams).then(response => {
        console.log('response=', response)
        this.trackdata = response.data
        const add = []
        add.push(this.trackdata[0].dtu_longitude)
        add.push(this.trackdata[0].dtu_latitude)
        console.log('addcenter', add)
        // this.mapcenter.center.push(add)
        this.center = add
        console.log('mapcenter=', this.center)
        this.ISdata = true
      })
    },
    req_post() {

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
