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
          <BreadcrumbItem v-if="current === 'quota'">
            <Icon type="ios-apps-outline" style="font-size: 24px;" /> 管理
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
    </div>
    <Layout class="tfs-inner-layout">
      <Nuxt/>
    </Layout>
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
        case 'quota':
          this.changeAppId(query.appId);
          this.changeRoute(name)
          break;
        default:
          this.changeRoute('');
      }
    }
  },
  methods: {
    ...mapMutations({
      changeRoute: 'global/changeRoute'
    })
  },
  computed: {
    ...mapGetters({
      current: 'global/currentRoute'
    }),
  }
}

</script>

<style>

</style>
