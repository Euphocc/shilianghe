<template>
  <div id="map"></div>
  <div class="div-a" ref="flexdrawer" @mouseenter="mouseEnter" @mouseleave="mouseLeave">
    <FlexDrawer @updateIs3DModelDisplay="updateIs3DModelDisplay"
      @updateIsProjectTopicsDisplay="updateIsProjectTopicsDisplay"
      @updateIsDistributedModelDisplay="updateIsDistributedModelDisplay">
    </FlexDrawer>
  </div>
  <VideoDisplay :src="videosrc" v-if="is3DModelDisplay"></VideoDisplay>
  <ProjectTopics v-if="isProjectTopicsDisplay" @updateIsProjectTopicsDisplay="updateIsProjectTopicsDisplay">
  </ProjectTopics>
  <DistributedModel v-if="isDistributedModelDisplay" @updateIsDistributedModelDisplay="updateIsDistributedModelDisplay">
  </DistributedModel>
</template>

<script setup>
import FlexDrawer from '../../components/FlexDrawer.vue'
//引入leaflet
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
//引入vue
import { ref, onMounted } from "vue";
//引入资源和配置
import shilianghe from "./resource/BOUND/石梁河水库范围.json"
import shuhe from "./resource/BOUND/沭河范围.json"
import yishuhe from "./resource/BOUND/沂沭河范围.json"
import shuiku from "./resource/BOUND/水库区间范围.json"
import yishuheshuixi from "./resource/BOUND/沂沭河水系.json"
import xinshuheshuixi from "./resource/BOUND/新沭河水系.json"
import river_information from "./resource/BOUND/river_information.json"
import China_bound from "./resource/BOUND/China_bound.json"
import { style_selected, style_shilianghe, style_shuhe, style_shuiku, style_yishuhe, style_clicked } from "./config/index.js";
import { getSiteInfo } from "../../api/sitedata.js";
import { useRouter } from "vue-router";


import VideoDisplay from '../Platform/VideoDisplay.vue'
import ProjectTopics from '../Platform/ProjectTopics.vue';
import DistributedModel from '../Platform/DistributedModel.vue';

// const cookie = useCookies()
// import {InnerMapState} from "../../store/index.js";
const innerMap = []
const router = useRouter()

onMounted(() => {
  initMap()
})

// iframe页面弹框(三个流域共享)
let siteIcon = L.icon({
  iconUrl: 'BASIN.png',
  iconSize: [32, 40], // size of the icon
  iconAnchor: [0, 30], // point of the icon which will correspond to marker's location
  popupAnchor: [12, -24] // point from which the popup should open relative to the iconAnchor
})

//标记点(用于地图缩放删除标记点)
let sites = []
let sitesName = []  //用于记录每一个站点的文字信息

/**
 * 这里用来处理点击流域之后的地图放大和站点绘制
 * @param name 流域的名称
 * @param targetCenter 数组形式，放大的XY坐标
 */
function whenClicked(name, targetCenter) {
  //需要取消鼠标放置之后的颜色填充
  //禁止进行地图操作，需要等待缩放完毕
  Map.scrollWheelZoom.disable();
  Map.dragging.disable();
  Map.doubleClickZoom.disable()
  //进行地图缩放
  Map.options.maxZoom = 14
  map.flyTo(targetCenter, 14)
  //调用坐标绘制函数
  setTimeout(function () { drawSite() }, 1500)
  setTimeout(function () {
    Map.scrollWheelZoom.enable()
    Map.dragging.enable();
    Map.doubleClickZoom.enable()
  }, 1600)
}
//用来设置mouseover与mouseout
let judge = true
let selected_bound = ""
function onEachFeature(feature, layer) {
  //绑定鼠标事件
  layer.on({
    click: (e) => {
      let layer = e.target
      let targetCenter = [layer.getCenter().lat, layer.getCenter().lng]
      layer.setStyle(style_clicked)
      judge = false
      selected_bound = feature.properties.name
      whenClicked(feature.properties.name, targetCenter)
    },
    mouseover: (e) => {
      if (judge) {
        let layer = e.target;
        layer.setStyle(style_selected)
        boundText[feature.properties.name].removeFrom(Map)
      }
    },
    mouseout: (e) => {
      if (judge) {
        let layer = e.target;
        layer.setStyle(style_shilianghe)
        boundText[feature.properties.name].addTo(Map)
      }
    }
  })
}

//这个站点信息包括了很多东西，其中有图层和流域名称
const boundLayer = {}
const boundText = {}
//由于受到了某种限制，就是必须在geoJson渲染完了才能拿到boundLayer
// 所以这里直接调用这个函数，依次添加文字标注
function setBoundText() {
  //先写死在这里，到时候逐个配置
  const location = {
    "沂沭河": [50, 30],
    "沭河": [-20, 30],
    "水库区间": [30, 50],
    "石梁河水库": [30, 15]
  }
  for (let key in boundLayer) {
    // marker的icon文字
    let font = L.divIcon({
      iconAnchor: location[key],
      html: "<div class='text-2xl text-green-400'>" + key + "</div>",
      className: 'my-div-icon',
      iconSize: [120, 15],
    })
    boundText[key] = L.marker(boundLayer[key].getBounds().getCenter(),
      { icon: font, interactive: false }).addTo(map);
  }

}


let Map = null
function initMap() {
  //声明影像底图图层
  let imageLayer = L.tileLayer(
    "http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=9bdfb69e6d74f93fe1fbc991b085eca5",
    {
      attribution: "image"
    })

  //声明地形晕渲图层
  let terrainLayer = L.tileLayer(
    "http://t0.tianditu.gov.cn/ter_w/wmts?SERVICE=WMTS&REQUEST=GetTile" +
    "&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}" +
    "&tk=9bdfb69e6d74f93fe1fbc991b085eca5",
    {
      attribution: "terrain"
    })


  let map = L.map("map", {
    minZoom: 8,
    maxZoom: 12,
    inertia: true,
    center: [35.42, 118.52], //中心点经纬度
    zoom: 6,
    zoomControl: false,
    attributionControl: false,
    crs: L.CRS.EPSG3857,
    // layers: [terrainLayer, imageLayer]
    layers: [imageLayer]
  });

  Map = map;　　　　//data上需要挂载
  window.map = map;

  let baseLayers = {
    // "地形晕渲地图" : terrainLayer,
    "卫星影像地图": imageLayer,
  }

  //新建图层控件并添加到地图
  let layerControl = L.control.layers(baseLayers).addTo(map);

  //石梁河水库范围
  boundLayer[shilianghe.features[0].properties.name] = L.geoJSON(shilianghe, {
    style: style_shilianghe,
    zIndexOffset: 1000,
    onEachFeature: onEachFeature
  }).addTo(Map)
  //沭河区间范围
  boundLayer[shuhe.features[0].properties.name] = L.geoJSON(shuhe, {
    style: style_shuhe,
    zIndexOffset: 10,
    interactive: false
  }).addTo(Map)
  //沂沭河区间范围
  boundLayer[yishuhe.features[0].properties.name] = L.geoJSON(yishuhe, {
    style: style_yishuhe,
    zIndexOffset: 1000,
    interactive: false
  }).addTo(Map)
  //水库区间范围
  boundLayer[shuiku.features[0].properties.name] = L.geoJSON(shuiku, {
    style: style_shuiku,
    zIndexOffset: 10,
    interactive: false
  }).addTo(Map)

  //流域绘制
  L.geoJSON(river_information, {
    weight: 1.5,
    opacity: 0.8
  }).addTo(Map)

  // 中国国界绘制
  L.geoJSON(China_bound, {
    weight: 3,
    opacity: 1,
    color: "#0d0904",
    fill: false
  }).addTo(Map)

  L.geoJSON(yishuheshuixi, {
    weight: 2,
    opacity: 1,
    color: "#4169E1",
    fill: false
  }).addTo(Map)

  L.geoJSON(xinshuheshuixi, {
    weight: 2,
    opacity: 1,
    color: "#4169E1",
    fill: false
  }).addTo(Map)

  //添加文字标注
  setBoundText();

  // let siteXAJ = L.marker([29.77, 118.08], {icon: siteIcon}).addTo(map);

  //在这里面为InnerMapState添加每个流域的信息
  for (let i in boundLayer) {
    //centerX centerY分别是流域的X Y中心点
    let one = {
      bound: i,
      centerX: boundLayer[i].getBounds().getCenter()["lat"],
      centerY: boundLayer[i].getBounds().getCenter()["lng"]
    }
    innerMap.push(one)
  }

  // //这里新安江流域是单独加的，因为没有这个流域的边界图
  // let XAJ = {
  //   bound: "新安江流域",
  //   centerX: 29.691232324,
  //   centerY: 118.112423112
  // }
  // innerMap.push(XAJ)
  // cookie.set("innerMapInfo", innerMap)

  Map.on('zoomend', (e) => {
    let zoom = e.target.getZoom()
    // 如果zoom大于等于12，就恢复原来的的坐标，并且删除得到的坐标点
    //这是针对其他的4个流域的，一旦缩放到小于7的水平，就恢复当前流域的标识
    if (zoom <= 11 && selected_bound !== "") {
      judge = true
      boundLayer[selected_bound].setStyle(style_shilianghe)
      for (let site in sites) {
        Map.removeLayer(sites[site])
      }
      Map.options.maxZoom = 12
    }

    //如果zoom大于等于12.5，就将文字标记删除，防止堆积在一起
    if (zoom <= 11) {
      // console.log("删除文字")
      for (let site in sitesName) {
        Map.removeLayer(sitesName[site])
      }
    }
  })
}



//绘制的坐标点
let siteIcons = L.icon({
  iconUrl: 'location.gif',
  iconSize: [50, 50], // 图像大小
  iconAnchor: [0, 0], // 图像出现在坐标点何处
  popupAnchor: [16, 8] // 弹出框出现坐标点何处
})

let siteMessage = null
//在地图上绘制站点
async function drawSite() {
  let siteData
  await getSite().then((data) => {
    siteData = data
  })
  //进行站点的标记
  for (let i = 0; i < siteData.length; i++) {
    // 创建poi点标记
    let site = L.marker([siteData[i].siteLoc[1], siteData[i].siteLoc[0]],
      { icon: siteIcons }).addTo(Map)
    let src = "/#/ChartCard?" + siteData[i].siteName
    // 需要指定id，vue才能找到对应渲染节点
    site.bindPopup(
      `<iframe style="border: 0; height: 700px; width: 1200px;" id="innerFrame"
        src="${src}"></iframe>`, {
      maxWidth: 1200,
      maxHeight: 700,
    })
    //这里需要存入sites里面，方便以后进行管理
    sites.push(site)
  }

  //为每一个站点设置文字标记
  for (let i = 0; i < siteData.length; i++) {
    //文字标记(使用的是divIcon)
    let myIcon = L.divIcon({
      html: siteData[i].siteName,
      className: 'my-div-icon',
      iconSize: 50,
      iconAnchor: [-15, -48]
    })
    //进行文字标记的绘制
    let siteName = L.marker([siteData[i].siteLoc[1], siteData[i].siteLoc[0]],
      { icon: myIcon, interactive: false }).addTo(Map)

    //方便统一管理
    sitesName.push(siteName)
  }
}

function getSiteMessage() {
  return siteMessage
}

/**
 * 拿到站点数据并且进行处理
 * @param bound
 */
async function getSite(bound = null) {
  let siteData = []
  await getSiteInfo().then((res) => {
    //首先得到站点的编号和名称
    for (let i = 0; i < res.data.length; i++) {
      let obj = {
        siteName: res.data[i]['stationName'],
        //分别是x y
        siteLoc: [
          Number.parseFloat(res.data[i].longitude),
          Number.parseFloat(res.data[i].latitude)
        ],
      }
      siteData.push(obj)
    }
  })
  return siteData
}

let flexdrawer = ref(null)


let mouseEnter = (e) => {
  flexdrawer.value.style.setProperty('left', '0px')
}
let mouseLeave = (e) => {
  flexdrawer.value.style.setProperty('left', '-270px')
}

let is3DModelDisplay = ref(false)
let videosrc = ref()
let updateIs3DModelDisplay = (videoPath) => {
  is3DModelDisplay.value = !is3DModelDisplay.value
  if (is3DModelDisplay.value === true) {
    videosrc.value = videoPath
  }
}

let isProjectTopicsDisplay = ref(false)
let updateIsProjectTopicsDisplay = () => {
  isProjectTopicsDisplay.value = !isProjectTopicsDisplay.value
}

let isDistributedModelDisplay = ref(false)
let updateIsDistributedModelDisplay = () => {
  isDistributedModelDisplay.value = !isDistributedModelDisplay.value
}

</script>

<style>
#map {
  width: 100%;
  height: 100vh;
}

.div-a {
  position: absolute;
  left: -270px;
  top: 50px;
  width: 280px;
  z-index: 9999;
  /*opacity: 0;*/
  transition: 1s;
}

.my-div-icon {
  font-size: 14px;
  /*background:red;*/
  /*width:5px;*/
  color: #f9f76d;
}

.video {
  position: absolute;
  left: 300px;
  top: 60px;
  height: 600px;
  z-index: 10000;
  border-bottom-right-radius: 1.5rem;
  border-bottom-left-radius: 1.5rem;
  border-top-right-radius: 1.5rem;
  border-top-left-radius: 1.5rem;
}

#pdfshowing {
  position: absolute;
  left: 300px;
  top: 60px;
  height: 500px;
  z-index: 10000;
  border-bottom-right-radius: 1.5rem;
  border-bottom-left-radius: 1.5rem;
  border-top-right-radius: 1.5rem;
  border-top-left-radius: 1.5rem;
  background-color: white;
}
</style>
