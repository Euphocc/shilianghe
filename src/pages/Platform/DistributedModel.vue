<template>
    <div id="pdfshowing">
        <el-button type="danger" @click="updateIsDistributedModelDisplay">点此关闭</el-button>
        <iframe src="../../../public/分布式流域面源模型与氮污染关键来源解析.pdf" class="iframe"></iframe>
    </div>
</template>
<script setup>
const emit = defineEmits(['updateIsDistributedModelDisplay'])

let updateIsDistributedModelDisplay = () => {
    emit('updateIsDistributedModelDisplay')
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
