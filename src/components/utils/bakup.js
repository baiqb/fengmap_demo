const fengmap = window.fengmap
let fengmapInstance = null

var showBloom = false; // true为加载特效，false为普通模式即不加载特效
var is3 = true; // true为3.0之后版本的模型数据，false为2.7.2及以前制作的模型。

var beginTime = new Date().valueOf();
var map;
var fmapID = '10347'; // 普通'1321274646113083394' 模型'1385059569988620289' 模型'408903'
var navi;
var searchAnalyser;
var naviAnalyser;
var groupControl;
var clickCount = 0;
var lastCoord = null;
var naviLines = [];
var radioVal;
//控制文本标注层显示/隐藏
var labelVisible = true;
//控制POI标注层显示/隐藏
var poiVisible = true;
//控制extent显示/隐藏
var extentVisible = true;
//控制store显示/隐藏
var storeVisible = true;
var labelAllVisible = true;
var poiAllVisible = true;
var extentAllVisible = true;
var storeAllVisible = true;
var isClick = false;
var isBestRoute = true;
var isHideExternalModel = false;
var hideExternalModels = [];
var labelLanguage = fengmap.FMLabelField.NAME;
var isNaviLoaded = false;

// var map;
var bloom;
var gui;
var folder;
//gui控件初始化参数
var effectController = {
  exposure: 1, //曝光强度
  bloomStrength: 0.1, //发光强度：值越大越亮
  bloomThreshold: 0.35, //发光阈值：建议取值范围：0-1，值越小越亮，1为不发光
  bloomRadius: 0.05, //发光半径：建议取值范围：0-1，值越大，发光范围越大
}
const initFengMap = () => {
  let shadingMode = {};
  if (!is3) shadingMode.shadingMode = fengmap.FMShadingMode.CLASSIC; //兼容2.7.2中glb模型的光照效果，3.0.0版本后新制作的模型请注掉该设置

  fengmapInstance = new fengmap.FMMap(Object.assign({}, {
    //渲染dom
    container: document.getElementById('project-feng-map'),
    appName: '测试应用',
    // 57c7f309aca507497d028a9c00207cf8
    key: 'a881cd5a891bfa29cc9f103fb91d5151',

    mapID: '1545250644203249666',
    themeID: '1545308642963337218',
    // mapID: 10347,
    // mapURL: 'fengmap/data/',
    // themeID: '2001',
    // themeURL: 'fengmap/data/theme/',

    tile: false,			            //是否分层加载,默认值:true

    // nonFocusAlphaMode,               //非聚焦楼层的透明模式,默认值:true
    // nonFocusAlpha: 0.8,			    //非聚焦图层启用透明设置

    tiltAngle: 45,	                //地图默认的倾斜角度
    maxTiltAngle: 90,		        //地图默认最大倾斜角度
    minTiltAngle: 10,		        //地图默认最小倾斜角度
    // floorSpace: 50,                  //默认的层间距 默认值:50
    mapZoom: 21,
    zoomRange: [18, 21],	            //比例尺缩放级别(可调范围为1-29),默认值:[16,23]
    level: 3,
    // visibleLevels: [2],              //地图默认显示楼层可多层显示,默认值:[1]
    // level: 2,                        //初始聚焦楼层

    // highlightMode: fengmap.FMHighlightMode.NONE,				//高亮模式 fengmap.FMHighlightMode
    // viewMode: fengmap.FMViewMode.MODE_2D,				    //初始二维
    // logarithmicDepthBuffer: false,                           //是否开启对数深度缓存,用以解决较大场景下的闪面问题,但可能导致性能下降,默认值:false
  }, shadingMode));
  fengmapInstance.on('loaded', function () {
    var scrollFloorCtlOpt = {
      position: fengmap.FMControlPosition.RIGHT_TOP,
      floorButtonCount: 5,
      offset: {
        x: -450,
        y: 120
      },
      viewModeControl: true,
      floorModeControl: true,
      needAllLayerBtn: true
    };
    let scrollFloorControl = new fengmap.FMToolbar(scrollFloorCtlOpt);
    scrollFloorControl.addTo(fengmapInstance)
  });
}