<template>
  <div style="height: 50px;"></div>
  <el-row style="height: 80vh">
    <el-col :span="1"></el-col>
    <el-col :span="22">
      <el-card shadow="never" body-style="height:70vh; padding:10px">
        <template #header>
          <div class="flex justify-between">
            <div class=" flex justify-between text-sm space-x-2">
              <div class="text-lg">(时间单位)</div>
              <div>
                <el-check-tag v-for="(item, index) in timeOptions"
                              :key="index" :checked="timeCurrent === item.value"
                              style="margin-right: 8px">{{item.text}}</el-check-tag>
              </div>
            </div>

            <div>
              <el-check-tag style="margin-right: 8px"
                            :checked="dataCompare"
                            @click="handleCompare">数据对比</el-check-tag>
              <el-check-tag v-for="(item, index) in options"
                            :key="index" :checked="current.indexOf(item.value) !== -1"
                            style="margin-right: 8px"
                            @click="handleChoose(item.value)">{{item.text}}</el-check-tag>
            </div>
          </div>
        </template>
        <el-row>
          <el-col :xl="4" :xs="5" :sm="5" :md="5" :lg="5" :offset="0">
            <el-scrollbar height="65vh">
              <!--    在这里设置工具栏? 目前只有查询时间  -->
              <el-card class="box-card my-1" shadow="hover">
                <el-collapse>
                  <el-collapse-item title="根据日期查询" name="1" class="text-xl">
<!--                    <div class="space-y-3">-->
<!--                      <el-check-tag v-for="(item, index) in timeOptions"-->
<!--                                    :key="index" :checked="timeCurrent === item.value"-->
<!--                                    style="margin-right: 8px"-->
<!--                                    @click="handleTime(item)">{{item.text}}</el-check-tag>-->
<!--                    </div>-->
                    <div class="space-y-3 mt-2">
                      <el-date-picker
                          v-model="valueS"
                          :type="timeCurrent"
                          :placeholder="showDateStart"
                          :default-value="dateStart"
                          :format="dateFormat"
                          :value-format="dateFormat">
                      </el-date-picker>
                    </div>
                    <div class="space-y-3 mt-2">
                      <el-date-picker
                          v-model="valueE"
                          :type="timeCurrent"
                          :placeholder="showDateEnd"
                          :default-value="dateEnd"
                          :format="dateFormat"
                          :value-format="dateFormat">
                      </el-date-picker>
                    </div>
                    <div class="space-y-3 mt-2">
                      <el-button id="searchButton" round  class="w-[200px]"
                                 @click="searchData" :loading="loading">查询</el-button>
                    </div>

                  </el-collapse-item>
                </el-collapse>
              </el-card>

              <el-card class="box-card my-1" shadow="hover">
                <el-collapse>
                  <el-collapse-item title="图表信息面板" name="2" class="text-xl">
                    <el-table :data="statistic" stripe style="width: 100%">
                      <el-table-column prop="name" label="数据类型" />
                      <el-table-column prop="data" label="平均值" />
                    </el-table>
                  </el-collapse-item>
                </el-collapse>
              </el-card>

            </el-scrollbar>
          </el-col>

          <el-col :xl="20" :xs="19" :sm="19" :md="19" :lg="19" :offset="0">
            <el-card class="box-card mx-1" shadow="never">
              <!--        在这里展示图表  用ECharts-->
              <div id="chart" style="width: 100%; height: 62vh"></div>
            </el-card>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
    <el-col :span="1"></el-col>
  </el-row>
</template>

<script setup>
import {reactive, onMounted, onBeforeUnmount, ref} from "vue";
import * as echarts from 'echarts';
import {
  assembleOption
} from "./utils/chartOptions.js";
import {getStatistic, injectOneOption, injectTwoOption} from "./utils/chartUtils.js";
import {useRoute} from "vue-router";
import {showMessage} from "../../plugins/utils.js";
import {getSiteData} from "../../api/sitedata.js";

const $route = useRoute()
let boundName = $route.query.boundName
let siteName = $route.query.siteName
const current = reactive(['AlgaeDensity'])

let myChart = null
//这是最终输入到图表中的选项
let result

//这是展示在timePicker里面的
let showDateStart = ref("2020-1-1")
let showDateEnd = ref("2020-1-1")
//定义在timePicker上面的时间起点和时间终点
let dateStart = ref(new Date(showDateStart.value))
let dateEnd = ref(new Date(showDateEnd.value))

onMounted(async ()=>{
  let chartDom = document.getElementById('chart');
  myChart = echarts.init(chartDom);
  //需要画图，生成图表
  await drawChart(current, siteName)
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
  result.title.text = boundName + "-" + siteName + "站点"
  myChart.setOption(result)
  myChart.hideLoading()
  //开始监听数据变化
  onChange()
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
    await drawChart(timeCurrent.value, current, siteName, start, end)
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
    //至少要显示一个，这里默认显示藻密度
    if (current.length === 0) {
      current.push("AlgaeDensity")
    }
  }

  //这里开始调用Echarts更新数据
  //重新渲染图表
  if (myChart) myChart.dispose(myChart);
  let chartDom = document.getElementById('chart');
  myChart = echarts.init(chartDom);
  await drawChart(current, siteName)
}


//需要保存的统计信息，目前只有平均值
const statistic = reactive([])
function onChange(){
  if(current.length === 1){  //说明这是单个数据的图表
    showDateStart.value = result.xAxis.data[result.dataZoom[0].startValue]
    showDateEnd.value = result.xAxis.data[result.dataZoom[0].endValue-1]
  }else{  //说明是多个图表
    showDateStart.value = result.xAxis[0].data[result.dataZoom[0].startValue]
    showDateEnd.value = result.xAxis[0].data[result.dataZoom[0].endValue-1]
  }

  //如果没有监听到变化，也需要设置一个初识的面板
  getStatistic(statistic, result.series, 0, result.dataZoom[0].endValue-1)
  // 监听dataZoom事件，只要变化我们就要去获取
  myChart.on('dataZoom', function () {
    //获取到 dataZoom的起始和结束值 这个值为y轴数据的 index 索引值
    let startValue = myChart.getOption().dataZoom[0].startValue;
    let endValue = myChart.getOption().dataZoom[0].endValue;
    getStatistic(statistic, result.series, startValue, endValue)

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

</style>
