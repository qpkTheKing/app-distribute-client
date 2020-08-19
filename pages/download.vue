<template>
  <article class="tfs-article">
    <Row>
      <Col span="8">
        <img :src="icon" alt="" width="100" />
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
          v-on:click="handleSocketDownload"
        >
          下载
        </Button>
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <p style="font-size: 16px;">
          WeChat 不只是一款優秀的通訊及社交應用軟體，更是全球超過 10 億用戶都離不開的生活方式。透過 WeChat，你不僅能用文字訊息、語音、影片、貼圖等多種方式與好友隨時保持聯繫；你還能瀏覽數百萬個官方帳號和小程式，並從中獲得大量的優質資訊與服務；你也可以與好友在 WeChat 遊戲世界裡並肩作戰、一同闖關；你更可以透過 WeChat Pay，體驗領先全球的行動支付，享受其帶來的便利生活。
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
    const { download, fileName, appId, appName, icon, version, email, size  } = downloadInfo

    return { fileName, downloadUrl:  download, appId, appName, icon, version, email, size}
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
      const converted = bytes / (1024*1024);
      return roundTo ? converted.toFixed(roundTo) : converted;
    },
    _createBlobLink(blobData, fileName) {
      if (typeof window.chrome !== 'undefined') {
        // Chrome version
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blobData);
        link.download = fileName;
        link.click();
      } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
        // IE version
        const blob = new Blob([blobData], { type: 'application/force-download' });
        window.navigator.msSaveBlob(blob, fileName);
      } else {
        // Firefox version
        const file = new File([blobData], fileName, { type: 'application/force-download' });
        window.open(URL.createObjectURL(file));
      }
    },
    _downloadByAJAX() {
      const req = new XMLHttpRequest();
      const downloadUrl = `http://127.0.0.1:1080/files/${this.formData.downloadUrl}`
      // -- begin download ---//
      req.open('get', downloadUrl, true);
      // 扣除流量
      this.downloading = true;
      req.addEventListener('progress', evt => {
        if (evt.lengthComputable) {
          const percentComplete = (evt.loaded / evt.total) * 100;
          this.progress = Math.round(percentComplete);
        }
      }, false)
      req.responseType = 'blob'
      req.onreadystatechange = () => {
        if (req.readyState === 4 && req.status === 200) {
          this.$Notice.success({
            top: 50,
            title: '文件下载本地完成',
            desc: '正在保存为本地文件.'
          });
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(req.response);
          link.download = this.formData.fileName;
          link.click();
          this.downloading = false;
          this.progress = 0;
        }
      }
      req.send()
    },
    async _downloadBySocket() {
      const socket = io.connect(`http://127.0.0.1:4000/files`);
      let fileBlobs = [];
      let sizeDownloaded = 0;
      const { data } = await this.$axios.$get(`quota?email=${this.email}`);
      if (parseFloat(data) < this._toMb(this.size, 2)) {
        this.$Notice.error({
          top: 100,
          title: '无法下载',
          desc: '请联系应用开发商购买更多流量.'
        })
      } else {
        socket.emit('APP-NEED-DELIVERY', {
          appId: this.appId,
          fileId: location.search.split('=')[1]
        }, async data => {
          if (data === 'APP-BEGIN-DELIVERY') {
            // 扣除流量
            this.downloading = true;
            await this.$axios.$post('quota', {
              usedQuota: this._toMb(this.size, 2),
              email: this.email
            });
          }
        })
      }
      socket.on('error', error => {
        this.downloading = false;
        this.prepare = false;
        this.progress = 0;
        socket.disconnect();
      });
      socket.on('APP-END-DELIVERY-ERROR', () => {
        this.downloading = false;
        this.prepare = false;
        socket.disconnect();
      })
      socket.on('APP-DELIVERY-TRUNK', (payload, fn) => {
        const { number, size, totalSize, data } = payload;
        sizeDownloaded += size;
        const percentComplete = (sizeDownloaded / totalSize) * 100;
        this.progress = Math.round(percentComplete);
        fn({ message: 'APP-DELIVERY-TRUNK-SUCCESS', trunkNumber: number });
        fileBlobs.push(data);
      })
      socket.on('APP-END-DELIVERY', () => {
        const fileBlob = new Blob(fileBlobs, { type: 'application/force-download' });
        this._createBlobLink(fileBlob, this.fileName);
        this.$Notice.success({
          top: 100,
          title: '文件下载本地完成',
          desc: '正在保存为本地文件.'
        });
        setTimeout(() => {
          this.downloading = false;
          this.prepare = false;
          this.progress = 0;
        }, 1000);
        socket.close();
        socket.disconnect();
      })
    },
    handleAJAXDownload(event) {
      event.preventDefault()
      this._downloadByAJAX()
    },
    handleSocketDownload(event) {
      event.preventDefault()
      this._downloadBySocket()
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
