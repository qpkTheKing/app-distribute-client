<template>
  <article class="tfs-article">
    <h1>下载APP</h1>
    <hr>
    <p>这个是下载APP的展示案例页面，该页面使用流量统计下载信息。</p>
    <p>此外还有通过次数限制下载信息的页面。</p>
    <div class="tfs-form-wrapper">
      <Form :model="formData" :label-width="60">
        <Form-item label="文件名">
          <Input v-model="formData.fileName"></Input>
        </Form-item>
        <Form-item label="下载地址">
          <Input v-model="formData.downloadUrl">
            <span slot="prepend">http://127.0.0.1:1080/files/</span>
          </Input>
        </Form-item>
        <Form-item label="下载密钥">
          <Input v-model="formData.token"></Input>
        </Form-item>
        <div v-if="prepare">
          <Alert show-icon>
            服务器正在生成文件链接
            <span slot="desc">文件下载即将开始, 请耐心等待.</span>
          </Alert>
        </div>
        <div v-if="downloading">
          <Form-item label="进度">
            <Progress :percent="progress" status="active"></Progress>
          </Form-item>
        </div>
        <Form-item>
          <Button v-on:click="handleAJAXDownload" type="primary" shape="circle" :loading="downloading">下载 for IE</Button>
          <Button v-on:click="handleSocketDownload" type="info" shape="circle" :loading="downloading">下载 for Chrome</Button>
          <Button v-on:click="handleSocketDownload" type="warning" shape="circle">生成二维码</Button>
        </Form-item>
      </Form>
    </div>
  </article>
</template>

<script>

export default {
  data() {
    return {
      downloading: false,
      prepare: false,
      progress: 0,
      formData: {
        email: 'stoneli88@126.com',
        fileName: 'weixin7017android1720_arm64.apk',
        downloadUrl: 'd6e30c110fc975d1b1f1790e7535f9ef',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjJlMWNjMDIxYmFmMDI5ZTRlODM0MzAiLCJpYXQiOjE1OTY4NTc1MzZ9.8wpNgDE8uWoiB0GuS87PGFa5jc2KQHkNqyUxlbtyfqM'
      }
    }
  },
  methods: {
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
    _downloadBySocket() {
      const socket = io.connect(`http://127.0.0.1:4000/files?token=${this.formData.token}&email=${this.formData.email}`);
      let fileBlobs = [];
      let sizeDownloaded = 0;
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
        this._createBlobLink(fileBlob, this.formData.fileName);
        this.$Notice.success({
          top: 50,
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
      socket.emit('APP-NEED-DELIVERY', {
        fileHash: this.formData.downloadUrl,
        fileName: this.formData.fileName,
        type: "apk"
      }, data => {
        if (data === 'APP-BEGIN-DELIVERY') {
          // 扣除流量
          this.downloading = true;
        }
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
</style>
