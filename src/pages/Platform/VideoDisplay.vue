<template>
    <video src='videoPath' controls class="video"></video>
</template>
<script setup>
import { ref } from "vue"
defineProps(['videoPath'])

let videoPath = ref()


</script>
<style scoped></style>