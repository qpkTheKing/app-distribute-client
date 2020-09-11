<template>
  <article class="tfs-article">
    <h1>{{ $t('APPS') }}</h1>
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
            <Button type="primary" size="large" @click.prevent="redirect(app.appId, 'apps')">{{ $t('MY_DISTRIBUTION_APPS') }}</Button>
<!--            <Button type="warning" size="small" @click.prevent="redirect(app.appId, 'upload')">上传新版本</Button>-->
          </p>
        </Card>
      </Col>
      <Col span="5">
        <Card style="width:100%;background-color: #f8f8f9;cursor: pointer">
          <p slot="title" style="text-align: center; font-size: 14px;">
            {{ $t('APP_ADD') }}
          </p>
          <div style="text-align: center;" @click.prevent="showAddAppModal">
            <Icon type="ios-add-circle-outline" style="font-size: 115px;color: #515a6e;"/>
          </div>
          <p style="text-align: center">
            <Button type="success" size="large" @click.prevent="showAddAppModal">{{ $t('APP_ADD') }}</Button>
          </p>
        </Card>
      </Col>
    </Row>

    <Modal
      v-model="isModalShow"
      :title="$t('APP_ADD')"
      :loading="loading"
      :ok-text="$t('SUBMIT')"
      :cancel-text="$t('CANCEL')"
      @on-ok="addApp">
      <p style="margin-bottom: 10px">{{ $t('APP_NAME') }}: </p>
      <Input v-model="appName" :placeholder="$t('APP_NAME_TIP')" style="width: 300px"></Input>
    </Modal>
  </article>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  async asyncData(ctx) {
    const { $axios } = ctx;

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
      this.$Message.success(this.$t('APP_CREATE_SUCCESSFUL'));
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
      this.$router.push(this.localePath({ name: where, query: { appId }}))
    }
  },
  components: {}
}
</script>

<style scoped>

</style>
