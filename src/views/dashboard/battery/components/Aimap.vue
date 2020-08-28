<template>
  <div class="Aimap">
    <div class="amap-page-container">
      <el-amap
        vid="amapAi"
        :center="center"
        :zoom="zoom"
        class="amap-ai"
        :events="events"
      >
        <el-amap-marker v-for="(marker,index) in markers" :key="index" :position="marker.position" :content="marker.content" :events="marker.events" />
      </el-amap>
    </div>
  </div>

</template>

<script>
module.exports = {
  props: ['dataInit'],

  data: function() {
    const self = this
    return {
      zoom: 4,
      center: [119.992338, 30.273624],
      markers: [],
      markerRefs: [],
      events: {
        init(o) {
          setTimeout(() => {
            console.log(self.markerRefs)
            const cluster = new AMap.MarkerClusterer(o, self.markerRefs, {
              gridSize: 80,
              renderCluserMarker: self._renderCluserMarker
            })
            console.log(cluster)
          }, 100)
        }
      }
    }
  },

  created() {
    const self = this
    const markers = []
    const index = 0// eslint-disable-line no-unused-vars

    // while (index <= this.dataInit.length) {
    this.dataInit.map(i => {
      markers.push({
        position: [parseFloat(i.dtu_longitude), parseFloat(i.dtu_latitude)],
        content: '<div style="text-align:center; background-color: hsla(240,100%,50%,0.8); height: 10px; width: 10px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;"></div>',
        events: {
          init(o) {
            self.markerRefs.push(o)
          },
          click: () => {
            // alert('click marker');

          }
        }
      })
      // index++??
    })

    this.markers = markers
  },

  methods: {
    _renderCluserMarker(context) {
      const count = this.markers.length

      const factor = Math.pow(context.count / count, 1 / 18)
      const div = document.createElement('div')
      const Hue = 180 - factor * 180
      const bgColor = 'hsla(' + Hue + ',100%,50%,0.7)'
      const fontColor = 'hsla(' + Hue + ',100%,20%,1)'
      const borderColor = 'hsla(' + Hue + ',100%,40%,1)'
      const shadowColor = 'hsla(' + Hue + ',100%,50%,1)'
      div.style.backgroundColor = bgColor
      const size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 20)
      div.style.width = div.style.height = size + 'px'
      div.style.border = 'solid 1px ' + borderColor
      div.style.borderRadius = size / 2 + 'px'
      div.style.boxShadow = '0 0 1px ' + shadowColor
      div.innerHTML = context.count
      div.style.lineHeight = size + 'px'
      div.style.color = fontColor
      div.style.fontSize = '14px'
      div.style.textAlign = 'center'
      context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2))
      context.marker.setContent(div)
    }
  }
}
</script>
<style lang="scss" scoped>
.Aimap{
   height: 100%;
    width: 100%;
  .amap-ai {
  height: 100%;
    width: 100%;
}
  /deep/.amap-page-container{
     height: calc(100vh - 430px);
    width: 100%;
}
  /deep/.el-vue-amap-container{
    height: calc(100vh - 430px);
}
}
</style>
