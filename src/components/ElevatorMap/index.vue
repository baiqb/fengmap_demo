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
  m_type: 'paishui',
  m_name: '智慧给排水',
})
// mapId
const mapId = 'project-fengmap__elevator'
// 地图实例
let mapInstance = null
let lastHideBuilding = null

const curIconType = ref('paishui')
const iconList = reactive([
  { type: 'paishui', label: '智慧给排水' },
  { type: 'xiaofang', label: '智慧消防' },
  { type: 'shuixiang', label: '消防水箱' },
  { type: 'shipin', label: '智慧视频' },
  { type: 'renxing', label: '智慧人行' },
  { type: 'chexing', label: '智慧车行' },
  { type: 'dianti', label: '智慧电梯' },
])

let pointerMarker = null

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

const addMarker = (map, x, y, z, iconType) => {
  iconType = iconType || curIconType.value
  const marker = new fengmap.FMImageMarker({
    url: `images/icon-${iconType}.png`,
    x,
    y,
    height: z
  })
  const { m_name, m_type } = curCoords
  marker.m_name = m_name
  marker.m_desc = m_name
  marker.m_type = m_type
  const floor = map.getFloor(map.getLevel())
  marker.addTo(floor)
  return marker
}
const handleAddMarker = () => {
  const { x, y, z} = curCoords
  const marker = addMarker(mapInstance, x, y, z)
  markerList.push(marker)
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
  // 监听点击事件
  mapInstance.on('click', function (event) {
    const { coords } = event
    let { x, y, z } = coords
    x = +parseFloat(x).toFixed(2)
    y = +parseFloat(y).toFixed(2)
    z = +parseFloat(z - 50).toFixed(2)
    curCoords.x = x
    curCoords.y = y
    curCoords.z = z
    handleAddMarker()
    // if (pointerMarker && pointerMarker.remove) {
    //   pointerMarker.remove()
    // }
    // pointerMarker = addMarker(mapInstance, x, y, z)
  })
}
onMounted(initFengMap)
onBeforeUnmount(() => {
  if (mapInstance && mapInstance.dispose) {
    mapInstance.dispose()
    mapInstance = null
  }
})
const handleIconTypeChange = (icon) => {
  curCoords.m_name = icon.label
  curCoords.m_type = icon.type
  curIconType.value = icon.type
}
</script>
<template>
  <div id="project-fengmap__elevator" class="map-container"></div>
  <div class="marker-info">
    <div class="radio-group">
      <div class="radio-item" v-for="(icon, index) in iconList" :key="index">
        <input type="radio" :id="icon.type" @click="handleIconTypeChange(icon)" :value="icon.type" :name="icon.type" :checked="curIconType == icon.type">
        <div class="radio-label" @click="handleIconTypeChange(icon)">
          {{icon.label}}
        </div>
        <div class="radio-img" @click="handleIconTypeChange(icon)">
          <img :src="`images/icon-${icon.type}.png`">
        </div>
      </div>
    </div>
    <!-- <div class="flex">
      <div class="label">点位ID:</div>
      <input type="text" v-model="curCoords.m_type">
      <div class="label">点位名称:</div>
      <input type="text" v-model="curCoords.m_name">
      <div class="add-btn" @click="handleAddMarker(curCoords)">添加标记</div>
    </div> -->
    <table>
      <tr>
        <th>type</th>
        <th>类型</th>
        <th>x</th>
        <th>x</th>
        <th>y</th>
        <th>z(高度)</th>
      </tr>
      <tr v-for="(item, index) in markerList" :key="index">
        <td>{{item.m_type}}</td>
        <td>{{item.m_name}}</td>
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
.radio-group {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.radio-group img {
  width: 32px;
  height: 32px;
}
.radio-item {
  display: flex;
  align-items: center;
  width: 140px;
  padding: 5px 0;
}
.radio-item .radio-label{
  line-height: 32px;
}
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