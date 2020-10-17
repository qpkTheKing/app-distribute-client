<template>
  <div class="step-container">
    <Card :bordered="false">
      <p slot="title">{{ title }}</p>
      <div>
        <RadioGroup v-model="selected" size="large" @on-change="save" vertical>
          <Radio label="中国">
            <img src="~assets/CN.png" alt="" />
            <span class="c-text">中国</span>
          </Radio>
          <Radio label="泰国">
            <img src="~assets/TH.png" alt="" />
            <span class="c-text">泰国</span>
          </Radio>
          <Radio label="越南">
            <img src="~assets/VI.png" alt="" />
            <span class="c-text">越南</span>
          </Radio>
          <Radio label="缅甸">
            <img src="~assets/MY.png" alt="" />
            <span class="c-text">缅甸</span>
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
      selectedMarket: 'sale/getMarket'
    })
  },
  data() {
    return {
      selected: ''
    };
  },
  mounted() {
    this.selected = this.selectedMarket;
  },
  methods: {
    save(data) {
      this.setMarket(data);
    },
    ...mapMutations({
      setMarket: 'sale/setMarket'
    })
  },
};
</script>

<style>

</style>
