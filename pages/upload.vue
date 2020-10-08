<template>
  <article class="tfs-article">
    <h1 v-if="!fileUploaded && !fileDbId">{{ appData.name }}</h1>
    <hr v-if="!fileUploaded && !fileDbId" />
    <Alert
      type="success"
      v-if="fileUploaded && formData.phone === 'android'"
      class="mt20"
    >
      {{ $t('PKG_TIP_AFTER_UPLOAD') }}
    </Alert>
    <Alert
      type="success"
      v-if="fileUploaded && formData.phone === 'apple'"
      class="mt20"
    >
      mobileconfig文件上传成功，请提交.
    </Alert>
    <Alert
      type="warning"
      v-if="fileDbId && fileData.fType !== 'mobile-config'"
      class="mt20"
    >
      {{ $t('PKG_TIP_UPLOAD') }}
    </Alert>
    <Row
      v-if="fileUploaded && formData.phone === 'android'"
      class="tfs-app-mata-row-new"
    >
      <Col span="5">
        <img
          :src="appMetaData.icon"
          alt=""
          width="100"
          v-if="appMetaData.icon"
        />
        <img
          src="~assets/photos-app-icon-big.png"
          alt=""
          width="100"
          v-if="!appMetaData.icon"
        />
      </Col>
      <Col span="12" style="line-height: 26px;">
        <Row>{{ formData.fileName }}</Row>
        <Row>ID: {{ appMetaData.applicationId }}</Row>
        <Row>{{ $t('PKG_SIZE') }}: {{ _formatBytes(appMetaData.size) }}</Row>
        <Row>{{ $t('PKG_VERSION') }}: {{ appMetaData.version }}</Row>
      </Col>
      <Col span="7" style="text-align: right;">
        <Row>
          <Col span="24">
            <Button
              @click="reset"
              :loading="loading"
              :disabled="!fileUploaded"
              style="width: 90%; height: 40px;"
              >重新上传
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
    <Row
      v-if="fileDbId && fileData.fType !== 'mobile-config'"
      class="tfs-app-mata-row"
    >
      <Col span="5">
        <img :src="fileData.icon" alt="" width="100" v-if="fileData.icon" />
        <img :src="appData.icon" alt="" width="100" v-if="!fileData.icon" />
      </Col>
      <Col span="12" style="line-height: 26px;">
        <Row>{{ fileData.name }}</Row>
        <Row
          >ID:
          {{
            fileData.applicationId
              ? fileData.applicationId
              : appData.applicationId
          }}</Row
        >
        <Row>{{ $t('PKG_SIZE') }}: {{ _formatBytes(fileData.size) }}</Row>
        <Row
          >{{ $t('PKG_VERSION') }}:
          {{ fileData.version ? fileData.version : appData.version }}</Row
        >
      </Col>
    </Row>
    <div class="tfs-form-wrapper" v-if="!fileDbId">
      <Form :model="formData" :label-width="80">
        <Form-item :label="$t('PKG_PLATFORM')" v-if="!fileUploaded">
          <RadioGroup v-model="formData.phone">
            <Radio label="apple" style="font-size: 14px;">
              <Icon type="logo-apple"></Icon>
              <span>Apple</span>
            </Radio>
            <Radio label="android" style="font-size: 14px;">
              <Icon type="logo-android"></Icon>
              Android
            </Radio>
          </RadioGroup>
        </Form-item>
        <div v-if="formData.phone === 'apple'">
          <Form-item :label="$t('PKG_VERSION')">
            <Input v-model="formData.version" />
          </Form-item>
        </div>
        <div v-if="!fileUploaded">
          <Form-item :label="$t('PKG_FILE')">
            <Upload
              type="drag"
              :accept="formData.accept"
              :before-upload="handleFileUpload"
              action=""
            >
              <div style="padding: 20px 0;">
                <Icon
                  type="ios-cloud-upload"
                  size="52"
                  style="color: #3399ff;"
                ></Icon>
                <p>{{ $t('PKG_UPLOAD_TIP') }}</p>
              </div>
            </Upload>
          </Form-item>
          <Form-item :label="$t('PKG_UPLOAD_SPEED')">
            <Alert type="info"> {{ uploadSpeed }} - {{ bytesUploaded }} </Alert>
          </Form-item>
          <Form-item :label="$t('PKG_UPLOAD_PROGRESS')">
            <Alert type="info">
              <Progress
                :percent="formData.uploadProgress"
                status="active"
              ></Progress>
            </Alert>
          </Form-item>
        </div>
        <Form-item :label="$t('PKG_ENABLED')" v-if="fileUploaded">
          <Radio-group v-model="forDownload">
            <Radio label="TRUE">{{ $t('YES') }}</Radio>
            <Radio label="FALSE">{{ $t('NO') }}</Radio>
          </Radio-group>
        </Form-item>
        <Form-item label="应用截图:" v-if="false">
          <Upload
            ref="upload"
            :show-upload-list="false"
            :default-file-list="defaultList"
            :format="['jpg', 'jpeg', 'png']"
            :max-size="2048"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleImgBeforeUpload"
            multiple
            type="drag"
            action=""
            style="display: inline-block; width: 58px;"
          >
            <div style="width: 58px; height: 58px; line-height: 58px;">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
        </Form-item>
        <Form-item :label="$t('PKG_DESCRIPTION')">
          <Input
            v-model="appDescription"
            :rows="4"
            type="textarea"
            placeholder=""
          />
        </Form-item>
        <!--        <Form-item label="下载模板:" v-if="fileUploaded">-->
        <!--          <Input type="text" placeholder="待实现" readonly disabled/>-->
        <!--        </Form-item>-->
        <Form-item v-if="!fileDbId">
          <Button
            type="primary"
            @click="handleSubmit(appData)"
            :loading="loading"
            :disabled="!fileUploaded"
          >
            {{ $t('SUBMIT') }}
          </Button>
        </Form-item>
      </Form>
    </div>
    <div class="tfs-form-wrapper" v-if="fileDbId">
      <Form :model="formData" :label-width="80">
        <Form-item :label="`${$t('PKG_PLATFORM')}:`">{{
          fileData.fType !== 'mobile-config' ? 'Android' : 'IOS-PWA'
        }}</Form-item>
        <Form-item :label="`${$t('PKG_ENABLED')}:`">
          <Radio-group v-model="forDownload">
            <Radio label="TRUE">{{ $t('YES') }}</Radio>
            <Radio label="FALSE">{{ $t('NO') }}</Radio>
          </Radio-group>
        </Form-item>
        <Form-item label="应用截图:" v-if="false">
          <Upload
            ref="upload"
            :show-upload-list="false"
            :default-file-list="defaultList"
            :format="['jpg', 'jpeg', 'png']"
            :max-size="2048"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleImgBeforeUpload"
            multiple
            type="drag"
            action=""
            style="display: inline-block; width: 58px;"
          >
            <div style="width: 58px; height: 58px; line-height: 58px;">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
        </Form-item>
        <Form-item :label="`${$t('PKG_DESCRIPTION')}:`">
          <Input
            v-model="appDescription"
            :value="fileData.description"
            :rows="4"
            type="textarea"
            placeholder=""
          />
        </Form-item>
        <Form-item label="下载模板:" v-if="fileUploaded">
          <Input
            v-model="appDescription"
            type="text"
            placeholder="待实现"
            readonly
            disabled
          />
        </Form-item>
        <div v-if="!fileUploaded">
          <Form-item :label="`${$t('PKG_FILE')}:`">
            <Upload
              :accept="
                fileData.fType !== 'mobile-config' ? '.apk' : '.mobileconfig'
              "
              type="drag"
              :before-upload="handleFileUpload"
              action=""
            >
              <div style="padding: 20px 0;">
                <Icon
                  type="ios-cloud-upload"
                  size="52"
                  style="color: #3399ff;"
                ></Icon>
                <p>{{ $t('PKG_UPLOAD_TIP') }}</p>
              </div>
            </Upload>
          </Form-item>
          <Form-item :label="`${$t('PKG_UPLOAD_SPEED')}:`">
            <Alert type="info"> {{ uploadSpeed }} - {{ bytesUploaded }} </Alert>
          </Form-item>
          <Form-item :label="`${$t('PKG_UPLOAD_PROGRESS')}:`">
            <Alert type="info">
              <Progress
                :percent="formData.uploadProgress"
                status="active"
              ></Progress>
            </Alert>
          </Form-item>
        </div>
        <Form-item v-if="!fileDbId">
          <Button
            type="primary"
            @click="handleSubmit()"
            :loading="loading"
            :disabled="!fileUploaded"
            >{{ $t('SUBMIT') }}
          </Button>
        </Form-item>
        <Form-item v-if="fileDbId">
          <Button type="primary" @click="handleSubmit()" :loading="loading"
            >{{ $t('EDIT') }}
          </Button>
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
    let fileData;
    const { query, $axios } = ctx;
    const fileId = query.fileId;
    const { data: appData } = await $axios.$get(`app?appId=${query.appId}`);

    if (fileId) {
      const res = await $axios.$get(`app/file?fileId=${query.fileId}`);
      fileData = res.data;
    }

    return {
      appData: appData[0],
      appId: query.appId,
      fileDbId: query.fileId,
      fileData,
    };
  },
  middleware: 'auth',
  computed: {
    forDownload: {
      get: function () {
        console.log('forDownload');
        if (this.fileData) {
          return this.fileData.forDownload
            ? this.fileData.forDownload
            : 'FALSE';
        } else {
          return '';
        }
      },
      set: function (newValue) {
        console.log(newValue);
        this.forDownloadSubmit = newValue;
      },
    },
    ...mapGetters(['loggedInUser']),
  },
  data() {
    return {
      appData: {},
      fileData: {},
      fileDbId: '',
      forDownloadSubmit: '',
      loading: false,
      uploader: null,
      fileUploaded: false,
      submitAllowed: false,
      uploadSpeed: '0 /Mbps',
      bytesUploaded: '0 MB',
      appMetaData: {},
      defaultList: [],
      uploadedList: [],
      appDescription: '',
      formData: {
        accept: '',
        version: '1.0.0',
        phone: 'android',
        uploadProgress: 0,
        fileName: '',
        fileSize: '',
        fileFingerPrint: '',
      },
    };
  },
  watch: {
    'formData.phone': function (val) {
      if (val === 'android') {
        this.formData.accept = '.apk';
      } else {
        this.formData.accept = '.mobileconfig';
      }
    },
  },
  mounted() {
    this.appDescription = this.fileData ? this.fileData.description : '';
  },
  methods: {
    _formatBytes: (bytes, decimals = 2) => {
      if (bytes === 0) return '0 Bytes';

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    },
    async _getAppPackMeta(pkgHashId, pkgFileName) {
      const { data } = await this.$axios.$get(
        `app/pkg?pkgHashId=${pkgHashId}&pkgFileName=${pkgFileName}`
      );
      this.appMetaData = data;
    },
    async handleSubmit() {
      let commonPayload = {};
      if (this.formData.phone === 'android') {
        if (this.appMetaData !== {} && this.formData.fileFingerPrint !== '') {
          this.loading = true;
          commonPayload = {
            hashId: this.formData.fileFingerPrint,
            size: uploader.file.size,
            fileName: this.formData.fileName,
            fType: 'apk',
            appId: this.appId,
            appDescription: this.appDescription,
            downloadUrl: `${this.$config.downloadServer}/${this.formData.fileFingerPrint}`,
            forDownload: this.forDownloadSubmit,
          };
          await this.$axios.$post('app/file', {
            pkgMeta: {
              version: this.appMetaData.version,
              applicationId: this.appMetaData.applicationId,
              versionCode: this.appMetaData.versionCode,
              sha1: this.appMetaData.sha1,
              icon: this.appMetaData.icon,
            },
            fileDbId: this.fileDbId,
            ...commonPayload,
          });
          this.loading = false;
          this.$Notice.success({
            title: '应用提交成功，即将跳转应用列表页面.',
          });
          await this.$router.push(
            this.localePath({ name: 'apps', query: { appId: this.appId } })
          );
        } else {
          await this.$axios.$post('app/file', {
            appId: this.appId,
            fileDbId: this.fileDbId,
            appDescription: this.appDescription,
            forDownload: this.forDownloadSubmit,
            fType: 'apk',
          });
          this.loading = false;
          this.$Notice.success({
            title: '应用修改成功，即将跳转应用列表页面.',
          });
          await this.$router.push(
            this.localePath({ name: 'apps', query: { appId: this.appId } })
          );
        }
      } else {
        commonPayload = {
          appId: this.appId,
          pkgHashId: this.formData.fileFingerPrint,
          pkgFileName: this.formData.fileName,
          description: this.appDescription,
          version: this.appMetaData.version,
          forDownload: this.forDownloadSubmit,
        };
        if (this.formData.fileFingerPrint) {
          await this.$axios.$post('app/mobileConfig', {
            pkgFileId: this.fileDbId,
            ...commonPayload,
          });
        } else {
          await this.$axios.$post('app/mobileConfig', {
            pkgFileId: this.fileDbId,
            description: this.appDescription,
          });
        }
        this.loading = false;
        this.$Notice.success({
          title: '应用修改成功，即将跳转应用列表页面.',
        });
        await this.$router.push(
          this.localePath({ name: 'apps', query: { appId: this.appId } })
        );
      }
    },
    reset() {
      this.fileUploaded = false;
      this.bytesUploaded = '0 MB';
      this.uploadSpeed = '0 /Mbps';
      this.formData.uploadProgress = 0;
      // todo: 此处需要添加服务器端接口，删除服务器端文件。
    },
    handleImgBeforeUpload(files) {
      return false;
    },
    handleFileUpload(file) {
      let startTime, endTime;
      let ctx = this;
      uploader = new tus.Upload(file, {
        endpoint: this.$config.downloadServer,
        chunkSize: 5 * 100 * 1024,
        overridePatchMethod: true,
        removeFingerprintOnSuccess: true,
        uploadDataDuringCreation: true,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        metadata: {
          filename: file.name,
          filetype: file.type,
        },
        onBeforeRequest: function (req) {
          startTime = new Date().getTime();
        },
        onError: function (error) {
          ctx.$Message.error('上传文件出错: ' + error);
        },
        onProgress: function (bytesUploaded, bytesTotal) {
          endTime = new Date().getTime();
          const duration = (endTime - startTime) / 1000;
          const bitsLoaded = bytesUploaded * 8;
          const speedMbps = (bitsLoaded / duration / 1024 / 1024).toFixed(2);
          ctx.uploadSpeed = speedMbps + ' /Mbps';
          ctx.bytesUploaded = ctx._formatBytes(bytesUploaded);
          ctx.formData.uploadProgress = parseFloat(
            ((bytesUploaded / bytesTotal) * 100).toFixed(0)
          );
        },
        onSuccess: async function () {
          ctx.$Message.success('文件上传成功.');
          const fileUrl = new URL(uploader.url);

          const { pathname } = fileUrl;
          ctx.fileUploaded = true;
          ctx.formData.fileFingerPrint = pathname.split('/')[2];
          ctx.formData.fileName = uploader.file.name;
          ctx.formData.fileSize = ctx._formatBytes(uploader.file.size);
          ctx.loading = true;
          if (ctx.formData.phone === 'android') {
            await ctx._getAppPackMeta(
              ctx.formData.fileFingerPrint,
              ctx.formData.fileName
            );
          }
          ctx.loading = false;
        },
      });
      uploader.start();
      return false;
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: 'The file format is incorrect',
        desc:
          'File format of ' +
          file.name +
          ' is incorrect, please select jpg or png.',
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: 'Exceeding file size limit',
        desc: 'File  ' + file.name + ' is too large, no more than 2M.',
      });
    },
  },
  components: {},
};
</script>

<style scoped>
form {
  padding: 15px 30px;
  margin-top: 10px;
  border: 1px solid #dedede;
  border-radius: 5px;
}

.tfs-app-mata-row {
  background: aliceblue;
  padding: 10px 15px;
  border-radius: 5px;
  border: 1px solid #dedede;
}

.tfs-app-mata-row-new {
  background-color: #f5f7f9;
  margin-bottom: 10px;
  padding: 10px 15px;
  border-radius: 5px;
  border: 1px solid #dedede;
}
</style>
