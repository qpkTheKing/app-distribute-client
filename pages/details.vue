<template>
  <article class="tfs-article">
    <h1>{{ appData.name }}</h1>
    <hr>
    <div class="tfs-form-wrapper">
      <Form :model="formData" :label-width="80">
        <Form-item label="">
          <Alert type="info">
            上传文件后，请耐心等待服务器端解析包信息，确认后方可提交.
          </Alert>
        </Form-item>
        <Form-item label="平台:">
          <Radio-group v-model="formData.phone">
            <Radio label="apple" disabled>Apple</Radio>
            <Radio label="android">Android</Radio>
          </Radio-group>
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
        <Form-item>
          <Button type="primary" @click="handleSubmit(appData)" :loading="loading" :disabled="!fileUploaded">提交</Button>
          <Button @click="reset" :loading="loading" :disabled="fileUploaded">重置</Button>
        </Form-item>
      </Form>
    </div>
  </article>
</template>

<script>
import { mapGetters } from 'vuex'
import * as tus from 'tus-js-client'

export default {
  async asyncData(ctx) {
    const { query, $axios } = ctx
    const { appId } = query
    const { data } = await $axios.$get(`app?appId=${appId}`)

    return { appData: data[0] }
  },
  middleware: 'auth',
  computed: {
    ...mapGetters(['loggedInUser'])
  },
  data() {
    return {
      loading: false,
      fileUploaded: false,
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
    handleSubmit(app) {
    },
    reset() {
    },
    handleFileUpload(file) {
      let startTime, endTime
      const upload = new tus.Upload(file, {
        endpoint: 'http://localhost:1080/files/',
        retryDelays: [0, 3000, 5000, 10000, 20000],
        metadata: {
          filename: file.name,
          filetype: file.type
        },
        onBeforeRequest: (req) => {
          startTime = (new Date()).getTime()
        },
        onError: function(error) {
          this.$Message.error('上传文件出错: ' + error)
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          endTime = (new Date()).getTime()
          const duration = (endTime - startTime) / 1000
          const bitsLoaded = bytesUploaded * 8
          const speedMbps = ((bitsLoaded / duration) / 1024 / 1024).toFixed(2)
          this.uploadSpeed = speedMbps + ' /Mbps'
          this.bytesUploaded = this._formatBytes(bytesUploaded)
          this.formData.uploadProgress = parseFloat(((bytesUploaded / bytesTotal) * 100).toFixed(0))
        },
        onSuccess: () => {
          this.$Message.success('文件上传成功.')
          const fileUrl = new URL(upload.url)

          const { pathname } = fileUrl
          this.formData.fileFingerPrint = pathname.split('/')[2]
          this.formData.fileName = upload.file.name
          this.formData.fileSize = this._formatBytes(upload.file.size)
        }
      })
      upload.start()
      return false
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
