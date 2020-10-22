<template>
  <div v-if="!type">
    <Tabs type="card">
      <TabPane label="网页端">
        <vueper-slides lazy lazy-load-on-drag fixedHeight="500px">
          <vueper-slide v-for="img in template" :key="`${img.id}`" v-if="img.platform === 'W'">
            <template v-slot:content>
              <div class="tfs-image-container">
                <img :src="img.image" alt=""/>
              </div>
            </template>
          </vueper-slide>
        </vueper-slides>
      </TabPane>
      <TabPane label="手机端">
        <vueper-slides lazy lazy-load-on-drag fixedHeight="500px">
          <vueper-slide v-for="img in template" :key="`${img.id}`" v-if="img.platform === 'M'">
            <template v-slot:content>
              <div class="tfs-image-container">
                <img :src="img.image" alt="" class="mobile"/>
              </div>
            </template>
          </vueper-slide>
        </vueper-slides>
      </TabPane>
    </Tabs>
  </div>
  <div v-else>
    <div v-if="type === 'M'">
      <Tabs type="card">
        <TabPane label="移动端">
          <div class="tfs-image-container">
            <vueper-slides lazy lazy-load-on-drag fixedHeight="500px">
              <vueper-slide v-for="img in template" :key="`${img.id}`">
                <template v-slot:content>
                  <div class="tfs-image-container">
                    <img :src="img.image" alt="" class="mobile"/>
                  </div>
                </template>
              </vueper-slide>
            </vueper-slides>
          </div>
        </TabPane>
      </Tabs>
    </div>
    <div v-if="type === 'W'">
      <Tabs type="card">
        <TabPane label="桌面端">
          <div class="tfs-image-container">
            <vueper-slides lazy lazy-load-on-drag fixedHeight="500px">
              <vueper-slide v-for="img in template" :key="`${img.id}`">
                <template v-slot:content>
                  <div class="tfs-image-container">
                    <img :src="img.image" alt=""/>
                  </div>
                </template>
              </vueper-slide>
            </vueper-slides>
          </div>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
import { VueperSlides, VueperSlide } from 'vueperslides';
import 'vueperslides/dist/vueperslides.css';

export default {
  components: { VueperSlides, VueperSlide },
  props: ['template', 'type'],
  data() {
    return {};
  },
  methods: {},
};
</script>

<style>

.tfs-image-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.tfs-image-container > img {
  position: absolute;
  width: 100% !important;
  max-width: 1000px;
  height: auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.tfs-image-container > img.mobile {
  max-width: 285px;
}

</style>
