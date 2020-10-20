<template>
  <div class="step-container">
    <Card :bordered="false">
      <p slot="title">{{ title }}</p>
      <div>
        <Form :model="request" :label-width="80">
          <FormItem label="邮箱:">
            <Input v-model="request.email" placeholder="请输入您的邮箱地址"></Input>
          </FormItem>
          <FormItem label="电话:">
            <Input v-model="request.phone" placeholder="请输入您的手机号码"></Input>
          </FormItem>
          <FormItem label="其他需求:">
            <Input v-model="request.otherRequest" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入您的其他特殊要求"></Input>
          </FormItem>
        </Form>
      </div>
    </Card>
  </div>
</template>

<script>
export default {
  props: ['title', 'jpgDownloadUrl'],
  data() {
    return {
      request: {
        email: '',
        phone: '',
        otherRequest: ''
      }
    };
  },
  mounted() {},
  methods: {
    handleSubmit() {
      this.$Message.warning('正在开发');
    },
  },
};
</script>

<style>

</style>
