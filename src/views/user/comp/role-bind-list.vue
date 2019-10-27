<template>
  <!-- 关联角色 -->
  <div class="role-bind-list">
    <a-row class="handle-area">
      <a-input placeholder="角色名称" v-model="name" @pressEnter="handleSearch"/>
      <a-button type="primary" icon="search" style="margin-right: 10px;" @click="handleSearch">查询</a-button>
    </a-row>

    <!-- 列表 -->
    <a-table 
      :rowKey="row => row.id"
      :pagination = "false"
      :rowSelection="{selectedRowKeys: roleIds, onChange: onSelectChange}" 
      :columns="columns" 
      :dataSource="data"
      :loading="loading">
    </a-table>
  </div>
</template>

<script>
export default {
  name: 'RoleBindList',
  props: {row: Object},
  data() {
    // 列表列名定义
    const columns = [{
        title: '角色名称',
        dataIndex: 'name',
      }, {
        title: '描述',
        dataIndex: 'desc',
      }];
    return {
      name: '',
      data: [],
      columns,
      roleIds: [], // 选中的角色Id
      loading: false,
    }
  },
  mounted() {
    // 初始化数据
    this.loadData(true) // true表示首次加载，不再对勾选产生影响
  },
  methods: {
    // 加载列表数据
    loadData(is_first_load) {
      let vm = this
      vm.loading = true
      vm.api.user.getUserUpdateRoles(vm.row.id, {name: vm.name}).then(res => {
        vm.data = res.data
        if(vm.data && vm.data.length > 0 && is_first_load) {
          vm.data.forEach(role => {
            if(role.checked) {
              vm.roleIds.push(role.id)
            }
          });
        }

        vm.loading = false
        vm.$emit('doneLoadingData', 'done')
      })
    },
    handleSearch() {
      this.loadData(false)
    },
    onSelectChange (roleIds) {
      // console.log('selectedRowKeys changed: ', roleIds);
      this.roleIds = roleIds
    }
  }
}
</script>

<style lang="less" scoped>
.role-bind-list{
  .handle-area {
      display: flex;
      flex-direction: row;
      margin-bottom: 10px;
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