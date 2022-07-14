<script setup>
import { onBeforeUnmount, onMounted, reactive, ref, toRefs, watch } from 'vue';
import { initOffLineElevatorMap, FMType } from '../utils/fengmap'
import _ from 'lodash'
// props
const props = defineProps(['curNav'])
const { curNav } = toRefs(props)
const markerList = reactive([])
const curCoords = reactive({
  x: 0,
  y: 0,
  z: 0,
  m_id: 0,
  m_name: '消防',
  m_desc: '消防描述'
})
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
  // console.log('mapInstance hover', event)
}, 500)
const addMarker = (map, x, y, z=1) => {
  const marker = new fengmap.FMImageMarker({
    url: 'images/icon-xiaofang.png?id=' + parseInt(Math.random() * 100),
    x,
    y,
    height: parseFloat(z).toFixed(2)
  })
  const { m_name, m_id } = curCoords
  marker.m_name = m_name
  marker.m_desc = m_name
  marker.m_id = m_id + '_' + parseInt(Math.random() * 100)
  const floor = map.getFloor(map.getLevel())
  marker.addTo(floor)
  markerList.push(marker)
  console.log(markerList)
}
const handleAddMarker = () => {
  const { x, y, z} = curCoords
  addMarker(mapInstance, x, y, (z - 50).toFixed(2))
}
const handleRemoveMarker = (marker, index) => {
  marker.remove()
  markerList.splice(index,1)
}
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
    const { targets, coords } = event
    let { x, y, z } = coords
    x = +parseFloat(x).toFixed(2)
    y = +parseFloat(y).toFixed(2)
    z = +parseFloat(z).toFixed(2)
    curCoords.x = x
    curCoords.y = y
    curCoords.z = z

    // addMarker(mapInstance, x, y, z - 50)
    // 判断是否点击的楼栋
    // let buildingNumber = null
    // const reg = /\d号楼/
    let curBuildingFID = null
    if (lastHideBuilding) {
      lastHideBuilding.visible = true
    }
    console.log(event)
    if (targets instanceof Array) {
      for (let i = 0; i < targets.length; i++) {
        const ele = targets[i]
        if (ele.type == FMType.EXTERNAL_MODEL) {
          const modelData = ele.getData()
          // console.log('modelData :', ele.type, modelData.ID, modelData, modelData)
          // console.log({
          //   '模型type': ele.type,
          //   '模型ID': modelData.ID,
          //   '模型FID': modelData.FID,
          //   '模型typeID': modelData.typeID
          // })
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
  <div class="marker-info">
    <div>
      当前点击的位置信息：{{curCoords}}
    </div>
    <div class="flex">
      <div class="label">点位ID:</div>
      <input type="text" v-model="curCoords.m_id">
      <div class="label">点位名称:</div>
      <input type="text" v-model="curCoords.m_name">
      <div class="add-btn" @click="handleAddMarker(curCoords)">添加标记</div>
    </div>
    <table>
      <tr>
        <th>ID</th>
        <th>x</th>
        <th>y</th>
        <th>z(高度)</th>
      </tr>
      <tr v-for="(item, index) in markerList" :key="index">
        <td>{{item.m_id}}</td>
        <td>{{item.x}}</td>
        <td>{{item.y}}</td>
        <td>{{item.height}}</td>
        <td><a href="javascript:void(0);" @click="handleRemoveMarker(item, index)">删除</a></td>
      </tr>
    </table>
  </div>
</template>
<style lang="css" scoped>
@import "../style/map.css";
.marker-info {
  font-size: 14px;
  padding: 10px;
  position: fixed;
  right: 50px;
  bottom: 50px;
  width: 600px;
  height: 180px;
  overflow: auto;
  background: rgba(0, 0, 0, 0.5);
  color: #FFF;
}
table {
  width: 100%;
}
td {
  text-align: center;
}
a {
  color: red;
}
.flex {
  display: flex;
  align-items: center;
}
.add-btn {
  cursor: pointer;
  font-size: 13px;
  display: inline-block;
  padding: 4px 10px;
  border-radius: 4px;
  background-color: lightskyblue;
}
.add-btn:hover {
  background-color: lightseagreen;
}
</style>