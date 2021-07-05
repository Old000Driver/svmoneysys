<template>
  <div>
    <div>当前页面不存在，请检查网址是否正确</div>
    <div>
      <router-link class="back" to="/">返回首页</router-link>
    </div>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'NotFound'
  };
</script>

<style lang="scss" scoped>
.back{
  color: #47b7f5;
  text-decoration:underline dotted;
}
</style>
