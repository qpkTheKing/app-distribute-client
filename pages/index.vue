<template>
  <article class="tfs-article">
    <h1>应用列表</h1>
    <hr>
    <Row class="mt20">
      <Col span="6" v-for="app in apps" v-bind:key="app.name">
        <Card style="width:150px">
          <p slot="title" style="text-align: center; font-size: 14px;">
            {{ app.name }}
          </p>
          <p style="text-align: center">
            <Button type="primary" @click.prevent="redirectToAppDetails(app.appId)">管理应用</Button>
          </p>
        </Card>
      </Col>
      <Col span="6">
        <Card style="width:150px">
          <p slot="title" style="text-align: center; font-size: 24px;">
            <Icon type="ios-home"></Icon>
          </p>
          <p style="text-align: center">
            <Button type="success" @click.prevent="showAddAppModal">添加应用</Button>
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
import { mapGetters } from 'vuex';

export default {
  async asyncData(ctx) {
    const { $axios, $auth } = ctx;
    const token = $auth.getToken('local').split(' ')[1];

    $axios.setToken(token, 'Bearer');
    const { data } = await $axios.$get('app');
    return {
      apps: data
    }
  },
  middleware: 'auth',
  computed: {
    ...mapGetters(['loggedInUser'])
  },
  data() {
    return {
      isModalShow: false,
      loading: false,
      appName: ''
    }
  },
  methods: {
    async addApp() {
      await this.$axios.post('app', { name: this.appName });
      this.$Message.success('创建应用成功, 请上传应用完成剩余步骤。');
      await this.$router.push('/');
      this.isModalShow = false;
    },
    showAddAppModal() {
      this.isModalShow = true;
    },
    redirectToAppDetails(appId) {
      this.$router.push(`/details?appId=${appId}`);
    },
    deleteApp() {}
  },
  components: {}
}
</script>

<style scoped>

</style>
