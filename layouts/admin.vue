<template>
  <div class="ivu-layout tfs-layout">
    <Navbar :role="role" />
    <div class="tfs-layout-header">
      <div class="tfs-layout-logo">TFS APP Distribute Platform</div>
      <div class="tfs-layout-breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem to="/">
            <Icon type="ios-home-outline" style="font-size: 24px;"></Icon> Home
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
    </div>
    <Layout class="tfs-inner-layout">
      <Content :style="{padding: '24px 0', minHeight: '280px', background: '#fff'}">
        <Layout>
          <Sider hide-trigger :style="{background: '#fff'}">
            <Menu theme="light" active-name="user" width="auto" style="height: 100%">
              <MenuGroup title="用户">
                <MenuItem name="user">
                  <Icon type="ios-contacts" />
                  用户管理
                </MenuItem>
              </MenuGroup>
              <MenuGroup title="品牌">
                <MenuItem name="brand">
                  <Icon type="md-apps" />
                  品牌管理
                </MenuItem>
              </MenuGroup>
              <MenuGroup title="其他">
                <MenuItem name="files">
                  <Icon type="ios-construct" />
                  文件管理
                </MenuItem>
              </MenuGroup>
            </Menu>
          </Sider>
          <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
            <Nuxt/>
          </Content>
        </Layout>
      </Content>
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
  async mounted() {
    const { data: me } = await this.$axios.$get(`me`);
    const { role } = me;
    this.role = role;
  },
  data() {
    return {
      role: ''
    };
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

<style scoped>
.layout{
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.layout-logo{
  width: 100px;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  float: left;
  position: relative;
  top: 15px;
  left: 20px;
}
.layout-nav{
  width: 420px;
  margin: 0 auto;
  margin-right: 20px;
}
.layout-footer-center{
  text-align: center;
}
.ivu-layout-content {
  padding: 0 24px;
}
</style>
