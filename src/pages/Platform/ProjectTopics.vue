<template>
  <div id="pdfshowing">
    <el-button type="danger" @click="updateIsProjectTopicsDisplay">点此关闭</el-button>
    <iframe src="../../../public/石梁河水库资料.pdf" class="iframe"></iframe>
  </div>
</template>

<script setup>
const emit = defineEmits(['updateIsProjectTopicsDisplay'])

let updateIsProjectTopicsDisplay = () => {
  emit('updateIsProjectTopicsDisplay')
}
</script>

<style scoped>
.iframe {
  width: 1000px;
  height: 500px;
  border-bottom-right-radius: 1.5rem;
  border-bottom-left-radius: 1.5rem;
  border-top-right-radius: 1.5rem;
  border-top-left-radius: 1.5rem;
  background-color: white;
}
</style>
