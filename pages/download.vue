<template>
  <article class="tfs-article">
    <div v-if="isMobile">
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
            {{ description }}
          </p>
        </Col>
      </Row>
    </div>
    <div v-else class="tfs-article-center">
      <p style="font-size: 14px">请用手机扫描二维码下载</p>
      <h1>{{ appName }}</h1>
      <div id="tfs-download-qrcode"></div>
    </div>
  </article>
</template>

<script>

export default {
  layout: 'download',
  async asyncData(ctx) {
    const { query, $axios } = ctx
    const { data: downloadInfo } = await $axios.$get(`download?fileHash=${query.file}`)
    const { fileName, appId, appName, icon, version, email, size, fileHash, description } = downloadInfo

    return { fileName, fileHash, appId, appName, icon, version, email, size, description }
  },
  data() {
    return {
      isMobile: false,
      downloading: false,
      prepare: false,
      progress: 0
    }
  },
  mounted() {
    // 增加对当前浏览器的判断
    this.isMobile = this._mobileCheck();
    if (this._mobileCheck()) {

    } else {
      const downloadUrl = `${this.$config.client}/download?file=${this.fileHash}`
      this.qrCode(downloadUrl, 'tfs-download-qrcode')
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
    _mobileCheck() {
      let check = false;
      (function(a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true
      })(navigator.userAgent || navigator.vendor || window.opera)
      return check
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
    _blobLink(blob) {
      const link = document.createElement('a')
      const url = window.URL.createObjectURL(blob)
      link.style.display = 'none'
      link.href = url
      link.download = this.fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    },
    _base64Link(blob) {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(blob)
      fileReader.onload = function() {
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = this.result
        a.download = name
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
    },
    async _downloadByBrowser() {
      this.downloading = true
      this.progress = 100
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
        link.href = `${this.$config.downloadServer}/${this.fileHash}`
        link.download = this.fileName
        link.click()
        this.downloading = false
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
          this._blobLink(req.response)
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
        // this._downloadByAJAX()
      } else if (this._browser().ucWeb) {
        this._downloadByBrowser()
        // this._downloadByAJAX()
      } else if (this._browser().QQ && !this._browser().QQbrw) {
        this.$Message.warning('请复制地址到外部浏览器打开进行下载.')
      } else {
        // this._downloadByAJAX()
        this._downloadBySocket()
      }
    },
    qrCode(url, elementId) {
      const element = document.getElementById(elementId)
      this.$nextTick(() => {
        // element.style.display = element.style.display === 'none' ? 'block' : 'none'
        element.innerHTML = ''
        new window.QRCode(elementId, {
          text: url,
          width: 300,
          height: 300,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H
        })
      })
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

#tfs-download-qrcode {
  width: 300px;
  height: 300px;
  margin: 0 auto;
  border-radius: 5px;
  border: 1px solid #dedede;
}

.tfs-article-center {
  width: 100%;
  margin: 0 auto;
  text-align: center;
}
</style>
