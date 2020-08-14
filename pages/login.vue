<template>
  <article class="tfs-article">
    <h1>用户登陆</h1>
    <hr>
    <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="80" class="mt20 tfs-narrow-form">
      <Form-item label="邮箱" prop="email">
        <Input v-model="formData.email" placeholder="请输入邮箱"></Input>
      </Form-item>
      <Form-item label="密码" prop="password">
        <Input type="password" v-model="formData.password" placeholder="请输入密码"></Input>
      </Form-item>
      <Form-item>
        <Button type="primary" @click="handleSubmit('formData')" :loading="loading">提交</Button>
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
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能空', trigger: 'blur' }
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
            // await this.$axios.$post("users/login", {
            //   email: this.formData.email,
            //   password: this.formData.password
            // });
            await this.$auth.loginWith('local', {
              data: {
                email: this.formData.email,
                password: this.formData.password
              },
            });
            this.$Message.success("登陆成功");
            this.loading = false;
            // this.$Modal.success({
            //   title: '登陆成功',
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
              title: '登陆失败',
              content: "请检查用户名和密码是否正确"
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
