<template>
  <div class="ivu-layout tfs-layout">
    <div class="tfs-sale-inner-layout">
      <div class="tfs-i18n-container">
        <I18nSwitcher
          :locale="currentLocale"
          :available-locales="availableLocales"
          :set-local="this.$i18n.setLocale"
        ></I18nSwitcher>
      </div>
      <Nuxt />
    </div>
  </div>
</template>

<script>
import I18nSwitcher from '@/components/I18nSwitcher';

export default {
  components: {
    I18nSwitcher,
  },
  computed: {
    availableLocales() {
      return this.$i18n.locales.filter((i) => i.code !== this.$i18n.locale);
    },
    currentLocale() {
      return this.$i18n.locales.filter((i) => i.code === this.$i18n.locale)[0];
    },
  },
};
</script>

<style>
html {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '\5FAE\8F6F\96C5\9ED1', Arial, sans-serif;
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

.tfs-sale-inner-layout {
  margin: 10px auto;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
}

.tfs-i18n-container {
  padding: 0.5rem;
  background: rgba(45, 140, 240, 0.2);
  border-radius: 6px 6px 0 0;
}

.step-container {
  background: #eee;
  padding: 20px;
}

.step-container img {
  width: 38px;
}

.c-text {
  position: relative;
  bottom: 15px;
  font-size: 22px;
  margin-left: 10px;
}

.ivu-radio-group-vertical .ivu-radio-wrapper {
  display: block;
  height: 60px;
}
.ivu-radio {
  bottom: 20px;
  margin-right: 10px;
}

@media (max-width: 767px) {
  .tfs-sale-main-content {
    margin: 20px 10px;
  }

  .tfs-sale-footer {
    margin: 10px;
    padding: 0;
  }

  .hidden-sm {
    display: none;
  }

  .sm-text-center {
    text-align: center;
  }

  .tCenter-sm {
    text-align: center;
  }

  .resp-image {
    width: 100% !important;
    height: 100%;
  }
}

@media (min-width: 768px) {
  .tfs-sale-inner-layout {
    width: 90% !important;
  }

  .vueperslide, .vueperslide__image {
    text-align: center;
  }

  .resp-image {
    width: 50% !important;
    height: 100%;
  }

  .tfs-sale-footer {
    margin: 10px 50px;
    padding: 0;
  }

  .tfs-sale-main-content {
    margin: 20px 50px;
  }

  .hidden-md {
    display: none !important;
  }

  .hidden-sm {
    display: block;
  }

  .sm-text-center {
    text-align: initial;
  }

  .tLeft-md {
    text-align: left;
  }
}
</style>
