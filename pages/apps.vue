<template>
  <article class="tfs-article">
    <Row>
      <Col span="4">
        <h1>{{ $t('MY_DISTRIBUTION_APPS') }}</h1>
      </Col>
      <Col span="20" style="text-align: right;">
        <Button type="primary" icon="md-cloud-upload" v-on:click="navToUpload">{{ $t('NEW_UPLOAD') }}</Button>
      </Col>
    </Row>
    <hr />
    <Row style="margin-top: 10px;">
      <Col span="4">
        <Select v-model="platform" disabled placeholder="">
          <Option v-for="item in allPlatform" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Col>
      <Col span="8" style="padding: 0 10px;">
        <Input v-model="keyword" placeholder="" disabled />
      </Col>
      <Col span="6" style="text-align: right;">
        <p>{{ $t('DOWNLOAD_QUOTA') }}</p>
        <p style="font-size: 16px; font-weight: bolder;color: #ff9900;">{{ me.quota }} Mb</p>
      </Col>
      <Col span="6" style="text-align: right;">
        <p>{{ $t('DOWNLOAD_FREE_QUOTA_TODAY') }}</p>
        <p style="font-size: 16px; font-weight: bolder;color: #ed4014;">0 M</p>
      </Col>
    </Row>
    <Table :columns="columns" :data="appFiles" :no-data-text="$t('PKG_NOT_FOUND')">
      <template slot-scope="{ row, index }" slot="icon">
        <img :src="appInfo.icon" alt="" width="40" style="margin-top: 5px;" />
      </template>
      <template slot-scope="{ row, index }" slot="forDownload">
        <div v-if="row.forDownload === 'TRUE'">{{ $t('PKG_CURRENT_STATUS') }}</div>
        <template v-else>未启用</template>
      </template>
      <template slot-scope="{ row, index }" slot="downloadUrl">
        <div :id="`downloadQRCode-${row.hashId}`" style="display: none;" class="qrcodeWrapper"></div>
        <tooltip placement="top" max-width="500" transfer :content="`${$config.client}${localePath({ name: 'download', query: { file: row.hashId } })}`">
          <Button size="large" icon="md-link" v-clipboard:copy="`${$config.client}${localePath({ name: 'download', query: { file: row.hashId } })}`"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"></Button>
        </tooltip>
        <Button size="large" icon="md-qr-scanner"
                v-on:click="qrCode(`${$config.client}${localePath({ name: 'download', query: { file: row.hashId } })}`, `downloadQRCode-${row.hashId}`)"></Button>
      </template>
    </Table>
  </article>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  async asyncData(ctx) {
    const { query, $axios } = ctx;
    const { data: appFiles } = await $axios.$get(`app/files?appId=${query.appId}`);
    const { data: me } = await $axios.$get(`me`);
    const { data: appInfo } = await $axios.$get(`app?appId=${query.appId}`);

    return { appFiles, appId: query.appId, me, appInfo: appInfo[0] };
  },
  middleware: 'auth',
  computed: {
    ...mapGetters(['loggedInUser'])
  },
  data() {
    return {
      platform: '',
      keyword: '',
      clipboard: {
        message: '复制成功'
      },
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
          title: `${this.$t('PKG_ICON')}`,
          slot: 'icon',
          width: '120'
        },
        {
          title: `${this.$t('PKG_NAME')}`,
          key: 'name',
          tooltip: true
        },
        {
          title: `${this.$t('PKG_VISITED')}`,
          align: 'center',
          key: 'downloadTimes',
          width: '110'
        },
        {
          title: `${this.$t('PKG_DOWNLOAD_LINK')}/${this.$t('PKG_QRCODE')}`,
          align: 'center',
          slot: 'downloadUrl'
        },
        {
          title: `${this.$t('PKG_STATUS')}`,
          slot: 'forDownload',
          width: '110'
        },
        {
          title: `${this.$t('PKG_OPERATION')}`,
          key: 'action',
          align: 'center',
          width: '320',
          render: (h, params) => {
            const { row } = params;
            return h('div', [
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    const fileUrl = this.localePath({ name: 'download', query: { file: row.hashId } });
                    window.open(`${this.$config.client}${fileUrl}`, '_blank');
                  }
                }
              }, `${this.$t('PKG_BTN_PREVIEW')}`),
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    const { _id } = row;
                    this.changeFileId(_id);
                    this.changeRoute('upload');
                    const url = this.localePath({ name: 'upload', query: { appId: this.appId, fileId: _id } });
                    this.$router.push(url);
                  }
                }
              }, `${this.$t('PKG_BTN_UPDATE')}`),
              h('Button', {
                props: {
                  type: 'info',
                  size: 'small'
                },
                on: {
                  click: () => {
                    const { hashId } = row;
                    this._download(hashId);
                  }
                }
              }, `${this.$t('PKG_BTN_DOWNLOAD')}`)
            ]);
          }
        }
      ]
    };
  },
  methods: {
    _download(fileHash) {
      this.$Notice.success({
        top: 50,
        title: `${this.$t('APP_DOWNLOAD_BEGIN')}`,
        desc: `${this.$t('APP_DOWNLOAD_TIP')}`
      });
      const link = document.createElement('a');
      link.href = `${this.$config.downloadServer}/${fileHash}`;
      link.download = this.fileName;
      link.click();
    },
    ...mapMutations({
      changeRoute: 'global/changeRoute',
      changeFileId: 'global/changeFileId',
      changeRole: 'global/setCurrentRole'
    }),
    onCopy: function(e) {
      this.$Message.success(`${this.$t('APP_URL_COPY')}!`);
    },
    onError: function(e) {
      // this.$Message.error(`复制到剪切板出现问题，请检查浏览器设置.`)
    },
    navToUpload() {
      this.$router.push(this.localePath({ name: 'upload', query: { appId: this.appId } }));
    },
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
      });
    }
  },
  components: {}
};
</script>
<style scoped>
.qrcodeWrapper {
  display: block;
  width: 100px;
  margin: 10px 50px;
}
</style>
