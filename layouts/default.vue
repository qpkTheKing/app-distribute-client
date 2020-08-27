<template>
  <div class="ivu-layout tfs-layout">
    <Navbar/>
    <div class="tfs-layout-header">
      <div class="tfs-layout-logo">TFS APP Distribute Platform</div>
      <div class="tfs-layout-breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem to="/">
            <Icon type="ios-home-outline" style="font-size: 24px;"></Icon> Home
          </BreadcrumbItem>
          <BreadcrumbItem v-if="current === 'apps'">
            <Icon type="ios-apps-outline" style="font-size: 24px;" /> 我的分发应用
          </BreadcrumbItem>
          <BreadcrumbItem :to="`/apps?appId=${currentAppId}`" v-if="current !== 'apps' && current !== ''">
            <Icon type="ios-apps-outline" style="font-size: 24px;" /> 我的分发应用
          </BreadcrumbItem>
          <BreadcrumbItem v-if="current === 'upload'">
            <Icon type="md-add" style="font-size: 24px;" /> 新增或编辑
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
    </div>
    <div class="tfs-inner-layout">
      <Nuxt/>
    </div>
  </div>
</template>

<script>
import Navbar from '~/components/NavBar'
import { mapGetters, mapMutations } from 'vuex'

export default {
  components: {
    Navbar
  },
  watch:{
    $route (to, from){
      const { name, query } = to;
      switch (name) {
        case 'apps':
          this.changeAppId(query.appId);
          this.changeRoute(name)
          break;
        case 'upload':
          this.changeFileId(query.fileId);
          this.changeRoute(name);
          break;
        case 'register':
        case 'login':
          // do nothing.
          break;
        default:
          this.changeRoute('');
      }
    }
  },
  methods: {
    ...mapMutations({
      changeRoute: 'global/changeRoute',
      changeAppId: 'global/changeAppId',
      changeFileId: 'global/changeFileId'
    })
  },
  computed: {
    ...mapGetters({
      current: 'global/currentRoute',
      currentAppId: 'global/currentAppId',
      currentFileId: 'global/currentFileId'
    }),
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
  width: 1024px;
  margin: 20px auto;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
}

.tfs-layout-logo {
  width: 270px;
  height: 30px;
  background: #2db7f5;
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

.tfs-layout-breadcrumb {
  float: right;
  position: relative;
  top: 15px;
  right: 20px;
  color: #fff;
  line-height: 30px;
}

</style>
