<template>
  <article class="tfs-article">
    <Row>
      <Col span="8">
        <img :src="icon" alt="" width="100"/>
      </Col>
      <Col span="16">
        <div style="font-size: 24px;font-weight: bolder;margin-bottom: 10px;">{{ appName }}</div>
        <div>{{ appName }} 通讯</div>
      </Col>
    </Row>
    <Row style="margin: 15px 31%;text-align: center;" v-if="downloading">
      <Col span="8">
        <i-circle :percent="progress">
          <span class="demo-Circle-inner" style="font-size:24px">{{ progress }}</span>
        </i-circle>
      </Col>
    </Row>
    <Row style="margin-top: 15px;margin-bottom: 15px;">
      <Col span="24">
        <Button
          size="large"
          icon="ios-download-outline"
          type="primary"
          long
          style="height: 50px;"
          :loading="downloading"
          v-on:click="handleDownload"
        >
          下载
        </Button>
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <p style="font-size: 16px;">
          WeChat 不只是一款優秀的通訊及社交應用軟體，更是全球超過 10 億用戶都離不開的生活方式。透過
          WeChat，你不僅能用文字訊息、語音、影片、貼圖等多種方式與好友隨時保持聯繫；你還能瀏覽數百萬個官方帳號和小程式，並從中獲得大量的優質資訊與服務；你也可以與好友在 WeChat
          遊戲世界裡並肩作戰、一同闖關；你更可以透過 WeChat Pay，體驗領先全球的行動支付，享受其帶來的便利生活。
        </p>
      </Col>
    </Row>
  </article>
</template>

<script>

export default {
  layout: 'download',
  async asyncData(ctx) {
    const { query, $axios } = ctx
    const { data: downloadInfo } = await $axios.$get(`download?fileHash=${query.file}`)
    const { download, fileName, appId, appName, icon, version, email, size, fileHash } = downloadInfo

    return { fileName, fileHash, downloadUrl: download, appId, appName, icon, version, email, size }
  },
  data() {
    return {
      downloading: false,
      prepare: false,
      progress: 0
    }
  },
  methods: {
    _toMb(bytes, roundTo) {
      const converted = bytes / (1024 * 1024)
      return roundTo ? converted.toFixed(roundTo) : converted
    },
    _browser() {
      const u = navigator.userAgent
      const ua = navigator.userAgent.toLocaleLowerCase()
      const app = navigator.appVersion
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
        webview: !(u.match(/Chrome\/([\d.]+)/) || u.match(/CriOS\/([\d.]+)/)) && u.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),
        ucWeb: function() {
          try {
            return parseFloat(u.match(/ucweb\d+\.\d+/gi).toString().match(/\d+\.\d+/).toString()) >= 8.2
          } catch (e) {
            return u.indexOf('UC') > -1
          }
        }(),
        Symbian: u.indexOf('Symbian') > -1,
        ucSB: u.indexOf('Firefox/1.') > -1
      }
    },
    _createBlobLink(blobData, fileName) {
      if (this._browser().weiXin) {
        this.$Message.warning('请复制地址到外包浏览器进行下载.')
      } else if (this._browser().ucSB) {
        const file = new File([blobData], fileName, { type: 'application/force-download' })
        window.open(URL.createObjectURL(file))
      } else {
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blobData)
        link.download = fileName
        link.click()
      }
    },
    async _downloadByBrowser() {
      this.downloading = true;
      this.progress = 100;
      const isQuotaFull = await this._isQuotaFull()
      if (isQuotaFull) {
        await this.$axios.$post('quota', {
          usedQuota: this._toMb(this.size, 2),
          email: this.email
        })
        this.$Notice.success({
          top: 50,
          title: '文件下载即将开始',
          desc: '请关注浏览器下方是否弹出文件下载提醒.'
        })
        const link = document.createElement('a')
        link.href = `${this.$config.downloadServer}/${this.fileHash}`;
        link.download = this.fileName
        link.click()
        this.downloading = false;
      }
    },
    async _isQuotaFull() {
      const { data } = await this.$axios.$get(`quota?email=${this.email}`)
      if (parseFloat(data) < this._toMb(this.size, 2)) {
        this.$Notice.error({
          top: 100,
          title: '无法下载',
          desc: '请联系应用开发商购买更多流量.'
        })
        return false
      }
      return true
    },
    async _downloadByAJAX() {
      const req = new XMLHttpRequest()
      const downloadUrl = `${this.$config.downloadServer}/${this.fileHash}`
      // -- begin download ---//
      req.open('get', downloadUrl, true)
      this.downloading = true
      // 扣除流量
      const isQuotaFull = await this._isQuotaFull()
      req.addEventListener('progress', evt => {
        if (evt.lengthComputable) {
          const percentComplete = (evt.loaded / evt.total) * 100
          this.progress = Math.round(percentComplete)
        }
      }, false)
      req.responseType = 'blob'
      req.onreadystatechange = async () => {
        if (req.readyState === 4 && req.status === 200) {
          this.$Notice.success({
            top: 50,
            title: '文件下载本地完成',
            desc: '正在保存为本地文件.'
          })
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(req.response)
          link.download = this.fileName
          link.click()
          this.downloading = false
          this.progress = 0
        }
      }
      if (isQuotaFull) {
        req.send()
        await this.$axios.$post('quota', {
          usedQuota: this._toMb(this.size, 2),
          email: this.email
        })
      }
    },
    async _downloadBySocket() {
      const socket = io.connect(`${this.$config.socketServer}/files`)
      let fileBlobs = []
      let sizeDownloaded = 0
      const isQuotaFull = await this._isQuotaFull()
      if (isQuotaFull) {
        socket.emit('APP-NEED-DELIVERY', {
          appId: this.appId,
          fileId: location.search.split('=')[1]
        }, async data => {
          if (data === 'APP-BEGIN-DELIVERY') {
            // 扣除流量
            this.downloading = true
            await this.$axios.$post('quota', {
              usedQuota: this._toMb(this.size, 2),
              email: this.email
            })
          }
        })
      }
      socket.on('error', error => {
        this.downloading = false
        this.prepare = false
        this.progress = 0
        socket.disconnect()
      })
      socket.on('APP-END-DELIVERY-ERROR', () => {
        this.downloading = false
        this.prepare = false
        socket.disconnect()
      })
      socket.on('APP-DELIVERY-TRUNK', (payload, fn) => {
        const { number, size, totalSize, data } = payload
        sizeDownloaded += size
        const percentComplete = (sizeDownloaded / totalSize) * 100
        this.progress = Math.round(percentComplete)
        fn({ message: 'APP-DELIVERY-TRUNK-SUCCESS', trunkNumber: number })
        fileBlobs.push(data)
      })
      socket.on('APP-END-DELIVERY', () => {
        const fileBlob = new Blob(fileBlobs, { type: 'application/force-download' })
        this._createBlobLink(fileBlob, this.fileName)
        this.$Notice.success({
          top: 100,
          title: '文件下载本地完成',
          desc: '正在保存为本地文件.'
        })
        setTimeout(() => {
          this.downloading = false
          this.prepare = false
          this.progress = 0
        }, 1000)
        socket.close()
        socket.disconnect()
      })
    },
    handleDownload(event) {
      event.preventDefault()
      if (this._browser().weiXin) {
        this.$Message.warning('请复制地址到外部浏览器打开进行下载.')
      } else if (this._browser().QQbrw) {
        this._downloadByBrowser()
      } else if (this._browser().ucWeb) {
        this._downloadByBrowser()
      } else if (this._browser().QQ && !this._browser().QQbrw) {
        this.$Message.warning('请复制地址到外部浏览器打开进行下载.')
      } else {
        this._downloadBySocket()
      }
    }
  },
  components: {}
}
</script>

<style scoped>
p {
  margin: 10px 0;
}

.tfs-article {
  padding: 10px 15px;
}
</style>
