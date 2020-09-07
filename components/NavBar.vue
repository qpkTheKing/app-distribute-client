<template>
  <div class="tfs-layout-ceiling">
    <div class="tfs-layout-ceiling-main" v-if="isAuthenticated">
      <a class="navbar-link" href="javascript:void(0)">
        欢迎, {{ loggedInUser.name }}
      </a>|
      <NuxtLink to="/">首页</NuxtLink> |
      <NuxtLink v-if="role === '1'" to="/admin">管理</NuxtLink> |
      <a class="navbar-link" href="javascript:void(0)" v-on:click="logout">登出</a>
    </div>
    <template v-else>
      <div class="tfs-layout-ceiling-main" >
        <NuxtLink to="/login">登陆</NuxtLink> |
        <NuxtLink to="/register">注册</NuxtLink>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: ["role"],
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser'])
  },
  methods: {
    async logout() {
      await this.$auth.logout();
      window.localStorage.clear();
      await this.$router.push('/login');
    }
  },
  components: {}
}
</script>

<style scoped>

</style>
