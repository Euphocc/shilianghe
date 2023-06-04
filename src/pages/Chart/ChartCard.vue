<template>
  <div class="py-4 px-3 mt-2 bg-gray-100">
    <el-row>
      <el-col :span="2">
        <el-button type="primary" plain :icon="Promotion" @click="showFullScreen">全屏展示</el-button>
      </el-col>
      <el-col :span="22">
        <div class="flex justify-center">
          <div class="text-lg font-bold">{{boundName}}—{{siteName}}站点</div>
        </div>
      </el-col>
    </el-row>
  </div>

  <div>
    <el-row>
      <el-col :span="4">
<!--        这里应该添加一个图片-->
        <el-menu default-active="AlgaeDensity">
          <div class="flex justify-around items-center mt-3 pt-3 pb-1 bg-gray-100">
            <span>图表展示</span>
            <el-icon :size="20"><TrendCharts /></el-icon>
          </div>
          <el-scrollbar max-height="200px">
            <el-menu-item v-for="item in options" :index="item.value"
                          class="font-medium flex justify-start"
                          @click="handleChoose(item.value)">
              <el-icon :size="20"><DataLine /></el-icon>
              {{item.text}}
            </el-menu-item>
          </el-scrollbar>

          <div class="flex justify-around items-center py-2 bg-gray-100">
            <span>数据下载</span>
            <el-icon :size="20"><List /></el-icon>
          </div>

          <el-menu-item class="font-medium" index="2-1">
            <el-icon><DocumentCopy /></el-icon>
            JSON数据
          </el-menu-item>
          <el-menu-item class="font-medium" index="2-2">
            <el-icon><Coin /></el-icon>
            CSV数据
          </el-menu-item>
        </el-menu>

        <div class="flex justify-around items-center py-2 mt-2 bg-gray-100">
          <span>时间跨度</span>
          <el-icon :size="20"><Flag /></el-icon>
        </div>

<!--        <div class="flex justify-around items-center py-2 mt-2">-->
<!--          <el-check-tag v-for="(item, index) in timeOptions"-->
<!--                        :key="index" :checked="timeCurrent === item.value"-->
<!--                        style="margin-right: 8px"-->
<!--                        @click="handleTime(item)">{{item.text}}</el-check-tag>-->
<!--        </div>-->

        <div class="space-y-3 mt-2 mx-1 flex">
          <el-date-picker
              v-model="valueS"
              :type="timeCurrent"
              :placeholder="showDateStart"
              :default-value="dateStart"
              :format="dateFormat"
              :value-format="dateFormat">
          </el-date-picker>
        </div>
        <div class="space-y-3 mt-2 mx-1 flex">
          <el-date-picker
              v-model="valueE"
              :type="timeCurrent"
              :placeholder="showDateEnd"
              :format="dateFormat"
              :default-value="dateEnd"
              :value-format="dateFormat">
          </el-date-picker>
        </div>

        <div class="space-y-3 mt-2 mx-1 flex justify-center">
          <el-button id="searchButton" round  class="w-[180px]"
                     @click="searchData" :loading="loading">查询</el-button>
        </div>
      </el-col>

      <el-col :span="20">
        <el-card class="box-card mx-1" shadow="never">
          <!--        在这里展示图表  用ECharts-->
          <div id="chart" style="width: 100%; height: 80vh"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { Promotion, TrendCharts, List, DataLine, DocumentCopy, Coin, Flag } from '@element-plus/icons-vue'


import {reactive, onMounted, onBeforeUnmount, ref} from "vue";
import * as echarts from 'echarts';
import {
  assembleOption
} from "./utils/chartOptions.js";
import {injectOneOption, injectTwoOption} from "./utils/chartUtils.js";
import {useRoute} from "vue-router";
import {showMessage} from "../../plugins/utils.js";

const $route = useRoute()
let raid = "70149999"
let boundName = ref("石梁河水库")
let siteName = ref("左源")
const current = reactive(['AlgaeDensity'])

let myChart = null
//这是最终输入到图表中的选项
let result

//这是展示在timePicker里面的
let showDateStart = ref("2020-1-1")
let showDateEnd = ref("2020-1-1")
//定义在timePicker上面的时间起点、时间终点
let dateArray = showDateStart.value.split('-');
let dateStart = ref(new Date(Number.parseInt(dateArray[0]),
            Number.parseInt(dateArray[1]),Number.parseInt(dateArray[2])));

dateArray = showDateEnd.value.split('-');
let dateEnd = ref(new Date(Number.parseInt(dateArray[0]),
            Number.parseInt(dateArray[1]),Number.parseInt(dateArray[2])));

// console.log(dateEnd.value)

onMounted(async ()=>{
  //从路径里面拿出站点名称和站点编号
  let queryStr = window.location.hash.split("?")[1]
  queryStr = decodeURI(queryStr)
  siteName.value = queryStr.split("&")[0]
  // raid = queryStr.split("&")[1]

  document.documentElement.style.setProperty(
      "--el-menu-item-height",
      "45px"
  );
  let chartDom = document.getElementById('chart');
  myChart = echarts.init(chartDom);
  //需要画图，生成图表
  await drawChart(current, siteName.value)
})

onBeforeUnmount(()=>{
  if(myChart) myChart.dispose(myChart);
})

/**
 * 需要传入目前的选择，然后绘制出一个图表
 * @param type 查询类型: 降水、风速、气温、日照、湿度、气压
 * @param raid 站点编号，分为气象站和水文站
 * 最终setOption，得到一张图表
 * @param startValue 起始时间
 * @param endValue 终止时间
 */
async function drawChart(type, raid, startValue=0, endValue=0){
  // console.log(type)
  //显示数据正在加载
  myChart.showLoading()
  //这是只有一个图表的情况
  if(type.length === 1){
    let option = assembleOption(type.length)
    //必须等待该步执行完成
    result = await injectOneOption(option, type[0], raid)
    // console.log(result)
  }
  //这是进行数据对比的情况
  else{
    let option = assembleOption(type.length)
    result = await injectTwoOption(option, type, raid)
    // console.log(result)
  }
  //进行图表绘制，并且隐藏加载页面
  if(endValue !== 0) {
    result.dataZoom[0].startValue = startValue
    result.dataZoom[0].endValue = endValue
  }
  result.title.text = ""
  myChart.setOption(result)
  myChart.hideLoading()
  //开始监听数据变化，也就是datazoom所反映的边界值
  watchTimeChange()
}

//这里写时间控制
//timeCurrent对应查询标签下的年月日
let timeCurrent = ref("day");
//可供选择的年月日
const timeOptions = [
  {
    text:"日",
    value:"day",
    format: "YYYY-MM-DD"
  }
]


//输入的时间格式
let dateFormat = ref("YYYY-MM-DD")

// //年月日的点击事件,选定不同的时间维度
// const handleTime = async (type) => {
//   timeCurrent.value = type.value;
//   dateFormat.value = type.format;
//   //重新渲染图表
//   if (myChart) myChart.dispose(myChart);
//   let chartDom = document.getElementById('chart');
//   myChart = echarts.init(chartDom);
//   await drawChart(timeCurrent.value, current, raid)
// }


//loading是控制按钮，使其不要一直点击
const loading = ref(false)
//valueS valueE分别指需要截去的时间起点和时间终点
const valueS = ref(null)
const valueE = ref(null)
async function searchData() {
  //强制使按钮失焦
  document.getElementById("searchButton").blur();
  // 不能频繁点击查询(这里使其处于loading状态)
  loading.value = true;

  let start, end
  //如果只画一个图表的话，xAxis是一个一维数组
  if(current.length === 1){
    start = result.xAxis.data.indexOf(valueS.value)
    end = result.xAxis.data.indexOf(valueE.value)
  }
  //两个图表就是一个二维数组
  else{
    start = result.xAxis[0].data.indexOf(valueS.value)
    end = result.xAxis[0].data.indexOf(valueE.value)
  }

  //如果start所在的起点大于了end，说明起始时间大于了终止时间
  if(start > end){
    showMessage("起始时间不得大于结束时间!", "error")
    valueS.value = null
    valueE.value = null
  }else if(start ===-1 || end ===-1){
    showMessage("要查询的时间点不存在!", "error")
    valueS.value = null
    valueE.value = null
  }else{
    //重新渲染图表
    if (myChart) myChart.dispose(myChart);
    let chartDom = document.getElementById('chart');
    myChart = echarts.init(chartDom);
    await drawChart(timeCurrent.value, current, siteName.value, start, end)
  }
  // 图已经画好了，取消Loading状态
  loading.value = false
}

const options = [
  {
    text: '藻密度',
    value: "AlgaeDensity"
  },{
    text:'氨氮含量',
    value: 'AmmoniaNitrogen'
  },{
    text:'叶绿素',
    value:'Chlorophyll'
  },{
    text:'色度',
    value: 'Chroma'
  },{
    text:'COD',
    value: 'COD'
  },{
    text:'溶解氧',
    value: 'DissolvedOxygen'
  },{
    text:'流量',
    value: 'Flow'
  },{
    text:'高锰酸钾指数',
    value: 'KMnO4Index'
  },{
    text:'硝酸盐氮',
    value: 'NitrateNitrogen'
  },{
    text:'PH值',
    value: 'PH'
  },{
    text:'总氮',
    value: 'TotalNitrogen'
  },{
    text:'总磷',
    value: 'TotalPhosphorus'
  },{
    text:'水温',
    value: 'WaterTemperature'
  }]

let dataCompare = ref(false)
const handleCompare = ()=>{
  dataCompare.value = !dataCompare.value
  handleChoose()
}


const handleChoose = async (type = 'AlgaeDensity') => {
  //如果此时没有数据对比的话，那么就只展示一个图表
  if (!dataCompare.value) {
    current.splice(0, current.length);
    current.push(type);
  }
  //如果此时有数据对比的话，那么需要展示多个图表
  else {
    //如果没有才能添加，如果有的话就删除
    if (current.indexOf(type) === -1) {
      current.push(type);
    } else {
      current.splice(current.indexOf(type), 1)
    }
    //最多只能显示两个
    if (current.length > 2) {
      current.splice(0, current.length - 2);
    }
    //至少要显示一个，这里默认显示降水量(暂时是白天气温)
    if (current.length === 0) {
      current.push("AlgaeDensity")
    }
  }

  //这里开始调用Echarts更新数据
  //重新渲染图表
  if (myChart) myChart.dispose(myChart);
  let chartDom = document.getElementById('chart');
  myChart = echarts.init(chartDom);
  await drawChart(current, siteName.value)
}

import {router} from "../../router/index.js";
function showFullScreen(){
  //跳转到折线图的页面
  let routeData = router.resolve({
    name: "ChartView",
    query:{
      siteName: siteName.value,
      boundName: boundName.value
    }
  })
  window.open(routeData.href,'_blank')
}

//目前仅做权宜之计，就是把zoom监听拿过来，实时改变输入框的值
function watchTimeChange(){
  if(current.length === 1){  //说明这是单个数据的图表
    showDateStart.value = result.xAxis.data[result.dataZoom[0].startValue]
    showDateEnd.value = result.xAxis.data[result.dataZoom[0].endValue-1]
  }else{  //说明是多个图表
    showDateStart.value = result.xAxis[0].data[result.dataZoom[0].startValue]
    showDateEnd.value = result.xAxis[0].data[result.dataZoom[0].endValue-1]
  }
  // 监听dataZoom事件，只要变化我们就要去获取
  myChart.on('dataZoom', function () {
    //获取到 dataZoom的起始和结束值 这个值为y轴数据的 index 索引值
    let startValue = myChart.getOption().dataZoom[0].startValue;
    let endValue = myChart.getOption().dataZoom[0].endValue;
    if(current.length === 1){  //说明这是单个数据的图表
      showDateStart.value = result.xAxis.data[startValue]
      showDateEnd.value = result.xAxis.data[endValue]
    }else{  //说明是多个图表
      showDateStart.value = result.xAxis[0].data[startValue]
      showDateEnd.value = result.xAxis[0].data[endValue]
    }

    dateStart.value = new Date(showDateStart.value)
    dateEnd.value = new Date(showDateEnd.value)
  });
}

</script>

<style scoped>
:deep(--el-menu-base-level){
  padding: 0;
}
</style>
