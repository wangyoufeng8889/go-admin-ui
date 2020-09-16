<template>
  <div class="myTable">
    <div class="input searchInfo">
      <span><span>时间：</span>
        <el-date-picker
          v-model="buckTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:SS"
          :default-time="['08:00:00', '20:00:00']"
        />
      </span>
      <el-button type="primary" style="float: right; position: relative;left: -20px;" @click="findTrackData">搜索</el-button>
    </div>
    <div class="amap-page-container">
      <div id="amap-show" class="amap-demo" style="height: 600px;" />
    </div>
  </div>
</template>

<script>
// NPM 方式
import { lazyAMapApiLoaderInstance } from 'vue-amap'
import { getBatteryMoveInfo } from '@/api/batterymanage/batterylocaltion'
// import carUrl from 'https://webapi.amap.com/images/car.png'
export default {
  name: 'TrackShow',
  props: ['dataInit'],
  data() {
    return {
      // 遮罩层
      loading: true,
      buckTime: [],
      carUrl: 'https://webapi.amap.com/images/car.png',
      mapcenter: {
        center: [],
        zoom: 15
      },
      // 查询参数
      queryParams: {
        dtu_id: undefined,
        pkg_id: undefined,
        startTime: undefined,
        endTime: undefined
      },
      trackdata: [],
      gpsData: []
    }
  },
  created() {
    this.queryParams = this.dataInit
    this.ISdata = true
    this.getTrackData()
  },
  methods: {
    getTrackData() {
      this.loading = true
      console.log(this.queryParams, 'this.queryParams')
      getBatteryMoveInfo(this.queryParams).then(response => {
        console.log('response=', response)
        this.trackdata = response.data
        const listData = []
        for (var i = 0; i < this.trackdata.length; i++) {
          const add = []
          add.push(this.trackdata[i].dtu_longitude)
          add.push(this.trackdata[i].dtu_latitude)
          listData.push(add)
        }
        this.gpsData = listData
        this.loading = false
        console.log('gpsData=', this.gpsData)
        const add = []
        add.push(this.trackdata[0].dtu_longitude)
        add.push(this.trackdata[0].dtu_latitude)
        console.log('addcenter', add)
        // this.mapcenter.center.push(add)
        this.mapcenter.center = add
        console.log('mapcenter=', this.mapcenter)
        this.initPage()
      })
    },
    findTrackData() {
      if (this.buckTime.length !== 0) {
        this.queryParams.startTime = this.buckTime[0]
        this.queryParams.endTime = this.buckTime[1]
      }
      this.getTrackData()
    },
    initMap() {
      lazyAMapApiLoaderInstance.load().then(() => {
        this.map = new AMap.Map('amap-show', this.mapcenter)
      })
    },
    initPage() {
      // console.log('===== init===')
      lazyAMapApiLoaderInstance.load().then(() => {
        this.map = new AMap.Map('amap-show', this.mapcenter,
          AMapUI.loadUI(['misc/PathSimplifier'], (PathSimplifier) => {
            if (!PathSimplifier.supportCanvas) {
              alert('当前环境不支持 Canvas！')
              return
            }

            // 创建组件实例
            var pathSimplifierIns = new PathSimplifier({
              zIndex: 100,
              map: this.map, // 所属的地图实例
              getPath: (pathData) => {
              // 将gps描述的所有的点数放到全局变量
                pathData.path.length // 返回轨迹数据中的节点坐标信息，[AMap.LngLat, AMap.LngLat...] 或者 [[lng|number,lat|number],...]
                return pathData.path
              },
              getHoverTitle: (pathData, pathIndex, pointIndex) => {
              // 返回鼠标悬停时显示的信息
                if (pointIndex >= 0) {
                // 鼠标悬停在某个轨迹节点上
                  return pathData.name + '，点:' + pointIndex + '/' + pathData.path.length
                }
                // 鼠标悬停在节点之间的连线上
                return pathData.name + '，点数量' + pathData.path.length
              },
              renderOptions: {
              // 轨迹线的样式
                pathLineStyle: {
                  strokeStyle: 'red',

                  lineWidth: 3, // 线宽度
                  dirArrowStyle: {

                    stepSpace: 15 // stepSpace: {number} 箭头排布的间隔，单位像素
                  }
                }
              }
            })
            // 这里构建两条简单的轨迹，仅作示例
            // var gpsData = eval(data);
            // const gpsData = [[119.987803, 30.276918], [119.887803, 30.176918], [119.787803, 30.076918], [119.687803, 29.276918], [118.987803, 29.176918], [118.587803, 28.276918]]

            const gpsData = this.gpsData
            console.log(gpsData, 'this.gpsDatathis.gpsData')
            pathSimplifierIns.setData([{
              name: '轨迹0',
              path: gpsData
            }])
          })
        )
      })
    },
    msg() {
      this.$notify.info({
        title: '提示',
        message: '暂无轨迹数据'
      })
    }
  }
}
</script>

<style scoped>
    .input input{
        position: relative;
        display: inline-block;
        border-radius: 5px;
        height: 20px;
        margin-right: 20px;
        font-size: 16px;
        line-height: 32px;
        width: 250px;
        padding-left: 8px;
    }
</style>
