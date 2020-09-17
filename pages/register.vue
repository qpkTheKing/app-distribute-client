<template>
  <article class="tfs-article">
    <h1>注册用户</h1>
    <hr>
    <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="80" class="mt20 tfs-narrow-form">
      <Form-item :label="this.$t('EMAIL')" prop="email">
        <Input v-model="formData.email" :placeholder="this.$t('FORM_TIP_EMAIL')"></Input>
      </Form-item>
      <Form-item :label="this.$t('USERNAME')" prop="name">
        <Input v-model="formData.name" :placeholder="this.$t('FORM_TIP_USER')"></Input>
      </Form-item>
      <Form-item :label="this.$t('PASSWD')" prop="password">
        <Input type="password" v-model="formData.password" :placeholder="this.$t('FORM_TIP_PASSWORD')"></Input>
      </Form-item>
      <Form-item :label="this.$t('PASSWD_AGAIN')" prop="passwdCheck">
        <Input type="password" v-model="formData.passwdCheck" :placeholder="this.$t('FORM_TIP_CONFIRM_PASSWORD')"></Input>
      </Form-item>
<!--      <Alert type="warning">在注册的时设置流量是出于测试目的，简化掉用户中心，直接测试流量余额。</Alert>-->
<!--      <Form-item label="流量额度">-->
<!--        <Slider v-model="formData.quota" :step="10" :min="0" :max="500" :tip-format="format" show-stops-->
<!--                show-input></Slider>-->
<!--      </Form-item>-->
      <Form-item>
        <Button type="primary" @click="handleSubmit('formData')" :loading="loading">{{ this.$t('SUBMIT') }}</Button>
        <Button @click="handleReset('formData')" style="margin-left: 8px">{{ this.$t('FORM_RESET') }}</Button>
      </Form-item>
    </Form>
  </article>
</template>

<script>
export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('FORM_TIP_PASSWORD')));
      } else {
        if (this.formData.passwdCheck !== '') {
          this.$refs.formData.validateField('passwdCheck');
        }
        callback();
      }
    }
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('FORM_TIP_CONFIRM_PASSWORD')));
      } else if (value !== this.formData.password) {
        callback(new Error(this.$t('FORM_ERR_TIP_PASSWORD_CONFIRM')));
      } else {
        callback();
      }
    }
    return {
      loading: false,
      formData: {
        name: '',
        email: '',
        password: '',
        passwdCheck: '',
        quota: 0
      },
      ruleValidate: {
        name: [
          { required: true, message: this.$t('FORM_ERR_TIP_USERNAME'), trigger: 'blur' }
        ],
        email: [
          { required: true, message: this.$t('FORM_ERR_TIP_EMAIL'), trigger: 'blur' },
          { type: 'email', message: this.$t('FORM_ERR_TIP_EMAIL_FORMAT'), trigger: 'blur' }
        ],
        password: [
          { required: true, message: this.$t('FORM_ERR_TIP_PASSWORD'), trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        passwdCheck: [
          { required: true, message: this.$t('FORM_TIP_CONFIRM_PASSWORD'), trigger: 'blur' },
          { validator: validatePassCheck, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    format(val) {
      return '额度:' + val + 'MB';
    },
    handleSubmit(name) {
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          try {
            this.loading = true;
            await this.$axios.$post("register", {
              name: this.formData.name,
              email: this.formData.email,
              password: this.formData.password,
              quota: 50
            });
            this.$Message.success(this.$t('FORM_REGISTER_SUCCESS'));
            await this.$auth.loginWith('local', {
              data: {
                email: this.formData.email,
                password: this.formData.password
              },
            });
            this.loading = false;
            // this.$Modal.success({
            //   title: '注册成功',
            //   content: '点确认跳转到品牌页面',
            //   okText: '我要跳转',
            //   loading: true,
            //   onOk: () => {
            //     this.$Modal.remove();
            //     this.$router.push('/');
            //   }
            // });
          } catch (error) {
            this.loading = false;
            this.$Modal.error({
              title: this.$t('FORM_REGISTER_ERROR'),
              content: error.response.data.error
            });
          }
        }
      })
    },
    handleReset(name) {
      this.$refs[name].resetFields();
      this.formData.quota = 0;
    }
  },
  components: {}
}
</script>

<style scoped>

</style>
