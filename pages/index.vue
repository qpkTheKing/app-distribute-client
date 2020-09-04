<template>
  <article class="tfs-article">
    <h1>应用列表</h1>
    <hr>
    <Row class="mt20" :gutter="16">
      <Col span="6" v-for="app in apps" v-bind:key="app.name">
        <Card style="width:100%; margin-bottom: 15px; cursor: pointer">
          <p slot="title" style="text-align: center; font-size: 14px;">
            {{ app.name }}
          </p>
          <div style="text-align: center;margin-bottom: 10px;">
            <img :src="app.icon" alt="" width="100" v-if="app.icon && app.icon !== ''"/>
            <template v-else>
              <Icon type="ios-appstore-outline" style="font-size: 106px;color: #515a6e;"/>
            </template>
          </div>
          <p style="text-align: center">
            <Button type="primary" size="large" @click.prevent="redirect(app.appId, 'apps')">我的分发应用</Button>
<!--            <Button type="warning" size="small" @click.prevent="redirect(app.appId, 'upload')">上传新版本</Button>-->
          </p>
        </Card>
      </Col>
      <Col span="4">
        <Card style="width:100%;background-color: #f8f8f9;cursor: pointer">
          <p slot="title" style="text-align: center; font-size: 14px;">
            添加应用
          </p>
          <div style="text-align: center;" @click.prevent="showAddAppModal">
            <Icon type="ios-add-circle-outline" style="font-size: 115px;color: #515a6e;"/>
          </div>
          <p style="text-align: center">
            <Button type="success" size="large" @click.prevent="showAddAppModal">添加应用</Button>
          </p>
        </Card>
      </Col>
    </Row>

    <Modal
      v-model="isModalShow"
      title="添加应用"
      :loading="loading"
      @on-ok="addApp">
      <p style="margin-bottom: 10px">应用名称: </p>
      <Input v-model="appName" placeholder="请输入应用名称..." style="width: 300px"></Input>
      <Alert type="warning" style="margin-top: 10px;">考虑时间原因，暂不支持上传图片.</Alert>
    </Modal>
  </article>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  async asyncData(ctx) {
    const { $axios, $auth } = ctx;
    const token = $auth.getToken('local').split(' ')[1];
    $axios.setToken(token, 'Bearer');

    const { data: apps } = await $axios.$get('app');
    const { data: me } = await $axios.$get(`me`)
    const { role } = me;

    return {
      apps,
      role
    }
  },
  mounted() {
    this.changeRole(this.role);
  },
  middleware: 'auth',
  computed: {
    ...mapGetters(['loggedInUser']),
  },
  data() {
    return {
      isModalShow: false,
      loading: false,
      appName: ''
    }
  },
  methods: {
    ...mapMutations({
      changeRoute: 'global/changeRoute',
      changeAppId: 'global/changeAppId',
      changeRole: 'global/setCurrentRole'
    }),
    async addApp() {
      await this.$axios.post('app', { name: this.appName });
      this.$Message.success('创建应用成功, 请上传应用完成剩余步骤。');
      await this.$router.push('/');
      this.isModalShow = false;
      this.$router.go(0)
    },
    showAddAppModal() {
      this.isModalShow = true;
    },
    redirect(appId, where) {
      this.changeRoute(where);
      this.changeAppId(appId);
      this.$router.push(`/${where}?appId=${appId}`);
    },
    deleteApp() {}
  },
  components: {}
}
</script>

<style scoped>

</style>
