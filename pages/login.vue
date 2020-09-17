<template>
  <article class="tfs-article">
    <h1>{{ $t('LOGIN') }}</h1>
    <hr>
    <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="80" class="mt20 tfs-narrow-form">
      <Form-item :label="this.$t('EMAIL')" prop="email">
        <Input v-model="formData.email" :placeholder="this.$t('FORM_TIP_EMAIL')"></Input>
      </Form-item>
      <Form-item :label="this.$t('PASSWD')" prop="password">
        <Input type="password" v-model="formData.password" :placeholder="this.$t('FORM_TIP_PASSWORD')"></Input>
      </Form-item>
      <Form-item>
        <Button type="primary" @click="handleSubmit('formData')" :loading="loading">{{ $t('SUBMIT') }}</Button>
      </Form-item>
    </Form>
  </article>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      formData: {
        email: '',
        password: '',
      },
      ruleValidate: {
        email: [
          { required: true, message: this.$t('FORM_ERR_TIP_EMAIL'), trigger: 'blur' },
          { type: 'email', message: this.$t('FORM_ERR_TIP_EMAIL_FORMAT'), trigger: 'blur' }
        ],
        password: [
          { required: true, message: this.$t('FORM_ERR_TIP_EMAIL'), trigger: 'blur' }
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
            await this.$auth.loginWith('local', {
              data: {
                email: this.formData.email,
                password: this.formData.password
              },
            });
            await this.$router.push(this.localePath({ name: 'index' }))
            this.$Message.success(this.$t('FORM_LOGIN_SUCCESS'));
            this.loading = false;
          } catch (error) {
            this.loading = false;
            this.$Modal.error({
              title: this.$t('FORM_LOGIN_FAILED'),
              content: this.$t('FORM_LOGIN_FAILED_DESC')
            });
          }
        }
      })
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    }
  },
  components: {}
}
</script>

<style scoped>

</style>
