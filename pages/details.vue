<template>
  <article class="tfs-article">
    <h1>{{ appData.name }}</h1>
    <hr>
    <div class="tfs-form-wrapper">
      <Form :model="formData" :label-width="80">
        <Form-item label="平台:">
          <Radio-group v-model="formData.phone">
            <Radio label="apple" disabled>Apple</Radio>
            <Radio label="android">Android</Radio>
          </Radio-group>
        </Form-item>
        <div v-if="!fileUploaded">
          <Form-item label="">
            <Alert type="warning">
              目前只支持安卓应用，请上传APK格式的文件。
            </Alert>
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
          <Form-item label="上传速度">
            <Alert type="info">
              {{ uploadSpeed }} - {{ bytesUploaded }}
            </Alert>
          </Form-item>
          <Form-item label="上传进度:">
            <Alert type="info">
              <Progress :percent="formData.uploadProgress" status="active"></Progress>
            </Alert>
          </Form-item>
        </div>
        <template v-else>
          <Form-item label="">
            <Alert type="success">
              文件已经上传成功，请耐心等待服务器解析包信息，您也可以点击下方的重新上传按钮重新上传文件。
            </Alert>
          </Form-item>
          <Form-item label="文件指纹:">
            <Input v-model="formData.fileFingerPrint" placeholder="上传文件后显示" style="width: 300px" readonly
                   disabled></Input>
          </Form-item>
          <Form-item label="文件名:">
            <Input v-model="formData.fileName" placeholder="上传文件后显示" style="width: 300px" readonly disabled></Input>
          </Form-item>
          <Form-item label="大小:">
            <Input v-model="formData.fileSize" placeholder="上传文件后显示" style="width: 300px" readonly disabled></Input>
          </Form-item>
        </template>
        <Form-item>
          <Button type="primary" @click="handleSubmit(appData)" :loading="loading" :disabled="!submitAllowed">提交</Button>
          <Button @click="reset" :loading="loading" :disabled="!fileUploaded">重新上传</Button>
        </Form-item>
      </Form>
    </div>
  </article>
</template>

<script>
import { mapGetters } from 'vuex';
import * as tus from 'tus-js-client';

let uploader = null;

export default {
  async asyncData(ctx) {
    const { query, $axios } = ctx;
    const { appId } = query;
    const { data } = await $axios.$get(`app?appId=${appId}`);

    return { appData: data[0] };
  },
  middleware: 'auth',
  computed: {
    ...mapGetters(['loggedInUser'])
  },
  data() {
    return {
      loading: false,
      uploader: null,
      fileUploaded: false,
      submitAllowed: false,
      uploadSpeed: '0 /Mbps',
      bytesUploaded: '0 MB',
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
    _getAppPackMeta(pkgHashId, appId, pkgFileName) {
      this.$axios.$put('app', { appId, pkgHashId, pkgFileName });
    },
    handleSubmit(app) {
    },
    reset() {
      this.fileUploaded = false;
      this.bytesUploaded = '0 MB';
      this.uploadSpeed = '0 /Mbps';
      this.formData.uploadProgress = 0;
      // todo: 此处需要添加服务器端接口，删除服务器端文件。
    },
    handleFileUpload(file) {
      let startTime, endTime;
      let ctx = this;
      uploader = new tus.Upload(file, {
        endpoint: 'http://localhost:1080/files/',
        chunkSize: 5 * 100 * 1024,
        overridePatchMethod: true,
        removeFingerprintOnSuccess: true,
        uploadDataDuringCreation: true,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        metadata: {
          filename: file.name,
          filetype: file.type
        },
        onBeforeRequest: function(req) {
          startTime = (new Date()).getTime()
        },
        onError: function(error) {
          ctx.$Message.error('上传文件出错: ' + error);
        },
        onProgress: function(bytesUploaded, bytesTotal) {
          endTime = (new Date()).getTime()
          const duration = (endTime - startTime) / 1000
          const bitsLoaded = bytesUploaded * 8
          const speedMbps = ((bitsLoaded / duration) / 1024 / 1024).toFixed(2)
          ctx.uploadSpeed = speedMbps + ' /Mbps'
          ctx.bytesUploaded = ctx._formatBytes(bytesUploaded);
          ctx.formData.uploadProgress = parseFloat(((bytesUploaded / bytesTotal) * 100).toFixed(0))
        },
        onSuccess: function()  {
          ctx.$Message.success('文件上传成功.');
          const fileUrl = new URL(uploader.url);

          const { pathname } = fileUrl;
          ctx.fileUploaded = true;
          ctx.formData.fileFingerPrint = pathname.split('/')[2];
          ctx.formData.fileName = uploader.file.name;
          ctx.formData.fileSize = ctx._formatBytes(uploader.file.size);
        }
      })
      uploader.start();
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
