<template>
  <article class="tfs-article-sale">
    <Row class="tfs-sale-main-content">
      <div style="text-align: left;" v-if="template !== undefined">
        <TemplatePreview :template="template" />
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
      templateTitle: query.template
    };
  },
  components: {
    TemplatePreview
  },
  computed: {
    ...mapGetters({
      allTemplate: 'sale/getAllTemplates',
      selectTemplate: 'sale/getTemplate'
    })
  },
  mounted() {
    this.template = this.allTemplate.filter(template => {
      return template.title === this.templateTitle.toUpperCase();
    })[0];
  },
  data() {
    return {
      templateTitle: '',
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
