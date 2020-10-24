<template>
  <article class="tfs-article-sale">
    <Row class="tfs-sale-main-content">
      <div class="step-container" style="text-align: left;">
        <Card :bordered="true">
          <p slot="title">您的需求如下:</p>
          <div class="tfs-preview-request">
            <Form :label-width="100">
              <FormItem label="用户面向市场:">
                <Input :value="selectedMarket" readonly></Input>
              </FormItem>
              <FormItem label="主推产品:">
                <Input :value="selectedProduct" readonly></Input>
              </FormItem>
              <FormItem label="网站模板:">
                <Input :value="selectTemplate.title" readonly></Input>
              </FormItem>
              <FormItem>
                <Button type="success" @click="submit" :loading="loading" style="margin-top: 10px;">完成</Button>
                <Button @click="goBack" :loading="loading" style="margin-top: 10px;">我要重选</Button>
              </FormItem>
            </Form>
          </div>
        </Card>
        <Card :bordered="false" v-if="false">
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
        <Card :bordered="false" style="margin-top: 10px">
          <p slot="title">我们的联系方式</p>
          <Button size="large" type="info" @click="openNewWin" style="margin-top: 10px;width: 100%;height: 45px;">联系销售</Button>
        </Card>
      </div>
    </Row>
  </article>
</template>

<script>
import ConfirmTemplate from '@/components/sales/ConfirmTemplate';
import { mapGetters, mapMutations } from 'vuex';

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
    openNewWin() {
      window.open('https://www.tc-gaming.com/about-us/talk-to-us/', '_blank');
    },
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
      const { template, title } = this.selectTemplate;
      const pc = template.filter(tmp => tmp.platform === "W");
      const mobile = template.filter(tmp => tmp.platform === "M");

      if (pc && pc.length === 0) {
        this.$Message.error('请补充网页端的预览图片.');
      }

      if (mobile && mobile.length === 0) {
        this.$Message.error('请补充移动端的预览图片.');
      }

      if ((pc && pc.length > 0) && (mobile && mobile.length > 0)) {
        this.loading = true;
        this.showSpin();
        const { data } = await this.$axios.$post('images/sale', {
          images: {
            pc: pc && pc.length > 0 ? pc[0]['image'] : '',
            mobile: mobile && mobile.length > 0 ? mobile[0]['image'] : ''
          },
          texts: [
            `面向市场:  ${this.selectedMarket}`,
            `主推产品:  ${this.selectedProduct}`,
            `模板:  ${title}`
          ],
        });
        const { url } = data;
        this.loading = false;
        this.$Spin.hide();
        this.downloadModal = true;
        this.jpgDownloadUrl = url;
        this.$Modal.success({
          title: '请下载后联系销售',
          content: `<a class="ivu-btn ivu-btn-success" href=${url} style="font-size: 16px;">
                    下载
                  </a>`
        });
      }

    },
    goBack() {
      // const url = `${this.$config.client}${this.localePath({ name: 'contact' })}`;
      const localUrl = this.localePath('sale');
      this.setTemplate('');
      this.$router.push(localUrl);
    },
    ...mapMutations({
      setTemplate: 'sale/setTemplate'
    })
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
