<template>
  <article class="tfs-article">
    <h1>注册用户</h1>
    <hr>
    <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="80" class="mt20 tfs-narrow-form">
      <Form-item label="邮箱" prop="email">
        <Input v-model="formData.email" placeholder="请输入邮箱"></Input>
      </Form-item>
      <Form-item label="用户名" prop="name">
        <Input v-model="formData.name" placeholder="请输入用户名"></Input>
      </Form-item>
      <Form-item label="密码" prop="password">
        <Input type="password" v-model="formData.password" placeholder="请输入密码"></Input>
      </Form-item>
      <Form-item label="确认密码" prop="passwdCheck">
        <Input type="password" v-model="formData.passwdCheck" placeholder="请再次输入密码"></Input>
      </Form-item>
<!--      <Alert type="warning">在注册的时设置流量是出于测试目的，简化掉用户中心，直接测试流量余额。</Alert>-->
<!--      <Form-item label="流量额度">-->
<!--        <Slider v-model="formData.quota" :step="10" :min="0" :max="500" :tip-format="format" show-stops-->
<!--                show-input></Slider>-->
<!--      </Form-item>-->
      <Form-item>
        <Button type="primary" @click="handleSubmit('formData')" :loading="loading">提交</Button>
        <Button @click="handleReset('formData')" style="margin-left: 8px">重置</Button>
      </Form-item>
    </Form>
  </article>
</template>

<script>
export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.formData.passwdCheck !== '') {
          this.$refs.formData.validateField('passwdCheck');
        }
        callback();
      }
    }
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.formData.password) {
        callback(new Error('两次输入密码不一致!'));
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
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能空', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        passwdCheck: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
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
            this.$Message.success("注册成功.");
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
              title: '注册失败',
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
