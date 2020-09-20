<template>
  <div class="ivu-layout tfs-layout">
    <div class="tfs-download-inner-layout">
      <div class="tfs-i18n-container">
        <I18nSwitcher :locale="currentLocale" :available-locales="availableLocales"
                      :set-local="this.$i18n.setLocale"></I18nSwitcher>
      </div>
      <Nuxt />
    </div>
  </div>
</template>

<script>
import I18nSwitcher from '@/components/I18nSwitcher';

export default {
  components: {
    I18nSwitcher
  },
  computed: {
    availableLocales() {
      return this.$i18n.locales.filter((i) => i.code !== this.$i18n.locale);
    },
    currentLocale() {
      return this.$i18n.locales.filter((i) => i.code === this.$i18n.locale)[0];
    }
  }
};
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

.tfs-download-inner-layout {
  width: 97%;
  margin: 30px auto 20px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
}

.tfs-i18n-container {
  padding: .5rem;
  background: rgba(45,140,240,.2);
  border-radius: 6px 6px 0 0;
}

</style>
