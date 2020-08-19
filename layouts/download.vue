<template>
  <div class="ivu-layout tfs-layout">
    <div class="tfs-download-inner-layout">
      <Nuxt/>
    </div>
  </div>
</template>

<script>
export default {
  components: {}
}
</script>

<style>
html {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1", Arial, sans-serif;;
  font-size: 12px;
  line-height: 1.5;
  color: #657180;
  word-spacing: 1px;
  background: #fff;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.tfs-layout {
  padding: 0;
}

.tfs-download-inner-layout {
  width: 97%;
  margin: 30px auto 20px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
}

</style>
