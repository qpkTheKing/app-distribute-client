<template>
  <div class="step-container">
    <div v-if="hasTemplate">
      <Card :bordered="false">
        <div class="recommended-template" v-if="showSelected" style="text-align: left;">
          当前选择模板: <span style="font-size: 24px; color:#ed4014; font-weight: bold;">{{ selectedTemplate.title }}</span>
          <div class="recommended-template" style="margin-top: 20px;">
            <TemplatePreview :template="selectedTemplate.template" />
          </div>
        </div>
        <div class="all-templates" v-if="showAllTemplate">
          <Row :gutter="16">
            <Col :xs="24" :sm="24" :md="6" :lg="6" v-for="(images, name) in allTemplates" style="margin:10px 0;" :key="name">
              <Card>
                <p slot="title">{{ name }}</p>
                <div>
                  <a>
                    <img src="~assets/webPreview.png" alt="" style="width: 100%" />
                  </a>
                  <Divider dashed />
                  <Row :gutter="16" style="margin-top: 0;">
                    <Col :xs="24" :sm="24" :md="24" :lg="24">
                      <Row :gutter="16">
                        <Col :xs="24" :sm="24" :md="24" :lg="24">
                          <Button size="large" type="info" long v-on:click="preview(name, 'M')">移动端预览</Button>
                        </Col>
                        <Col :xs="24" :sm="24" :md="24" :lg="24" style="margin-top: 5px;">
                          <Button size="large" type="info" long v-on:click="preview(name, 'W')">桌面端预览</Button>
                        </Col>
                      </Row>
                    </Col>
                    <Col :xs="24" :sm="24" :md="24" :lg="24" style="margin-top: 5px;">
                      <Button size="large" type="success" v-on:click="chooseTemplate(name)" long>我要这个主题</Button>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
        <Row style="margin-top: 15px;">
          <Col span="24">
            <Button size="large" type="success" long v-on:click="goLookMore" v-if="showSelected">不满意? 查看更多模板样例.</Button>
          </Col>
        </Row>
      </Card>
    </div>
    <div v-else>
      该产品面向的国家没有模板, 请联系客服添加!
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import TemplatePreview from '@/components/sales/TemplatePreview';
import _isEmpty from "lodash/isEmpty";

export default {
  props: ['title'],
  components: { TemplatePreview },
  computed: {
    ...mapGetters({
      selectedProduct: 'sale/getProduct',
      selectedMarket: 'sale/getMarket',
      allTemplates: 'sale/getAllTemplates',
      selectedTemplate: 'sale/getTemplate',
      webTemplates: 'sale/getWebTemplates',
      mobileTemplates: 'sale/getMobileTemplates',
    })
  },
  data() {
    return {
      hasTemplate: false,
      selected: '',
      showSelected: false,
      showPreview: false,
      showAllTemplate: true,
      previewTemplates: []
    };
  },
  watch: {
    allTemplates: function (val) {
      this.hasTemplate = !_isEmpty(val);
    }
  },
  async mounted() {
    this.showSpin();
    await this.fetchTemplates('W');
    await this.fetchTemplates('M');
    const templateInterval = setInterval(() => {
      if (this.webTemplates.length > 0 && this.mobileTemplates.length > 0) {
        clearInterval(templateInterval);
        this.$Spin.hide();
        this.setTemplates({
          country: this.selectedMarket,
          product: this.selectedProduct
        });
      } else {
        // waiting all request is completed.
      }
    }, 2000);
    if (this.selectedTemplate.title !== '' && this.selectedTemplate.template !== {}) {
      this.showAllTemplate = false;
      this.showSelected = true;
    }
  },
  methods: {
    showSpin() {
      this.$Spin.show({
        render: (h) => {
          return h('div', [
            h('Icon', {
              'class': 'demo-spin-icon-load',
              props: {
                type: 'ios-loading',
                size: 36
              }
            }),
            h('div', '正在获取模板数据...')
          ])
        }
      });
    },
    preview(themeName, device) {
      const path = this.localePath({ path: '/sale/preview', query: { template: themeName, type: device } });
      window.open(path, '_blank');
    },
    chooseTemplate(template) {
      this.setTemplate(template);
      this.showPreview = false;
      this.showAllTemplate = false;
      this.showSelected = true;
    },
    goLookMore() {
      this.showAllTemplate = true;
      this.showSelected = false;
      this.showPreview = false;
    },
    goBack() {
      this.showPreview = false;
      this.showAllTemplate = false;
      this.showSelected = true;
    },
    ...mapActions({
      fetchTemplates: 'sale/_throttleGetTemplates'
    }),
    ...mapMutations({
      setTemplate: 'sale/setTemplate',
      setTemplates: 'sale/setTemplates'
    })
  }
};
</script>

<style>
.demo-spin-icon-load{
  animation: ani-demo-spin 1s linear infinite;
}

@keyframes ani-demo-spin {
  from { transform: rotate(0deg);}
  50%  { transform: rotate(180deg);}
  to   { transform: rotate(360deg);}
}

.demo-spin-col{
  height: 100px;
  position: relative;
  border: 1px solid #eee;
}
</style>
