<template>
  <div class="myTable">
    <div class="input searchInfo">
      <span><span>时间：</span>
        <el-date-picker
          v-model="startTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
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
// import carUrl from 'https://webapi.amap.com/images/car.png'
export default {
  name: 'TrackShow',
  data() {
    return {
      iccid: '',
      startTime: '',
      carUrl: 'https://webapi.amap.com/images/car.png'
    }
  },
  created() {
    this.initMap()
    console.log('thisDate:', this.startDate)
  },
  methods: {
    findTrackData() {
      console.log('thisDate:', this.startDate)
      this.initPage()
    },
    getGPSData() {
      this.$http.get('api/contrail/trackLocations', { params: { iccid: this.iccid, date: this.startTime }}).then(result => {
        const code = result.data.code
        const gpsData = result.data.data
        this.loadState = false
        if (code !== 200 || gpsData === '' || gpsData === null) {
          this.initMap()
          return
        }
        var strArr = gpsData.split(';')
        var length = strArr.length - 1
        var resultStr = ''
        for (var i = 0; i < length; i++) {
          var gpsArr = strArr[i].split(',')
          if (gpsArr[11] !== '1') {
            continue // 去除非 GPS 数据
          }
          var jd = gpsArr[3]
          var wd = gpsArr[5]
          resultStr += '[' + wd + ',' + jd + '],'
        }
        if (resultStr === '') {
          this.msg()
          this.initMap()
          return
        }
        resultStr = '[' + resultStr + ']'
        this.initPage(resultStr)
      })
    },
    getDurationGPSData() {
      this.$http.get('api/contrail/durationLocations', { params: { iccid: this.iccid, startTime: this.startDate, endTime: this.startDate }}).then(result => {
        const code = result.data.code
        const gpsData = result.data.data
        if (code !== 200 || gpsData === '' || gpsData === null) {
          this.msg()
          this.initMap()
          return
        }
        var strArr = gpsData.split(';')
        var length = strArr.length - 1
        var resultStr = ''
        for (var i = 0; i < length; i++) {
          var gpsArr = strArr[i].split(',')
          if (gpsArr[11] !== '1') {
            continue // 去除非 GPS 数据
          }
          var jd = gpsArr[3]
          var wd = gpsArr[5]
          resultStr += '[' + wd + ',' + jd + '],'
        }
        if (resultStr === '') {
          this.msg()
          this.initMap()
          return
        }
        resultStr = '[' + resultStr + ']'
        this.initPage(resultStr)
      })
    },
    initMap() {
      lazyAMapApiLoaderInstance.load().then(() => {
        this.map = new AMap.Map('amap-show', {
          center: [119.987803, 30.276918],
          zoom: 11
        }
        )
      })
    },
    initPage() {
      console.log('===== init===')
      lazyAMapApiLoaderInstance.load().then(() => {
        this.map = new AMap.Map('amap-show', {
          center: [119.987803, 22.627198],
          zoom: 6
        },
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
          const gpsData = [[119.987803, 30.276918], [119.887803, 30.176918], [119.787803, 30.076918], [119.687803, 29.276918], [118.987803, 29.176918], [118.587803, 28.276918]]
          pathSimplifierIns.setData([{
            name: '轨迹0',
            path: gpsData
          }])

          // var nav = pathSimplifierIns.createPathNavigator(0, {
          //     loop: true,
          //     speed: 400000,
          //     pathNavigatorStyle: {
          //         width: 16,
          //         height: 32,
          //         content: PathSimplifier.Render.Canvas.getImageContent(this.carUrl, onload, onerror),
          //         strokeStyle: null,
          //         fillStyle: null
          //     }
          // });
          // nav.start();
          /* var currentIndex = -1; //定义一个临时 变量存储 navg move方法触发频发，展示数据只展示一次
                        let _this = this;
                        nav.on('move',function() {
                            var onecuso = nav.getCursor().idx; //move 一直触发 获取 轨迹中 的下标
                            if(onecuso > pointNum-1)return false;
                            if(currentIndex !== onecuso){
                                currentIndex = onecuso;
                                _this.speed1 = (speedArr[onecuso]*3.6).toFixed(1);  // 保留一位小数
                            }
                        });*/
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
