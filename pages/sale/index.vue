<template>
  <article class="tfs-article-sale">
    <Row style="margin: 20px 50px;" class="hidden-sm">
      <Col span="24" :current="currentStep">
        <Steps>
          <Step
            title="步骤1"
            content="这里是该步骤的描述信息"
            style="width: 24%;"
          ></Step>
          <Step title="步骤2" content="这里是该步骤的描述信息"></Step>
          <Step title="步骤3" content="这里是该步骤的描述信息"></Step>
          <Step title="步骤4" content="这里是该步骤的描述信息"></Step>
        </Steps>
      </Col>
    </Row>
    <Row style="margin: 20px 10px;" class="hidden-md">
      当前步骤: {{ currentStep }}
    </Row>
    <Row class="tfs-sale-main-content">
      <Col span="24" v-if="currentStep === 0">0</Col>
    </Row>
    <Row style="margin: 10px 0; padding: 0 10px;">
      <Col span="12">
        <Button type="primary" @click="next">Next step</Button>
      </Col>
      <Col span="12" style="text-align: right;">
        <Button type="primary" @click="next">Next step</Button>
      </Col>
    </Row>
  </article>
</template>

<script>
export default {
  layout: 'sale',
  components: {},
  data() {
    return {
      single: false,
      currentStep: 0,
      showStep: true,
    };
  },
  methods: {},
  mounted() {
    let mqlSM = window.matchMedia('(max-width: 767px)');
    let mqlMD = window.matchMedia('(min-width: 767px)');
    if (mqlSM.matches) {
      this.showStep = false;
    }
    if (mqlMD.matches) {
      this.showStep = true;
    }
  },
};
</script>

<style>
.tfs-sale-inner-layout {
  width: 90%;
}

.tfs-article-sale {
  margin: 0 auto;
  padding: 0;
}
</style>