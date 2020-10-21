<template>
  <article class="tfs-article-sale">
    <Row style="margin: 20px 50px;" class="hidden-sm-sale">
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
    <Row style="margin: 20px 10px;" class="hidden-md-sale">
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
        <TemplateComponent :title="steps[currentStep].title" />
      </Col>
      <Col span="24" v-if="currentStep === 3">
        <ConfirmTemplate :title="steps[currentStep].title" :jpgDownloadUrl="jpgDownloadUrl"></ConfirmTemplate>
      </Col>
    </Row>
    <Row class="tfs-sale-footer">
      <Col span="12">
        <Button type="warning" @click="prevStep" :disabled="currentStep === 0" :loading="loading"
        >返回
        </Button
        >
      </Col>
      <Col span="12" style="text-align: right;">
        <Button type="primary" @click="nextStep" v-if="currentStep !== steps.length - 1">下一步</Button>
        <Button type="success" @click="submit" :loading="loading" v-else>下一步</Button>
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
import TemplatePreview from '@/components/sales/TemplatePreview';
import ConfirmTemplate from '@/components/sales/ConfirmTemplate';
import { mapGetters } from 'vuex';

export default {
  layout: 'sale',
  components: {
    MarketComponent,
    ProductComponent,
    ThemeComponent,
    TemplateComponent,
    TemplatePreview,
    ConfirmTemplate
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
    submit() {
      const localUrl = this.localePath('/sale/contact');
      this.$router.push(localUrl);
    },
    nextStep() {
      const stepKey = this.steps[this.currentStep].key;
      switch (stepKey) {
        case 'selectedMarket':
          if (this.selectedMarket === '') {
            this.$Message.error('请选择您要面向的市场!');
          } else {
            if (this.currentStep !== this.steps.length - 1) {
              this.currentStep += 1;
            }
          }
          break;
        case 'selectedProduct':
          if (this.selectedProduct === '') {
            this.$Message.error('请选择您要主推的产品!');
          } else {
            if (this.currentStep !== this.steps.length - 1) {
              this.currentStep += 1;
            }
          }
          break;
        case 'selectedTheme':
          if (this.selectedTheme === '') {
            this.$Message.error('请选择您需要的主题色系!');
          } else {
            if (this.currentStep !== this.steps.length - 1) {
              this.currentStep += 1;
            }
          }
          break;
        case 'selected':
          if (this.currentStep !== this.steps.length - 1) {
            this.currentStep += 1;
          }
          break;
      }
    },
    prevStep() {
      if (this.currentStep !== 0) {
        this.currentStep -= 1;
      }
    }
  },
  mounted() {
  }
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
