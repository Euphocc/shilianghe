<template>
  <div>
    <el-result
        icon="warning"
        title="不确定性"
        sub-title="该页面还在建设中...."
    >
      <template #extra>
        <el-button type="primary" @click= "$router.push('/')" >回到首页</el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup>

</script>

<style scoped>

</style>
