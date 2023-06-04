<template>
  <el-scrollbar max-height="600px" class="bar">
    <div class="flex justify-center" style="background-color: #79bbff;">
      <div class="flex justify-center">
        <div class="my-5 text-xl font-bold">石梁河水文水资源预测云平台</div>
      </div>
    </div>
    <el-menu @select="handleSelectMenu">
      <el-menu-item index="check">
        <el-icon>
          <Link />
        </el-icon>
        <span>监测数据</span>
      </el-menu-item>

      <el-menu-item index="IoTCloudPlatform">
        <el-icon>
          <Link />
        </el-icon>
        <span>物联网云平台</span>
      </el-menu-item>

      <el-menu-item index="ProjectTopics">
        <el-icon>
          <icon-menu />
        </el-icon>
        <span>项目课题</span>
      </el-menu-item>

      <el-sub-menu index="MultiSourceData">
        <template #title>
          <el-icon>
            <document />
          </el-icon>
          <span>多源数据</span>
        </template>
        <el-menu-item index="MultiSourceData-1">监测数据</el-menu-item>
        <el-menu-item index="MultiSourceData-2">自动监测</el-menu-item>
        <el-menu-item index="MultiSourceData-3">人工监测</el-menu-item>
        <el-menu-item index="MultiSourceData-4">遥感反演</el-menu-item>
        <el-menu-item index="MultiSourceData-5">其他数据</el-menu-item>
      </el-sub-menu>

      <el-menu-item index="TheoreticalApproach">
        <el-icon>
          <Monitor />
        </el-icon>
        <span>理论方法</span>
      </el-menu-item>

      <el-sub-menu index="ModelTechnology">
        <template #title>
          <el-icon>
            <Memo />
          </el-icon>
          <span>模型技术</span>
        </template>

        <el-menu-item index="DistributedModel">分布式流域面源模型</el-menu-item>

        <el-sub-menu index="3DModelDisplay">
          <template #title>
            <span>三维水动力生态模型</span>
          </template>
          <el-menu-item index="3DModel1"> 模型结果1({{ is3DModelDisplay === false ? '点击展示' : '点击关闭' }}视频)
          </el-menu-item>
          <el-menu-item index="3DModel2"> 模型结果2({{ is3DModelDisplay === false ? '点击展示' : '点击关闭' }}视频)
          </el-menu-item>
        </el-sub-menu>

        <el-menu-item index="ModelTechnology-3">藻类机器学习预报模型</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="IntegrationPlatform">
        <template #title>
          <el-icon>
            <setting />
          </el-icon>
          <span>集成平台</span>
        </template>
        <el-menu-item index="IntegrationPlatform-1">显示等值线</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </el-scrollbar>
</template>

<script setup>
import {
  Document,
  Menu as IconMenu,
  Monitor,
  Memo,
  Setting,
  Link,
} from '@element-plus/icons-vue'
import { useRouter } from "vue-router"
import { router } from "../router/index.js";
import { ref } from 'vue'
const options = useRouter().options.routes.slice(5, 12)
const emits = defineEmits(['updateIs3DModelDisplay', 'updateIsProjectTopicsDisplay', 'updateIsDistributedModelDisplay'])
let is3DModelDisplay = ref(false)

function handleSelectMenu(item) {
  if (item === "check") {
    window.open("http://www.lcyun.ltd/")
  } else if (item === '3DModel1') {
    is3DModelDisplay.value = !is3DModelDisplay.value
    emits('updateIs3DModelDisplay', '../../public/resultVideo1.mp4')
  } else if (item === '3DModel2') {
    is3DModelDisplay.value = !is3DModelDisplay.value
    emits('updateIs3DModelDisplay', '../../public/resultVideo2.mp4')
  } else if (item === 'IoTCloudPlatform') {
    window.open('http://iot.lwbsq.com/')
  } else if (item === 'DistributedModel') {
    emits('updateIsDistributedModelDisplay')
  } else if (item === 'ProjectTopics') {
    emits('updateIsProjectTopicsDisplay')
  } else {
    let routeData = router.resolve({
      name: item,
    })
    window.open(routeData.href, '_blank')
  }
}



</script>

<style scoped>
.bar {
  border-bottom-right-radius: 1.5rem;
  border-bottom-left-radius: 1.5rem;
  border-top-right-radius: 1.5rem;
  border-top-left-radius: 1.5rem;
}
</style>
