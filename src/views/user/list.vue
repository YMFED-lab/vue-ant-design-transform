<template>
  <div id="user-list">
    <a-row class="handle-area">
      <a-input placeholder="账号 / 名称 / 邮箱" v-model="search.accountOrNameOrEmial" @pressEnter="handleSearch"/>
      <a-select
        showSearch
        :allowClear="true"
        placeholder="选择状态"
        @change="handleChange">
        <a-select-option value="1">有效</a-select-option>
        <a-select-option value="0">无效</a-select-option>
      </a-select>
      <a-button type="primary" icon="search" style="margin-right: 10px;" @click="handleSearch">查询</a-button>
    </a-row>
    <a-table 
      :rowKey="row => row.id"
      :columns="columns" 
      :dataSource="data"
      :loading="loading"
      :pagination = "false"
      :scroll="device===mobile ? { x: 750} : { x: 1200 }"
      size="middle">
      <template slot="operation" slot-scope="text, record, index">
        <a-dropdown :trigger="['click']">
          <a class="ant-dropdown-link" href="javascript:;">
            <a-icon type="form" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;" @click="checkAuth(text, record, index)">查看权限</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;" @click="contactGroup(text, record, index)">关联组</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;" @click="contactRole(text, record, index)">关联角色</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </template>
    </a-table>
    <a-pagination
      style="display: flex; flex-direction: row; justify-content: flex-end; margin-top: 10px;"
      size="small"
      :pageSizeOptions="pageSizeOptions"
      :total="total"
      showSizeChanger
      :pageSize="pageSize"
      v-model="current"
      :showTotal="total => `共 ${total} 条`"
      @change="changePage"
      @showSizeChange="onShowSizeChange">
      <template slot='buildOptionText' slot-scope='props'>
        <span v-if="props.value!=='50'">{{props.value}}条/页</span>
        <span v-if="props.value==='50'">全部</span>
      </template>
    </a-pagination>

    <!-- 查看权限 -->
    <a-modal
      v-model="showAuth"
      :maskClosable="false">
        <auth-info :rowInfo="currentRow" ref="authModal" v-if="showAuth"/>
        <a-button slot="footer" type="primary" @click="showAuth = false">关闭</a-button>
    </a-modal>

    <!-- 关联角色和关联组弹窗 -->
    <a-modal
      :title="modalTitle"
      v-model="showModal"
      okText="保存"
      @ok="save"
      @cancel="closeModal"
      cancelText="取消"
      :maskClosable="false"
      :confirmLoading="loading"
      :okButtonProps="{ props: {disabled: enableOpeBtn} }">
      <RoleBindList v-if="roleBind" :row="currentRow" ref="roleBind" @doneLoadingData="enableBtnOperate"/>
      <GroupBindList v-if="groupBind" :row="currentRow" ref="groupBind" @doneLoadingData="enableBtnOperate"/>
    </a-modal>

  </div>
</template>

<script>
import RoleBindList from './comp/role-bind-list'
import GroupBindList from './comp/group-bind-list'
import AuthInfo from './comp/auth-info'
import { mapState } from 'vuex'
import { DEVICE_TYPE } from '@/utils/device'
export default {
  name: 'user',
  components: { RoleBindList, GroupBindList, AuthInfo},
  data() {
    const formatterTime = function(val){
      let arr = val ? val.split(' ') : ''
      return arr != '' ? arr[0]+' '+arr[1] : ''
    } 
    const formatterStatus = (val) => {
      return val ? '有效' : '无效'
    }
    const columns = [
      {
        title: '',
        dataIndex: 'operation',
        key: 'operation',
        scopedSlots: { customRender: 'operation' },
        width: 40,
        fixed: 'left',
        align: 'center'
      },
      {
        title: 'ID',
        key: 'id',
        dataIndex: 'id',
      }, {
        title: '账号',
        key: 'username',
        dataIndex: 'username',
      }, {
        title: '名称',
        key: 'name',
        dataIndex: 'name',
      }, {
        title: '邮箱',
        key: 'email',
        dataIndex: 'email',
      }, {
        title: '状态',
        key: 'is_active',
        dataIndex: 'is_active',
        customRender: formatterStatus,
      }, {
        title: '手机号码',
        key: 'phone',
        dataIndex: 'phone',
      }, {
        title: '钉钉',
        key: 'dingding',
        dataIndex: 'dingding',
      }, {
        title: '创建时间',
        key: 'create_time',
        dataIndex: 'create_time',
        customRender: formatterTime,
      }, {
        title: '更新时间',
        key: 'update_time',
        dataIndex: 'update_time',
        customRender: formatterTime,
      },
    ]
    return {
      columns: columns,
      data: [],
      loading: false,
      search: {
        is_active: '',
        accountOrNameOrEmial: ''
      },
      pageSizeOptions: ['10', '20', '30', '40', '50'],
      current: 1, // 当前页
      pageSize: 10,
      total: 0,
      page: 1, // 页数
      modalTitle: '',
      showModal: false,
      roleBind: false,
      groupBind: false,
      currentRow: {},
      showAuth: false,
      mobile: DEVICE_TYPE.MOBILE,
      enableOpeBtn: false, // 允许按钮进行操作
    }
  },
  computed: {
    ...mapState({
        device: state => state.app.device
      }),
  },
  methods: {
    // 允许按钮操作
    enableBtnOperate() {
      this.enableOpeBtn = false
    },
    // 查看权限
    checkAuth(text, record, index) {
      this.showAuth = true
      this.currentRow = record
    },
    // 关联组
    contactGroup(text, record, index) {
      this.modalTitle = `关联【${record.name}】组`
      this.currentRow = record
      this.showModal = true
      this.groupBind = true
      this.enableOpeBtn = true
    },
    // 关联角色
    contactRole(text, record, index) {
      this.modalTitle = `关联【${record.name}】角色`
      this.currentRow = record
      this.showModal = true
      this.roleBind = true
      this.enableOpeBtn = true
    },
    // 状态栏的选择
    handleChange(value) {
      this.search.is_active = value
      this.handleSearch()
    },
    // 查询
    handleSearch() {
      // 设置页数为第一页
      this.page = 1
      this.current = 1
      this.getList()
    },
    changePage(current, pageSize) {
      this.page = current
      this.getList()
    },
    onShowSizeChange(current, pageSize) {
      this.pageSize = pageSize
      this.getList()
    },
    getList() {
      let vm = this
      vm.loading = true
      const params = {
        page_size: vm.pageSize,
        page: vm.page,
        search: vm.search.accountOrNameOrEmial,
        is_active: vm.search.is_active
      }
      vm.api.user.getUserList(params).then(res => {
        vm.loading = false
        vm.data = res.results
        vm.total = res.count
      })
    },
    // 保存
    save() {
      if(this.roleBind) {
        this.bindRole()
      }
      if(this.groupBind) {
        this.bindGroup()
      }
    },
    // 关联角色保存更新
    bindRole() {
      let vm = this
      const roleIds = this.$refs.roleBind.roleIds
      vm.loading = true
      vm.api.user.updateUserUpdateRoles(vm.currentRow.id, {roles: JSON.stringify(roleIds)}).then(res => {
        vm.$message.info('关联角色成功')
        vm.showModal = false
        vm.roleBind = false
        vm.loading = false
      })
    },
    bindGroup() {
      const groupIds = this.$refs.groupBind.groupIds
      let vm = this
      vm.loading = true
      vm.api.user.updateGroupUpdateRoles(vm.currentRow.id, { groups: JSON.stringify(groupIds)}).then(res => {
        vm.$message.info('更新组成功')
        vm.showModal = false
        vm.groupBind = false
        vm.loading = false
      })
    },
    // 关闭模态框
    closeModal() {
      this.showModal = false
      this.roleBind = false
      this.groupBind = false
    }
  },
  created() {
    let vm = this
    vm.handleSearch()
  }
}
</script>

<style lang="less" scoped>
#user-list{
  .handle-area {
      display: flex;
      flex-direction: row;
      margin-bottom: 10px;
      flex-wrap: wrap;
    }
    .ant-input {
      width: 140px;
      margin: 0 8px 0 0;
    }
    .ant-select {
      width: 140px;
      margin: 0 8px 0 0;
    }
}
</style>