<template>
  <article class="tfs-article">
    <h1>上传文件</h1>
    <hr>
    <div class="tfs-form-wrapper">
      <Form :model="formData" :label-width="80">
        <Form-item label="平台:">
          <Radio-group v-model="formData.phone">
            <Radio label="apple" disabled>Apple</Radio>
            <Radio label="android">Android</Radio>
          </Radio-group>
        </Form-item>
        <Form-item label="文件指纹:">
          <Input v-model="formData.fileFingerPrint" placeholder="上传文件后显示" style="width: 300px" readonly disabled></Input>
        </Form-item>
        <Form-item label="文件名:">
          <Input v-model="formData.fileName" placeholder="上传文件后显示" style="width: 300px" readonly disabled></Input>
        </Form-item>
        <Form-item label="大小:">
          <Input v-model="formData.fileSize" placeholder="上传文件后显示" style="width: 300px" readonly disabled></Input>
        </Form-item>
        <Form-item label="文件:">
          <Upload
            type="drag"
            :before-upload="handleFileUpload"
            action="">
            <div style="padding: 20px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>点击或将文件拖拽到这里上传</p>
            </div>
          </Upload>
        </Form-item>
        <Form-item label="上传进度:">
          <Progress :percent="formData.uploadProgress" status="active"></Progress>
        </Form-item>
      </Form>
    </div>
  </article>
</template>

<script>
import { mapGetters } from 'vuex'
import * as tus from 'tus-js-client'

export default {
  middleware: 'auth',
  computed: {
    ...mapGetters(['loggedInUser'])
  },
  data() {
    return {
      uploadSpeed: '',
      bytesUploaded: '',
      formData: {
        phone: 'android',
        uploadProgress: 0,
        fileName: '',
        fileSize: '',
        fileFingerPrint: ''
      }
    }
  },
  methods: {
    _formatBytes: (bytes, decimals = 2) => {
      if (bytes === 0) return '0 Bytes'

      const k = 1024
      const dm = decimals < 0 ? 0 : decimals
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

      const i = Math.floor(Math.log(bytes) / Math.log(k))

      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
    },
    handleFileUpload(file) {
      let startTime, endTime;
      const upload = new tus.Upload(file, {
        endpoint: "http://localhost:1080/files/",
        retryDelays: [0, 3000, 5000, 10000, 20000],
        metadata: {
          filename: file.name,
          filetype: file.type
        },
        onBeforeRequest: (req) => {
          startTime = (new Date()).getTime();
        },
        onError: function(error) {
          console.log("Failed because: " + error)
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          endTime = (new Date()).getTime();
          const duration = (endTime - startTime) / 1000;
          const bitsLoaded = bytesUploaded * 8;
          const speedMbps = ((bitsLoaded / duration) / 1024 / 1024).toFixed(2);
          this.uploadSpeed = speedMbps + ' /Mbps';
          this.bytesUploaded = this._formatBytes(bytesUploaded);
          this.formData.uploadProgress = parseFloat(((bytesUploaded / bytesTotal) * 100).toFixed(0));
        },
        onSuccess: () => {
          this.$Message.success("文件上传成功.");
          const fileUrl = new URL(upload.url);

          const { pathname } = fileUrl;
          this.formData.fileFingerPrint = pathname.split('/')[2];
          this.formData.fileName = upload.file.name;
          this.formData.fileSize = this._formatBytes(upload.file.size);
        }
      });
      upload.start();
      return false;
    }
  },
  components: {}
}
</script>

<style scoped>
form {
  padding: 15px 30px;
  margin-top: 10px;
  border: 1px solid #dedede;
  border-radius: 5px;
}
</style>
