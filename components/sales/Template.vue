<template>
  <div class="step-container">
    <Card :bordered="false">
      <div slot="title">当前选择模板: <span style="font-size: 36px; color:#ed4014;">{{ selectedTemplate.title }}</span></div>
      <div class="recommended-template" v-if="showSelected">
        <TemplatePreview :template="selectedTemplate" />
      </div>
      <div class="all-templates" v-if="showAllTemplate">
        <Row :gutter="16">
          <Col :xs="24" :sm="24" :md="6" :lg="6" v-for="template in allTemplate" style="margin:10px 0;" :key="template.title">
            <Card>
              <p slot="title">{{ template.title }}</p>
              <div>
                <a v-on:click="enlarge">
                  <img :src="template.showcase" alt="" style="width: 100%" />
                </a>
                <Divider dashed />
                <Row :gutter="16" style="margin-top: 0;">
                  <Col :xs="24" :sm="24" :md="24" :lg="24" style="margin-top: 5px;">
                    <Button size="large" type="info" long v-on:click="preview(template.title)">预览</Button>
                  </Col>
                  <Col :xs="24" :sm="24" :md="24" :lg="24" style="margin-top: 5px;">
                    <Button size="large" type="success" v-on:click="chooseTemplate(template.title)" long>我要这个主题</Button>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
      <div v-if="false">
        <Tabs type="card" closable @on-tab-remove="handleTabRemove">
          <TabPane v-for="preview in previewTemplates" :label="preview.title">
            <TemplatePreview :template="preview" />
            <Row :gutter="16" style="margin-top: 5px;">
              <Col :xs="24" :sm="24" :md="12" :lg="12" style="margin-top: 5px;">
                <Button size="large" type="info" v-on:click="goLookMore" long>返回预览</Button>
              </Col>
              <Col :xs="24" :sm="24" :md="12" :lg="12" style="margin-top: 5px;">
                <Button size="large" type="success" v-on:click="chooseTemplate(preview.title)" long>我要这个主题</Button>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </div>
      <Row style="margin-top: 15px;">
        <Col span="24">
          <Button size="large" type="success" long v-on:click="goLookMore" v-if="showSelected">不满意? 查看更多模板样例.</Button>
          <Button size="large" type="primary" long v-on:click="goBack" v-if="!showSelected">返回</Button>
        </Col>
      </Row>
    </Card>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import TemplatePreview from '@/components/sales/TemplatePreview';

export default {
  props: ['title'],
  components: { TemplatePreview },
  computed: {
    ...mapGetters({
      allTemplate: 'sale/getAllTemplates',
      selectedTemplate: 'sale/getTemplate'
    })
  },
  data() {
    return {
      selected: '',
      showSelected: true,
      showPreview: false,
      showAllTemplate: false,
      previewTemplates: []
    };
  },
  mounted() {
    const exists = this.previewTemplates.filter(template => {
      return template.title === this.selectedTemplate.title;
    });
    if (exists && exists.length > 0) {
      // do nothing when template is already exists.
    } else {
      this.previewTemplates.push(this.selectedTemplate);
    }
  },
  methods: {
    enlarge(e) {
      e.preventDefault();
    },
    preview(theme) {
      // const selected = this.allTemplate.filter(template => {
      //   return template.title === theme;
      // })[0];
      // const exists = this.previewTemplates.filter(template => {
      //   return template.title === theme;
      // });
      // if (exists && exists.length > 0) {
      //   this.previewTemplates.reverse();
      // } else {
      //   this.previewTemplates.push(selected);
      //   this.previewTemplates.reverse();
      // }
      // this.showPreview = true;
      // this.showAllTemplate = false;
      // this.showSelected = false;
      const path = this.localePath({ path: '/sale/preview', query: { template: theme } });
      window.open(path, '_blank');
      // this.$router.push(localUrl);
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
    handleTabRemove() {

    },
    ...mapMutations({
      setTemplate: 'sale/setTemplate'
    })

  }
};
</script>

<style>

</style>
