<script setup>
import { onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue';
import { initOffLineElevatorMap, FMType } from '../utils/fengmap'
import _ from 'lodash'
// props
const props = defineProps(['curNav'])
const { curNav } = toRefs(props)

// mapId
const mapId = 'project-fengmap__elevator'
// 地图实例
let mapInstance = null
let lastHideBuilding = null
// 楼栋地图映射
const buildingMap = {
  '22070101042': { themeId: '1545308642963337218', mapId: '1545250644203249666' }, // 一号楼
  '22070101043': { themeId: '1545308642963337218', mapId: '1545250055339528193' }, // 二号楼
  '22070101044': { themeId: '1545308642963337218', mapId: '1545250024180260866' }, // 三号楼
  '22070101045': { themeId: '1545308642963337218', mapId: '1545250002273193985' }, // 五号楼
  '22070101046': { themeId: '1545308642963337218', mapId: '1545249933348413441' }, // 六号楼
  '22070101047': { themeId: '1545308642963337218', mapId: '1545249914310250498' }, // 七号楼
  '22070101048': { themeId: '1545308642963337218', mapId: '1535906487919812609' }, // 八号楼
}
const processHover = _.throttle(function(event){
  console.log('mapInstance hover', event)
}, 500)
// 初始化地图
const initFengMap = () => {
  if (mapInstance) {
    return true
  }
  mapInstance = initOffLineElevatorMap(mapId)
  mapInstance.on('hover', function(event) {
    processHover(event)
  })
  // 监听点击事件
  mapInstance.on('click', function (event) {
    const { targets } = event
    // 判断是否点击的楼栋
    // let buildingNumber = null
    // const reg = /\d号楼/
    let curBuildingFID = null
    if (lastHideBuilding) {
      lastHideBuilding.visible = true
    }
    if (targets instanceof Array) {
      for (let i = 0; i < targets.length; i++) {
        const ele = targets[i]
        if (ele.type == FMType.EXTERNAL_MODEL) {
          const modelData = ele.getData()
          // console.log('modelData :', ele.type, modelData.ID, modelData, modelData)
          console.log({
            '模型type': ele.type,
            '模型ID': modelData.ID,
            '模型FID': modelData.FID,
            '模型typeID': modelData.typeID
          })
          const FID = modelData.FID
          if (FID && buildingMap[FID]) {
            curBuildingFID = FID
            if (ele.visible) {
              lastHideBuilding = ele
              // ele.visible = false
            }
            break
          }
        }
      }
    }
  })
}
onMounted(initFengMap)
onBeforeUnmount(() => {
  if (mapInstance && mapInstance.dispose) {
    // mapInstance.dispose()
    // mapInstance = null
  }
})
</script>
<template>
  <div id="project-fengmap__elevator" class="map-container"></div>
</template>
<style lang="css" scoped>
@import "../style/map.css";
</style>