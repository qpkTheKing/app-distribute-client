<template>
  <article class="tfs-article-sale">
    <Row style="margin: 20px 50px;" class="hidden-sm">
      <Col span="24">
        <Steps :current="currentStep">
          <Step
            v-for="step in steps"
            :key="step.title"
            :title="step.title"
            :content="step.content"
          >
          </Step>
        </Steps>
      </Col>
    </Row>
    <Row style="margin: 20px 10px;" class="hidden-md">
      当前步骤:
      <span style="font-weight: bold; font-size: 16px; color: #2b85e4;">{{
        steps[currentStep].title
      }}</span>
    </Row>
    <Row class="tfs-sale-main-content">
      <Col span="24" v-if="currentStep === 0">
        <MarketComponent :title="steps[currentStep].title" />
      </Col>
      <Col span="24" v-if="currentStep === 1">
        <ProductComponent :title="steps[currentStep].title" />
      </Col>
      <Col span="24" v-if="currentStep === 2">
        <ThemeComponent :title="steps[currentStep].title" />
      </Col>
      <Col span="24" v-if="currentStep === 3">
        <TemplateComponent :title="steps[currentStep].title" />
      </Col>
    </Row>
    <Row class="tfs-sale-footer">
      <Col span="12">
        <Button type="warning" @click="prevStep" :disabled="currentStep === 0" :loading="loading"
          >返回</Button
        >
      </Col>
      <Col span="12" style="text-align: right;">
        <Button type="primary" @click="nextStep" v-if="currentStep !== steps.length - 1">下一步</Button>
        <Button type="success" @click="submit" :loading="loading" v-else>提交</Button>
      </Col>
    </Row>
    <Modal
      title="下载"
      v-model="downloadModal"
      :mask-closable="false"
      @on-ok="asyncOK"
    >
      <a class="ivu-btn ivu-btn-success" :href="jpgDownloadUrl" style="font-size: 16px;">
        点击此处下载您的需求并发送给客服
      </a>
    </Modal>
  </article>
</template>

<script>
import MarketComponent from '@/components/sales/Market';
import ProductComponent from '@/components/sales/Product';
import ThemeComponent from '@/components/sales/Theme';
import TemplateComponent from '@/components/sales/Template';
import { mapGetters } from 'vuex';

export default {
  layout: 'sale',
  components: {
    MarketComponent,
    ProductComponent,
    ThemeComponent,
    TemplateComponent
  },
  computed: {
    ...mapGetters({
      steps: 'sale/getSteps',
      selectedTheme: 'sale/getTheme',
      selectedProduct: 'sale/getProduct',
      selectedMarket: 'sale/getMarket',
      selectTemplate: 'sale/getTemplate'
    })
  },
  data() {
    return {
      downloadModal: false,
      loading: false,
      single: false,
      currentStep: 0,
      jpgDownloadUrl: ''
    };
  },
  methods: {
    asyncOK() {
      this.downloadModal = false;
    },
    async submit() {
      const { images } = this.selectTemplate;
      const { desktop, mobile } = images;
      this.loading = true;
      const { data } = await this.$axios.$post('images/sale', {
        images: {
          pc: desktop[0],
          mobile: mobile[0]
        },
        texts: [`面向市场:  ${this.selectedMarket}`, `主推产品:  ${this.selectedProduct}`, `主题颜色:  ${this.selectedTheme}`]
      });
      const { url } = data;
      this.loading = false;
      this.downloadModal = true;
      this.jpgDownloadUrl = url;
    },
    nextStep() {
      if (this.currentStep !== this.steps.length - 1) {
        this.currentStep += 1;
      }
    },
    prevStep() {
      if (this.currentStep !== 0) {
        this.currentStep -= 1;
      }
    },
  },
  mounted() {},
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
