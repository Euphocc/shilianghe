<template>
  <div class="max-w-screen">
    <div class="bg-gray-200 rounded-2xl text-base font-bold text-center mb-2">
      水文站点信息
    </div>
    <div class="bg-gray-100 rounded-2xl py-1.5 px-4">
      <div class="text-sm text-left my-1">
        <span>站点名称: </span>
        <span>{{ siteName }}</span>
      </div>
      <div class="text-sm text-left mb-2">
        <span>位置坐标: </span>
        <span>{{siteLocX}}, {{siteLocY}}</span>
      </div>
      <div class="flex justify-around">
        <button class="rounded-1xl bg-blue-300 text-sm p-1.5" @click="chartInfo">
          查看详情
        </button>
        <button class="rounded-1xl bg-blue-300 text-sm p-1.5" @click="downloadInfo">
          数据下载
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted} from "vue";
import {router} from "../router/index.js";
//父组件传入的数据
//包含站点名称 位置的纬度 位置的经度 站点编号
const props = defineProps(['siteName','siteLocX','siteLocY','siteID','boundName','router'])



//跳转到折线图的页面
function chartInfo(){

  let routeData = props.router.resolve({
    name: "ChartView",
    query:{
      siteName: props.siteName,
      siteID: props.siteID,
      boundName: props.boundName
    }
  })
  window.open(routeData.href,'_blank')

}

function downloadInfo(){
  console.log("下载数据")
}
</script>

<style scoped>

</style>
