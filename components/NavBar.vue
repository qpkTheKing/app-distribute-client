<template>
  <div class="tfs-layout-ceiling">
    <div class="tfs-layout-i18n">
      <!--      <NuxtLink :to="switchLocalePath('en')">English</NuxtLink>-->
      <!--      <NuxtLink :to="switchLocalePath('zh-CN')">中文</NuxtLink>-->
      <I18nSwitcher :locale="locale" :available-locales="availableLocales" :set-local="setLocal"></I18nSwitcher>
    </div>
    <div class="tfs-layout-ceiling-main" v-if="isAuthenticated">
      <a class="navbar-link" href="javascript:void(0)">{{ $t('WELCOME') }}, {{ loggedInUser.name }}</a>|
      <NuxtLink :to="localePath('/')">{{ $t('home') }}</NuxtLink>
      |
      <NuxtLink v-if="role === '1'" :to="localePath('admin')">{{ $t('ADMIN') }}</NuxtLink>
      |
      <a class="navbar-link" href="javascript:void(0)" v-on:click="logout">{{ $t('LOGOUT') }}</a>
    </div>
    <template v-else>
      <div class="tfs-layout-ceiling-main">
        <NuxtLink :to="localePath('login')">{{ $t('LOGIN') }}</NuxtLink>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import I18nSwitcher from '@/components/I18nSwitcher';

export default {
  props: ['role', 'locale', 'availableLocales', 'setLocal'],
  data() {
    return {};
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
  components: {
    I18nSwitcher
  }
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
