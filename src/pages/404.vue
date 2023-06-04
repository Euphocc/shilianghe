<template>
  <div>
    <el-result
        icon="error"
        title="404"
        sub-title="你找的页面不存在~"
    >
      <template #extra>
        <el-button type="primary" @click= "$router.push('/')" >回到首页</el-button>
      </template>
    </el-result>
  </div>
</template>
