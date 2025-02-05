<template>
  <article class="tfs-article">
    <div v-if="current !== undefined">
      <Row
        style="background: aliceblue; border-radius: 0.5rem;"
        class="tfs-download-info-resp"
      >
        <Col
          :xs="24"
          :sm="24"
          :md="12"
          :lg="12"
          class="sm-text-center"
          style="margin-bottom: 20px;"
        >
          <Row>
            <Col :xs="24" :sm="24" :md="8" :lg="8">
              <img :src="current.icon" alt="" width="100" />
              <span
                v-if="current.fType !== 'apk'"
                style="
                  display: block;
                  font-size: 1.5rem;
                  margin-bottom: 0.5rem;
                "
                >{{ appName }}</span
              >
            </Col>
            <Row style="margin-top: 15px; margin-bottom: 15px;">
              <Col span="24" class="tLeft-md tCenter-sm">
                <h1 class="hidden-sm" style="font-size: 16px;">
                  {{ appName }}
                </h1>
                <Button
                  type="success"
                  style="width: 150px; height: 30px; margin-top: 10px;"
                  :loading="downloading"
                  v-on:click="handleDownload"
                >
                  <Icon style="font-size: 14px;" type="md-cloud-download" />
                  {{ $t('PKG_BTN_DOWNLOAD') }}
                </Button>
              </Col>
            </Row>
            <Col :xs="24" :sm="24" :md="16" :lg="16">
              <div
                style="margin-bottom: 5px;"
                v-if="current.fType !== 'mobile-config'"
              >
                {{ $t('PKG_VERSION') }}: {{ current.version }}
              </div>
              <div>
                {{ $t('PKG_LAST_UPDATE') }}:
                {{ formattedUpdate }}
              </div>
            </Col>
          </Row>
        </Col>
        <Divider style="margin: 20px 0;" class="hidden-md">{{
          $t('APP_TIP_DOWNLOAD')
        }}</Divider>
        <Col :xs="24" :sm="24" :md="12" :lg="12">
          <p style="font-size: 14px;" class="hidden-sm">
            {{ $t('APP_TIP_DOWNLOAD') }}
          </p>
          <div id="tfs-download-qrcode" class="tLeft-md tCenter-sm"></div>
        </Col>
      </Row>
      <Divider style="margin: 20px 0; display: none;">应用截图</Divider>
      <Row style="display: none;">
        图片栏
      </Row>
      <Divider style="margin: 20px 0;">{{ $t('PKG_DESCRIPTION') }}</Divider>
      <Row>
        <Col span="24">
          <p style="font-size: 16px;">
            {{ current.description }}
          </p>
        </Col>
      </Row>
    </div>
  </article>
</template>

<script>
import dayjs from 'dayjs';

export default {
  layout: 'download',
  async asyncData(ctx) {
    let iosDownloadUrl = '1';
    const { query, $axios } = ctx;
    const { h: appId } = query;
    const { data: infos } = await $axios.$get(`download/app?appId=${appId}`);
    const { files, appName, email } = infos;

    const android = files.filter((file) => file.fType === 'apk')[0];
    const iosMC = files.filter((file) => file.fType !== 'apk')[0];

    return {
      appId,
      appName,
      email,
      android,
      iosMC,
    };
  },
  data() {
    return {
      email: '',
      appName: '',
      appId: '',
      formattedUpdate: '',
      android: undefined,
      iosMC: undefined,
      current: undefined,
      isMobile: false,
      downloading: false,
      prepare: false,
      progress: 0,
    };
  },
  head() {
    return {
      title: `${this.appName}`,
      script: [
        {
          hid: 'gtag',
          src: 'https://www.googletagmanager.com/gtag/js?id=UA-100724095-1',
          async: true,
          defer: true,
        },
      ],
    };
  },
  mounted() {
    const url = this.localePath({
      name: 'go',
      query: { h: this.appId },
    });
    const downloadUrl = `${this.$config.client}${url}`;
    let mqlSM = window.matchMedia('(max-width: 767px)');
    let mqlMD = window.matchMedia('(min-width: 767px)');

    // Add Google Analytics
    window.dataLayer = window.dataLayer || [];

    function gtag() {
      dataLayer.push(arguments);
    }

    gtag('js', new Date());

    gtag('config', 'UA-100724095-1');

    // SET Pakcage.
    if (this._browser().android) {
      this.current = this.android;
    }
    if (this._browser().ios) {
      this.current = this.iosMC;
    }
    if (mqlSM.matches && this.current) {
      setTimeout(
        () => this.qrCode(downloadUrl, 'tfs-download-qrcode', 100),
        500
      );
    }
    if (mqlMD.matches && this.current) {
      setTimeout(
        () => this.qrCode(downloadUrl, 'tfs-download-qrcode', 180),
        500
      );
    }
    this.formattedUpdate = this.current
      ? dayjs(this.current.updated).format('YYYY-MM-DD HH:mm:ss')
      : '';
  },
  methods: {
    _toMb(bytes, roundTo) {
      const converted = bytes / (1024 * 1024);
      return roundTo ? converted.toFixed(roundTo) : converted;
    },
    _browser() {
      const u = navigator.userAgent;
      const ua = navigator.userAgent.toLocaleLowerCase();
      const app = navigator.appVersion;
      return {
        trident: u.indexOf('Trident') > -1, // IE内核
        presto: u.indexOf('Presto') > -1, // opera内核
        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, // 火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), // 是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // IOS终端
        android: u.indexOf('Android') > -1 || u.indexOf('Mac') > -1, // 安卓终端
        iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, // 是否为iphone或QQHD浏览器
        iPad: u.indexOf('iPad') > -1, // 是否为iPad
        webApp: u.indexOf('Safari') === -1, // 是否web应用程序，没有头部与底部
        QQbrw: u.indexOf('MQQBrowser') > -1, // QQ浏览器
        weiXin: u.indexOf('MicroMessenger') > -1, // 微信
        QQ: ua.match(/QQ/i) === 'qq', // QQ
        weiBo: ua.match(/WeiBo/i) === 'weibo', // 微博
        ucLowEnd: u.indexOf('UCWEB7.') > -1, //
        ucSpecial: u.indexOf('rv:1.2.3.4') > -1,
        webview:
          !(u.match(/Chrome\/([\d.]+)/) || u.match(/CriOS\/([\d.]+)/)) &&
          u.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),
        ucWeb: (function () {
          try {
            return (
              parseFloat(
                u
                  .match(/ucweb\d+\.\d+/gi)
                  .toString()
                  .match(/\d+\.\d+/)
                  .toString()
              ) >= 8.2
            );
          } catch (e) {
            return u.indexOf('UC') > -1;
          }
        })(),
        Symbian: u.indexOf('Symbian') > -1,
        ucSB: u.indexOf('Firefox/1.') > -1,
      };
    },
    async _downloadByBrowser() {
      this.downloading = true;
      this.progress = 100;
      if (this.current.fType === 'mobile-config') {
        this.$Notice.success({
          top: 50,
          title: this.$t('APP_DOWNLOAD_BEGIN'),
          desc: this.$t('APP_DOWNLOAD_TIP'),
        });
        const link = document.createElement('a');
        link.href = this.current.downloadUrl;
        link.download = this.current.fileName;
        link.click();
        this.downloading = false;
      } else {
        const isQuotaFull = await this._isQuotaFull();
        if (isQuotaFull) {
          await this.$axios.$post('quota', {
            usedQuota: this._toMb(this.current.size, 2),
            email: this.email,
          });
          this.$Notice.success({
            top: 50,
            title: this.$t('APP_DOWNLOAD_BEGIN'),
            desc: this.$t('APP_DOWNLOAD_TIP'),
          });
          const link = document.createElement('a');
          link.href = `${this.$config.downloadServer}/${this.fileHash}-${this.fileName}`;
          link.download = this.current.fileName;
          link.click();
          this.downloading = false;
        }
      }
    },
    async _isQuotaFull() {
      const { data } = await this.$axios.$get(`quota?email=${this.email}`);
      if (parseFloat(data) < this._toMb(this.size, 2)) {
        this.$Notice.error({
          top: 100,
          title: this.$t('DOWNLOAD_TIP_UNABLE_DOWNLOAD'),
          desc: this.$t('DOWNLOAD_TIP_DESC'),
        });
        return false;
      }
      return true;
    },
    handleDownload(event) {
      event.preventDefault();
      if (this._browser().weiXin) {
        this.$Message.warning(this.$t('APP_DOWNLOAD_INCOM_TIP'));
      } else if (this._browser().QQbrw) {
        this._downloadByBrowser();
      } else if (this._browser().ucWeb) {
        this._downloadByBrowser();
      } else if (this._browser().QQ && !this._browser().QQbrw) {
        this.$Message.warning(this.$t('APP_DOWNLOAD_INCOM_TIP'));
      } else {
        this._downloadByBrowser();
      }
    },
    qrCode(url, elementId, size) {
      const element = document.getElementById(elementId);
      this.$nextTick(() => {
        // element.style.display = element.style.display === 'none' ? 'block' : 'none'
        element.innerHTML = '';
        new window.QRCode(elementId, {
          render: 'table',
          text: url,
          width: size,
          height: size,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H,
        });
      });
    },
  },
  components: {},
};
</script>

<style scoped>
p {
  margin: 10px 0;
}

.tfs-article {
  padding: 10px 15px;
}

#tfs-download-qrcode {
  width: 300px;
  height: 300px;
  margin: 0 auto;
  border-radius: 5px;
  border: 1px solid #dedede;
  padding: 10px;
  background: #fff;
}

@media (max-width: 767px) {
  #tfs-download-qrcode {
    width: 120px;
    height: 120px;
  }

  .tfs-download-info-resp {
    padding: 1rem 0;
  }
}

@media (min-width: 768px) {
  #tfs-download-qrcode {
    width: 200px;
    height: 200px;
    text-align: left;
    margin: 10px 0;
    padding: 10px;
    background: #fff;
  }

  .tfs-download-info-resp {
    width: 47rem;
    margin: 0 auto;
    padding: 1rem 1.5rem;
  }
}

.tfs-article-center {
  width: 100%;
  margin: 0 auto;
  text-align: center;
}
</style>
