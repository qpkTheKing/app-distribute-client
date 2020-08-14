<template>
  <div class="tfs-layout-ceiling">
    <div class="tfs-layout-ceiling-main" v-if="isAuthenticated">
      <Dropdown>
        <a class="navbar-link" href="javascript:void(0)">
          {{ loggedInUser.name }}
        </a>|
        <NuxtLink to="/">首页</NuxtLink> |
        <a class="navbar-link" href="javascript:void(0)" v-on:click="logout">登出</a>
      </Dropdown>
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
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser'])
  },
  methods: {
    async logout() {
      await this.$auth.logout();
      await this.$router.push('/login');
    }
  },
  components: {}
}
</script>

<style scoped>

</style>
