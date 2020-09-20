<template>
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
        <a
          class="tfs-btn-i18n"
          :key="locale.code"
          @click.prevent="setLocal(locale.code)">
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
        </a>
      </DropdownItem>
    </DropdownMenu>
  </Dropdown>
</template>

<script>

export default {
  props: ['locale', 'availableLocales', 'setLocal'],
  data() {
    return {};
  },
  methods: {},
  components: {}
};
</script>

<style>
</style>
