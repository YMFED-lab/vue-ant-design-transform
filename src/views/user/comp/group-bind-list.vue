<template>
  <div class="group-bind-list">
    <a-row class="handle-area">
      <a-input placeholder="名称" v-model="name" @pressEnter="handleSearch"/>
      <a-button type="primary" icon="search" style="margin-right: 10px;" @click="handleSearch">查询</a-button>
    </a-row>
    <!-- 列表 -->
    <a-table 
      :rowKey="row => row.id"
      :pagination = "false"
      :rowSelection="{selectedRowKeys: groupIds, onChange: onSelectChange}" 
      :columns="columns" 
      :dataSource="data"
      :loading="loading">
    </a-table>
  </div>
</template>
<script>
export default {
  name:"group-bind-list",
  data() {
    // 列表列名定义
    const columns = [{
        title: '组名称',
        dataIndex: 'name',
      }, {
        title: '描述',
        dataIndex: 'desc',
      }];
    return {
      name: '',
      data: [],
      columns,
      groupIds: [], // 选中的组Id
      loading: false,
    }
  },
  props: {
    row: Object,
  },
  mounted() {
    this.getGroup(true) // true表示首次加载，不再对勾选产生影响
  },
  methods: {
    handleSearch() {
      this.getGroup(false)
    },
    getGroup(is_first_load) {
      let vm = this
      vm.loading = true
      vm.api.user.getGroupUpdateRoles(vm.row.id, {name: vm.name}).then(res => {
        vm.data = res.data
        if(vm.data && vm.data.length > 0 && is_first_load) {
          vm.data.forEach(group => {
            if(group.checked) {
              vm.groupIds.push(group.id)
            }
          });
        }
        vm.loading = false
        vm.$emit('doneLoadingData', 'done')
      })
    },
    onSelectChange (groupIds) {
      console.log(groupIds)
      this.groupIds = groupIds
    }
  },
}
</script>

<style lang="less" scoped>
.group-bind-list{
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