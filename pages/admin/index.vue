<template>
  <article class="tfs-article-admin">
    <h1>用户管理</h1>
    <hr>
    <Row style="margin-top: 10px;">
      <Col span="8" style="margin-bottom: 10px;">
        <Input placeholder="请输入用户名" style="width: auto">
          <Icon type="ios-contact" slot="prefix" />
        </Input>
      </Col>
      <Col span="16" style="text-align: right;">
        <Button type="primary" v-on:click="refresh" :loading="loading">
          <Icon type="ios-refresh" />
          刷新
        </Button>
      </Col>
    </Row>
    <Table :columns="columns" :data="users" no-data-text="没有找到任何用户" :loading="loading">
      <template slot-scope="{ row, index }" slot="role">
        <span v-if="row.role === '1'">管理员</span>
        <span v-if="row.role === '0'">普通用户</span>
      </template>
      <template slot-scope="{ row, index }" slot="quota">
        <span style="color: #ff9900;font-size: 14px;">{{ row.quota.toFixed(2) }} </span>MB
      </template>
    </Table>
    <Modal
      v-model="quotaModal"
      title="修改流量"
      :loading="loading"
      @on-ok="updateQuota">
      <p style="margin-bottom: 10px">新的流量配额: </p>
      <InputNumber :max="10000"
                   :min="1"
                   v-model="newQuota"
                   size="large"
                   :formatter="value => `${value} MB`.replace(/B(?=(d{3})+(?!d))/g, ',')"
                   :parser="value => value.replace(/$s?|(,*)/g, '')">
      </InputNumber>
      <Divider>快捷选项</Divider>
      <Row style="background: #f8f8f9;padding: 15px 10px;text-align: center;" :gutter="gutter">
        <Col span="5">
          <Card class="tfs-row-quota">
            <p v-on:click="setQuota(100)">100M</p>
          </Card>
        </Col>
        <Col span="5">
          <Card class="tfs-row-quota">
            <p v-on:click="setQuota(500)">500M</p>
          </Card>
        </Col>
        <Col span="5">
          <Card class="tfs-row-quota">
            <p v-on:click="setQuota(1000)">1000M</p>
          </Card>
        </Col>
        <Col span="5">
          <Card class="tfs-row-quota">
            <p v-on:click="setQuota(2000)">2000M</p>
          </Card>
        </Col>
      </Row>
    </Modal>
  </article>
</template>

<script>

export default {
  middleware: 'auth',
  layout: 'admin',
  async asyncData(ctx) {
    const { query, $axios } = ctx;
    const { data: me } = await $axios.$get(`me`);
    const { data: allUsers } = await $axios.$get('/admin/users');

    return { users: allUsers, me }
  },
  data() {
    return {
      loading: false,
      quotaModal: false,
      newQuota: 0,
      currentUser: {},
      users: [],
      me: {},
      keyword: '',
      gutter: 15,
      columns: [
        {
          title: '用户名',
          key: 'name',
          tooltip: true
        },
        {
          title: 'email',
          key: 'email',
          tooltip: true
        },
        {
          title: '角色',
          slot: 'role'
        },
        {
          title: '可用额度',
          slot: 'quota',
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            const { row } = params
            return h('div', [
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.quotaModal = true;
                    this.currentUser = row;
                  }
                }
              }, '修改额度'),
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.$Message.warning('正在实现');
                  }
                }
              }, '编辑')
            ])
          }
        }
      ],
    }
  },
  methods: {
    setQuota(quota) {
      this.newQuota = quota;
    },
    async updateQuota() {
      this.loading = true;
      await this.$axios.$post('/admin/user/quota', {
        userId: this.currentUser._id,
        newQuota: this.newQuota
      });
      const { data: allUsers } = await this.$axios.$get('/admin/users');
      this.loading = false;
      this.quotaModal = false;
      this.users = allUsers;
      this.$Message.success('修改成功');
    },
    async refresh() {
      this.loading = true;
      const { data: allUsers } = await this.$axios.$get('/admin/users');
      this.users = allUsers;
      this.loading = false;
      this.$Message.success('用户数据已刷新');
    }
  },
  components: {}
}
</script>

<style>
.tfs-row-quota .ivu-card-body {
  padding: 0;
}
.ivu-card-body p {
  display: block;
  width: 100%;
  height: 100%;
  padding: 16px;
}

</style>
