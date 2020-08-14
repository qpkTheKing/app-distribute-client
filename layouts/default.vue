<template>
  <div class="ivu-layout tfs-layout">
    <Navbar/>
    <div class="tfs-layout-header">
      <div class="tfs-layout-logo">TFS APP Distribute Platform</div>
    </div>
    <div class="tfs-inner-layout">
      <Nuxt/>
    </div>
  </div>
</template>

<script>
import Navbar from '~/components/Navbar'

export default {
  components: {
    Navbar
  }
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

.tfs-inner-layout {
  width: 90%;
  margin: 30px auto 20px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
}

.tfs-layout-logo {
  width: 270px;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  float: left;
  position: relative;
  top: 15px;
  left: 20px;
  color: #fff;
  line-height: 30px;
  padding: 0 17px;
  font-size: 18px;
}

.tfs-layout-header {
  height: 60px;
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
}

.tfs-layout-copy {
  position: absolute;
  bottom: 0;
  height: 40px;
  width: 99%;
  text-align: center;
  padding: 10px 0 20px;
  color: #9ea7b4;
  background: aliceblue;
  line-height: 24px;
}

.tfs-narrow-form {
  width: 500px;
  margin: 20px auto 0;
}

.tfs-layout-ceiling {
  background: #464c5b;
  padding: 10px 0;
  overflow: hidden;
}

.tfs-layout-ceiling-main {
  float: right;
  margin-right: 15px;
}

.tfs-layout-ceiling-main a {
  color: #9ba7b5;
}

.tfs-article {
  position: relative;
  padding: 20px 25px;
}

.tfs-article h1 {
  font-size: 26px;
  font-weight: 400;
}

.mt20 {
  margin-top: 20px;
}

</style>
