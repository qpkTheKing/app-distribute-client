<template>
  <div class="step-container">
    <Card :bordered="false">
      <p slot="title">{{ title }}</p>
      <div>
        <RadioGroup v-model="selected" size="large" @on-change="save" vertical>
          <Radio label="LOTT">
            <img src="~assets/casio/050-gambling.png" alt="" />
            <span class="c-text">传统彩票</span>
          </Radio>
          <Radio label="ELOTT">
            <img src="~assets/casio/028-billiards.png" alt="" />
            <span class="c-text">盘口彩</span>
          </Radio>
          <Radio label="ENT">
            <img src="~assets/casio/021-slot-machine-1.png" alt="" />
            <span class="c-text">娱乐城</span>
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
      selectedProduct: 'sale/getProduct'
    })
  },
  mounted() {
    this.selected = this.selectedProduct;
  },
  data() {
    return {
      selected: ''
    };
  },
  methods: {
    save(data) {
      this.setProduct(data);
    },
    ...mapMutations({
      setProduct: 'sale/setProduct'
    })
  },
};
</script>

<style>

</style>
