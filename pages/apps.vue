<template>
  <article class="tfs-article">
    <h1>我的分发应用</h1>
    <hr/>
    <Row style="margin-top: 10px;">
      <Col span="4">
        <Select v-model="platform">
          <Option v-for="item in allPlatform" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Col>
      <Col span="8" style="padding: 0 10px;">
        <Input v-model="keyword" placeholder="输入文件名称"/>
      </Col>
      <Col span="6" style="text-align: right;">
        <p>付费剩余下载流量</p>
        <p style="font-size: 16px; font-weight: bolder;color: #ff9900;">{{ me.quota }} Mb</p>
      </Col>
      <Col span="6" style="text-align: right;">
        <p>今天剩余免费下载流量</p>
        <p style="font-size: 16px; font-weight: bolder;color: #ed4014;">0 M</p>
      </Col>
    </Row>
    <Table :columns="columns" :data="appFiles" no-data-text="您还没上传APP">
      <template slot-scope="{ row, index }" slot="icon">
        <img :src="appInfo.icon" alt="" width="40" style="margin-top: 5px;"/>
      </template>
      <template slot-scope="{ row, index }" slot="forDownload">
        <div v-if="row.forDownload === 'TRUE'">正常</div>
        <template v-else>未启用</template>
      </template>
      <template slot-scope="{ row, index }" slot="downloadUrl">
        <div :id="'downloadQRCode'+ '-' + row.hashId" style="display: none;" class="qrcodeWrapper"></div>
        <Button type="dashed" size="large" icon="md-qr-scanner"
                v-on:click="qrCode(`${$config.client}/download?file=${row.hashId}`, `downloadQRCode-${row.hashId}`)"></Button>
      </template>
    </Table>
  </article>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  async asyncData(ctx) {
    const { query, $axios } = ctx
    const { data: appFiles } = await $axios.$get(`app/files?appId=${query.appId}`)
    const { data: me } = await $axios.$get(`me`)
    const { data: appInfo } = await $axios.$get('app')

    return { appFiles, appId: query.appId, me, appInfo: appInfo[0] }
  },
  middleware: 'auth',
  computed: {
    ...mapGetters(['loggedInUser'])
  },
  data() {
    return {
      platform: '',
      keyword: '',
      allPlatform: [
        {
          value: 'Android',
          label: '适配安卓机型'
        },
        {
          value: 'ios',
          label: '适配苹果机型 '
        },
        {
          value: 'WPhone',
          label: '适配Windows Phone'
        }],
      columns: [
        {
          title: '图标',
          slot: 'icon',
          width: '60'
        },
        {
          title: '文件名',
          key: 'name',
          tooltip: true
        },
        {
          title: '浏览次数',
          align: 'center',
          key: 'downloadTimes',
          width: '90'
        },
        {
          title: '下载链接/二维码',
          align: 'center',
          slot: 'downloadUrl',
        },
        {
          title: '状态',
          slot: 'forDownload',
          width: '60'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.$Message.warning('正在实现中...');
                  }
                }
              }, '查看'),
              h('Button', {
                props: {
                  type: 'info',
                  size: 'small'
                },
                style: {
                  marginLeft: '5px'
                },
                on: {
                  click: () => {
                    this.$Message.warning('正在实现中...');
                  }
                }
              }, '下载')
            ])
          }
        }
      ]
    }
  },
  methods: {
    qrCode(url, elementId) {
      const element = document.getElementById(elementId);
      this.$nextTick(() => {
        element.style.display = element.style.display === 'none' ? 'block' : 'none';
        element.innerHTML = '';
        new window.QRCode(elementId, {
          text: url,
          width: 100,
          height: 100,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H
        });
      })
    }
  },
  components: {}
}
</script>
<style scoped>
.qrcodeWrapper {
  display: block;
  width: 100px;
  margin: 10px 60px;
}
</style>
