<template>
  <div class="tfs-layout-ceiling">
    <div class="tfs-layout-i18n">
      <!--      <NuxtLink :to="switchLocalePath('en')">English</NuxtLink>-->
      <!--      <NuxtLink :to="switchLocalePath('zh-CN')">中文</NuxtLink>-->
      <Dropdown placement="bottom-end" trigger="click">
        <Button type="text" ghost class="tfs-btn-i18n">
          <div v-if="locale.code === 'en'" style="display: inline-block;">
            <img src="~assets/EN.png" alt />
          </div>
          <div v-if="locale.code === 'zh-CN'" style="display: inline-block;">
            <img src="~assets/CN.png" alt />
          </div>
          <div v-if="locale.code === 'TH'" style="display: inline-block;">
            <img src="~assets/TH.png" alt />
          </div>
          <div v-if="locale.code === 'VI'" style="display: inline-block;">
            <img src="~assets/VI.png" alt />
          </div>
        </Button>
        <DropdownMenu slot="list">
          <DropdownItem v-for="locale in availableLocales" :key="locale.code">
            <nuxt-link
              class="tfs-btn-i18n"
              :key="locale.code"
              :to="switchLocalePath(locale.code)">
              <div v-if="locale.code === 'en'" style="display: inline-block;">
                <img src="~assets/EN.png" alt />
              </div>
              <div v-if="locale.code === 'zh-CN'" style="display: inline-block;">
                <img src="~assets/CN.png" alt />
              </div>
              <div v-if="locale.code === 'TH'" style="display: inline-block;">
                <img src="~assets/TH.png" alt />
              </div>
              <div v-if="locale.code === 'VI'" style="display: inline-block;">
                <img src="~assets/VI.png" alt />
              </div>
              <span class="menu">{{ locale.name }}</span>
            </nuxt-link>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
    <div class="tfs-layout-ceiling-main" v-if="isAuthenticated">
      <a class="navbar-link" href="javascript:void(0)">{{$t('WELCOME')}}, {{ loggedInUser.name }}</a>|
      <NuxtLink :to="localePath('/')">{{ $t('home') }}</NuxtLink>|
      <NuxtLink v-if="role === '1'" :to="localePath('admin')">{{ $t('ADMIN') }}</NuxtLink>|
      <a class="navbar-link" href="javascript:void(0)" v-on:click="logout">{{ $t('LOGOUT') }}</a>
    </div>
    <template v-else>
      <div class="tfs-layout-ceiling-main">
        <NuxtLink :to="localePath('login')">{{ $t('LOGIN') }}</NuxtLink>|
        <NuxtLink :to="localePath('register')">{{ $t('REGISTER') }}</NuxtLink>|
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: ['role', 'locale', 'availableLocales'],
  data() {
    return {};
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser']),
  },
  methods: {
    async logout() {
      await this.$auth.logout();
      window.localStorage.clear();
      await this.$router.push('/login');
    }
  },
  components: {},
};
</script>

<style>
.tfs-btn-i18n img {
  width: 24px;
  height: 24px;
}

.tfs-btn-i18n.ivu-btn {
  padding: 2px;
}

.tfs-btn-i18n span {
  display: block;
  line-height: 0;
}

.tfs-btn-i18n span.menu {
  display: inline-block;
  position: relative;
  bottom: 7px;
  left: 3px;
}
</style>
