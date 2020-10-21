<template>
  <article class="tfs-article-sale">
    <Row class="tfs-sale-main-content">
      <div class="step-container" style="text-align: left;">
        <Card :bordered="false">
          <p slot="title">我们的联系方式</p>
          <Row :gutter="gutter" style="margin-top: 10px">
            <Col :xs="24" :sm="24" :md="8" :lg="8" style="margin-bottom: 10px;">
              <Card style="height: 150px;">
                <div style="text-align:center">
                  <img src="~assets/online-service.png" alt="">
                  <h3 style="margin-bottom: 15px;">在线客服</h3>
                </div>
              </Card>
            </Col>
            <Col :xs="24" :sm="24" :md="8" :lg="8" style="margin-bottom: 10px;">
              <Card style="height: 150px;">
                <div style="text-align:center">
                  <img src="~assets/001-skype.png" alt="">
                  <h3 style="margin-bottom: 15px;">Skype</h3>
                  <p class="tfs-text-red">sales@tc-gaming.com</p>
                </div>
              </Card>
            </Col>
            <Col :xs="24" :sm="24" :md="8" :lg="8" style="margin-bottom: 10px;">
              <Card style="height: 150px;">
                <div style="text-align:center">
                  <img src="~assets/002-telegram.png" alt="">
                  <h3 style="margin-bottom: 15px;">Telegram</h3>
                  <p class="tfs-text-red">@TCGaming</p>
                </div>
              </Card>
            </Col>
          </Row>
          <Row :gutter="gutter" style="margin-top: 10px">
            <Col :xs="24" :sm="24" :md="8" :lg="8" style="margin-bottom: 10px;">
              <Card style="height: 150px;">
                <div style="text-align:center">
                  <img src="~assets/003-phone-call.png" alt="">
                  <h3 style="margin-bottom: 15px;">电话号码</h3>
                  <p class="tfs-text-red">+63 917 186 1111</p>
                </div>
              </Card>
            </Col>
            <Col :xs="24" :sm="24" :md="8" :lg="8" style="margin-bottom: 10px;">
              <Card style="height: 150px;">
                <div style="text-align:center">
                  <img src="~assets/wechat.png" alt="">
                  <h3 style="margin-bottom: 15px;">微信</h3>
                  <p class="tfs-text-red">tcgaming</p>
                </div>
              </Card>
            </Col>
            <Col :xs="24" :sm="24" :md="8" :lg="8" style="margin-bottom: 10px;">
              <Card style="height: 150px;">
                <div style="text-align:center">
                  <img src="~assets/qq.png" alt="">
                  <h3 style="margin-bottom: 15px;">QQ在线咨询</h3>
                  <p class="tfs-text-red">778011</p>
                </div>
              </Card>
            </Col>
          </Row>
          <Row :gutter="gutter" style="margin-top: 10px">
            <Col :xs="24" :sm="24" :md="12" :lg="12" style="margin-bottom: 10px;">
              <Card style="height: 150px;">
                <div style="text-align:center">
                  <img src="~assets/whatsapp.png" alt="">
                  <h3 style="margin-bottom: 15px;">WhatsApp</h3>
                  <p class="tfs-text-red">+63 917 186 1111</p>
                </div>
              </Card>
            </Col>
            <Col :xs="24" :sm="24" :md="12" :lg="12" style="margin-bottom: 10px;">
              <Card style="height: 150px;">
                <div style="text-align:center">
                  <img src="~assets/email.png" alt="">
                  <h3 style="margin-bottom: 15px;">邮箱</h3>
                  <p class="tfs-text-red">sales@tc-gaming.com</p>
                </div>
              </Card>
            </Col>
          </Row>
        </Card>
        <Card :bordered="true" style="margin-top: 10px">
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
      gutter: 16,
      jpgDownloadUrl: ''
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
          `主题颜色:  ${this.selectedTheme}`
        ],
      });
      const { url } = data;
      this.loading = false;
      this.$Spin.hide();
      this.downloadModal = true;
      this.jpgDownloadUrl = url;
      this.$Modal.success({
        title: '成功提交请求',
        content: `<a class="ivu-btn ivu-btn-success" href=${url} style="font-size: 16px;">
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

.tfs-text-red {
  color: #ec2529;
}
</style>
