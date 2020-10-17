<template>
  <div class="step-container">
    <Card :bordered="false">
      <div slot="title">当前选择模板: <span style="font-size: 36px; color:#ed4014;">{{ selectedTheme.title }}</span></div>
      <div class="recommended-template" v-if="!chooseOther">
        <Tabs type="card">
          <TabPane label="网页端">
            <vueper-slides lazy lazy-load-on-drag fixedHeight="500px">
              <vueper-slide v-for="(desktopImg, i) in selectedTheme.images.desktop" :key="`${selectedTheme.title}-desktop-${selectedTheme.showcase}-${i}`">
                <template v-slot:content>
                  <img :src="desktopImg" alt="" style="width:100%; height:100%;"/>
                </template>
              </vueper-slide>
            </vueper-slides>
          </TabPane>
          <TabPane label="手机端">
            <vueper-slides lazy lazy-load-on-drag fixedHeight="500px">
              <vueper-slide v-for="(mobileImg, i) in selectedTheme.images.mobile" :key="`${selectedTheme.title}-desktop-${selectedTheme.showcase}-${i}`">
                <template v-slot:content>
                  <img :src="mobileImg" alt="" class="resp-image"/>
                </template>
              </vueper-slide>
            </vueper-slides>
          </TabPane>
        </Tabs>
      </div>
      <div class="all-templates" v-else>
        <Row :gutter="16">
          <Col :xs="24" :sm="24" :md="6" :lg="6" v-for="theme in themeImages" style="margin:10px 0;" :key="theme.title">
            <Card>
              <p slot="title">{{ theme.title }}</p>
              <div>
                <a v-on:click="enlarge">
                  <img :src="theme.showcase" alt="" style="width: 100%" />
                </a>
                <Divider dashed />
                <Button size="large" type="success" long v-on:click="confirmTheme(theme.title)">选择</Button>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
      <Row style="margin-top: 15px;">
        <Col span="24">
          <Button size="large" type="success" long v-if="!chooseOther" v-on:click="goLookMore">不满意? 查看更多模板样例.</Button>
          <Button size="large" type="primary" long v-else v-on:click="goBack">返回</Button>
        </Col>
      </Row>
    </Card>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { VueperSlides, VueperSlide } from 'vueperslides';
import 'vueperslides/dist/vueperslides.css'

export default {
  props: ['title'],
  components: { VueperSlides, VueperSlide },
  computed: {
    ...mapGetters({
      themeImages: 'sale/getAllTemplates',
      selectedTheme: 'sale/getTemplate'
    })
  },
  data() {
    return {
      chooseOther: false,
      selected: ''
    };
  },
  mounted() {
  },
  methods: {
    enlarge(e) {
      e.preventDefault();
    },
    confirmTheme(theme) {
      this.setTemplate(theme);
      this.chooseOther = false;
    },
    goLookMore() {
      this.chooseOther = true;
    },
    goBack() {
      this.chooseOther = false;
    },
    ...mapMutations({
      setTemplate: 'sale/setTemplate'
    })

  }
};
</script>

<style>

</style>
