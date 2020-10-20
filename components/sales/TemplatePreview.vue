<template>
  <div>
    <Tabs type="card">
      <TabPane label="网页端">
        <vueper-slides lazy lazy-load-on-drag fixedHeight="500px">
          <vueper-slide v-for="(desktopImg, i) in template.images.desktop" :key="`${template.title}-desktop-${template.showcase}-${i}`">
            <template v-slot:content>
              <img :src="desktopImg" alt="" style="width:100%; height:100%;"/>
            </template>
          </vueper-slide>
        </vueper-slides>
      </TabPane>
      <TabPane label="手机端">
        <vueper-slides lazy lazy-load-on-drag fixedHeight="500px">
          <vueper-slide v-for="(mobileImg, i) in template.images.mobile" :key="`${template.title}-desktop-${template.showcase}-${i}`">
            <template v-slot:content>
              <img :src="mobileImg" alt="" class="resp-image"/>
            </template>
          </vueper-slide>
        </vueper-slides>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import { VueperSlides, VueperSlide } from 'vueperslides';
import 'vueperslides/dist/vueperslides.css';

export default {
  components: { VueperSlides, VueperSlide },
  props: ['template'],
  data() {
    return {};
  },
  methods: {},
};
</script>

<style>

</style>
