<template>
  <article class="tfs-article-sale">
    <Row class="tfs-sale-main-content">
      <div class="step-container" style="text-align: left;">
        <Card :bordered="true" style="margin-bottom: 10px">
          <p slot="title">您的需求如下:</p>
          <div class="tfs-preview-request">
            <Form :label-width="100">
              <FormItem label="用户面向市场:">
                <Input :value="selectedMarket" readonly></Input>
              </FormItem>
              <FormItem label="主推产品:">
                <Input :value="selectedProduct" readonly></Input>
              </FormItem>
              <FormItem label="主题色系:">
                <Input :value="selectedTheme" readonly></Input>
              </FormItem>
              <FormItem label="网站模板:">
                <Input :value="selectTemplate.title" readonly></Input>
              </FormItem>
            </Form>
          </div>
        </Card>
        <Card :bordered="false">
          <p slot="title">填写联系资料</p>
          <div>
            <Form :model="request" :label-width="100">
              <FormItem label="邮箱:">
                <Input v-model="request.email" placeholder="请输入您的邮箱地址"></Input>
              </FormItem>
              <FormItem label="电话:">
                <Input v-model="request.phone" placeholder="请输入您的手机号码"></Input>
              </FormItem>
              <FormItem label="其他需求:">
                <Input v-model="request.otherRequest" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入您的其他特殊要求"></Input>
              </FormItem>
              <FormItem>
                <Button type="success" @click="submit" :loading="loading" style="margin-top: 10px;">提交资料</Button>
                <Button @click="goBack" :loading="loading" style="margin-top: 10px;">我要重选</Button>
              </FormItem>
            </Form>
          </div>
        </Card>
      </div>
    </Row>
  </article>
</template>

<script>
import ConfirmTemplate from '@/components/sales/ConfirmTemplate';
import { mapGetters } from 'vuex';

export default {
  layout: 'sale',
  components: {
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
      jpgDownloadUrl: '',
      request: {
        email: '',
        phone: '',
        otherRequest: ''
      }
    };
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
            h('div', '正在提交')
          ])
        }
      });
    },
    async submit() {
      const { images } = this.selectTemplate;
      const { desktop, mobile } = images;
      this.loading = true;
      this.showSpin();
      const { data } = await this.$axios.$post('images/sale', {
        images: {
          pc: desktop[0],
          mobile: mobile[0]
        },
        texts: [
          `面向市场:  ${this.selectedMarket}`,
          `主推产品:  ${this.selectedProduct}`,
          `主题颜色:  ${this.selectedTheme}`,
          `邮箱:  ${this.request.email}`,
          `电话:  ${this.request.phone}`,
          `其他需求:  ${this.request.otherRequest}`,
        ],
      });
      const { url } = data;
      this.loading = false;
      this.$Spin.hide();
      this.downloadModal = true;
      this.jpgDownloadUrl = url;
      this.$Modal.success({
        title: '成功提交请求',
        content: `<a class="ivu-btn ivu-btn-success" :href="jpgDownloadUrl" style="font-size: 16px;">
                    点击此处下载您的需求并发送给客服
                  </a>`
      });
    },
    goBack() {
      // const url = `${this.$config.client}${this.localePath({ name: 'contact' })}`;
      const localUrl = this.localePath('sale');
      this.$router.push(localUrl);
    },
  },
  mounted() {
    // console.log(this.selectedMarket);
  },
};
</script>

<style>
.tfs-sale-inner-layout {
  width: 90%;
}

.tfs-preview-request .ivu-input {
  border: none;
}

.tfs-article-sale {
  margin: 0 auto;
  padding: 0;
}

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
