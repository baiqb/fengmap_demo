// 使用npm引入的方式
// import fengmap from "fengmap/build/fengmap.map.min"; //核心包
// import "fengmap/build/fengmap.analyser.min"; //分析器
// import "fengmap/build/fengmap.plugin.min"; //插件包
// import "fengmap/build/fengmap.effect.min"; //特效包

const fengmap = window.fengmap
const appName = '测试应用' // 蜂鸟账号中的应用名称
const appKey = 'a881cd5a891bfa29cc9f103fb91d5151' // 蜂鸟账号中的key
const is3 = true; // true为3.0之后版本的模型数据，false为2.7.2及以前制作的模型。
export const initOffLineElevatorMap = (elementId, mapID = '10347', themeID = '2001', {
  defaultZoom = 19.6,
  defaultTiltAngle = 45,
  minZoom = 18,
  maxZoom = 21,
  minTiltAngle = 10,
  maxTiltAngle = 90
} = {}) => {
  console.log(elementId, {
    defaultTiltAngle,
    defaultZoom,
    minZoom,
    maxZoom,
    minTiltAngle,
    maxTiltAngle
  })
  const mapInstance = new fengmap.FMMap(Object.assign({}, {
    container: document.getElementById(elementId),
    appName: appName,
    key: appKey,
    tile: false,			            //是否分层加载,默认值:true
    mapID: mapID,
    themeID: themeID,
    mapURL: 'fengmap/data/',
    themeURL: 'fengmap/data/theme/',
    highlightColor: '#FFF',
    tiltAngle: defaultTiltAngle,	                //地图默认的倾斜角度
    maxTiltAngle: maxTiltAngle,		        //地图默认最大倾斜角度
    minTiltAngle: minTiltAngle,		        //地图默认最小倾斜角度
    mapZoom: defaultZoom,
    zoomRange: [minZoom, maxZoom],	            //比例尺缩放级别(可调范围为1-29),默认值:[16,23]
  }))
  return mapInstance
}

export const FMType = fengmap.FMType
