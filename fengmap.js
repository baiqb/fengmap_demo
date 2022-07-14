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
    mapURL: 'fengmap/elevator/',
    themeURL: 'fengmap/elevator/theme/',
    highlightColor: '#999',
    highlightPicker: ['click', 'hover'],
    tiltAngle: defaultTiltAngle,	                //地图默认的倾斜角度
    maxTiltAngle: maxTiltAngle,		        //地图默认最大倾斜角度
    minTiltAngle: minTiltAngle,		        //地图默认最小倾斜角度
    mapZoom: defaultZoom,
    zoomRange: [minZoom, maxZoom],	            //比例尺缩放级别(可调范围为1-29),默认值:[16,23]
  }))
  return mapInstance
}
// 初始化离线地图
export const initOffLineMap = (elementId, mapID = '10347', themeID = '2001', {
  defaultZoom = 19.7,
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
    // mapURL: 'fengmap/data/',
    // themeURL: 'fengmap/data/theme/',
    highlightColor: 'rgba(127,127,127,0.3)',
    highlightPicker: ['hover', 'click'],
    mapURL: 'fengmap/elevator/',
    themeURL: 'fengmap/elevator/theme/',
    tiltAngle: defaultTiltAngle,	                //地图默认的倾斜角度
    maxTiltAngle: maxTiltAngle,		        //地图默认最大倾斜角度
    minTiltAngle: minTiltAngle,		        //地图默认最小倾斜角度
    mapZoom: defaultZoom,
    zoomRange: [minZoom, maxZoom],	            //比例尺缩放级别(可调范围为1-29),默认值:[16,23]
  }))
  return mapInstance
}

// 初始化在线楼层地图
export const initOnLineFloorMap = (elementId, mapID, themeID, {
  defaultZoom = 21,
  defaultTiltAngle = 60,
  minZoom = 18,
  maxZoom = 23,
  defaultLevel = 3, // 默认楼层
  minTiltAngle = 10,
  maxTiltAngle = 90
} = {}) => {
  const mapInstance = new fengmap.FMMap(Object.assign({}, {
    container: document.getElementById(elementId),
    appName: appName,
    key: appKey,
    tile: false,			            //是否分层加载,默认值:true
    mapID: mapID,
    themeID: themeID,
    rotation: 30,
    tiltAngle: defaultTiltAngle,	                //地图默认的倾斜角度
    maxTiltAngle: maxTiltAngle,		        //地图默认最大倾斜角度
    minTiltAngle: minTiltAngle,		        //地图默认最小倾斜角度
    mapZoom: defaultZoom,
    level: defaultLevel,
    zoomRange: [minZoom, maxZoom],	            //比例尺缩放级别(可调范围为1-29),默认值:[16,23]
  }))
  return mapInstance
}

export const initFloorControl = (map) => {
  map.on('loaded', function () {
    const scrollFloorCtlOpt = {
      position: fengmap.FMControlPosition.RIGHT_TOP,
      floorButtonCount: 16,
      offset: {
        x: -450,
        y: 153
      },
      viewModeControl: true,
      floorModeControl: true,
      needAllLayerBtn: true
    };
    let scrollFloorControl = new fengmap.FMToolbar(scrollFloorCtlOpt);
    scrollFloorControl.addTo(map)
  });
}

export const FMType = fengmap.FMType
