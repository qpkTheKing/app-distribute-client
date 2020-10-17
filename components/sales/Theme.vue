<template>
  <div class="step-container">
    <Card :bordered="false">
      <p slot="title">{{ title }}</p>
      <div>
        <RadioGroup v-model="selected" size="large" @on-change="save" vertical>
          <Radio label="黑">
            <img src="~assets/theme/black.png" alt="" />
            <span class="c-text">黑</span>
          </Radio>
          <Radio label="白">
            <img src="~assets/theme/white.png" alt="" />
            <span class="c-text">白</span>
          </Radio>
          <Radio label="红">
            <img src="~assets/theme/red.png" alt="" />
            <span class="c-text">红</span>
          </Radio>
        </RadioGroup>
      </div>
    </Card>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  props: ['title'],
  computed: {
    ...mapGetters({
      selectedTheme: 'sale/getTheme'
    })
  },
  mounted() {
    this.selected = this.selectedTheme;
  },
  data() {
    return {
      selected: ''
    };
  },
  methods: {
    save(selected) {
      this.setTheme(selected);
    },
    ...mapMutations({
      setTheme: 'sale/setTheme'
    })
  },
};
</script>

<style>

</style>
