<template>
  <article class="tfs-article-sale">
    <Row class="tfs-sale-main-content">
      <div style="text-align: left;" v-if="template !== undefined">
        <TemplatePreview :template="template" :type="device"/>
        <Row :gutter="16" style="margin-top: 5px;" v-if="false">
          <Col :xs="24" :sm="24" :md="12" :lg="12" style="margin-top: 5px;">
            <Button size="large" type="info" v-on:click="goBack" long>返回预览</Button>
          </Col>
          <Col :xs="24" :sm="24" :md="12" :lg="12" style="margin-top: 5px;">
            <Button size="large" type="success" v-on:click="chooseTemplate(template.title)" long>我要这个主题</Button>
          </Col>
        </Row>
      </div>
    </Row>
  </article>
</template>

<script>
import TemplatePreview from '@/components/sales/TemplatePreview';
import { mapGetters, mapMutations } from 'vuex';

export default {
  layout: 'sale',
  async asyncData(ctx) {
    const { query } = ctx;
    return {
      templateTitle: query.template,
      device: query.type
    };
  },
  components: {
    TemplatePreview
  },
  mounted() {
    const allTemplates = JSON.parse(window.sessionStorage.getItem('TEMPLATES'));
    this.template = allTemplates[this.templateTitle].filter(template => {
      return template.platform === this.device;
    });
  },
  data() {
    return {
      templateTitle: '',
      device: '',
      template: undefined
    };
  },
  methods: {
    chooseTemplate(template) {
      this.setTemplate(template);
    },
    goBack() {
      window.close();
    },
    ...mapMutations({
      setTemplate: 'sale/setTemplate'
    })
  },
};
</script>

<style>
.ivu-tabs-bar {
  margin-bottom: 2px;
}
.tfs-sale-inner-layout {
  width: 90%;
}
</style>
