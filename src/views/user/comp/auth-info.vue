<template>
  <!-- 查看权限 -->
  <div class="auth-info">
    <p class="ant-modal-title">帐号：【{{rowInfo.name}}】的权限</p>

    <a-row class="handle-area">
      <a-select
        showSearch
        v-model="selectedGroupId"
        placeholder="请选择组"
        @change="selectGroup">
        <a-select-option 
          key="default" 
          value="default">直接关联角色</a-select-option>
        <a-select-option 
          v-for="(group, key) in groups" 
          :key="key" 
          :value="group.id">
          {{group.name}}
        </a-select-option>
      </a-select>
    </a-row>

    <p v-if="noTab" style="margin: 20px 0;text-align: center;">请先关联角色</p>
    <a-tabs
      v-else
      type="card"
      @tabClick="loadTree"
      style="margin-top: 20px;"
      refs="tabs"
      v-model="activeKey">

      
      <a-tab-pane v-for="role in roles" :key="role.id" :tab="role.name">
        <!-- <a-spin v-if="load"/> -->
        <a-spin v-if="load" class="load-icon"/>
        <a-tree v-else-if="roleTreeData.length > 0" :treeData="roleTreeData" ref="roleTree" id="auth-tree" @select="selectNode"/>
        <p v-else style="margin: 20px 0;text-align: center;">没有数据</p>
      </a-tab-pane>

    </a-tabs>

    <a-drawer
      :title="aGroup.title"
      placement="right"
      :closable="false"
      @close="() => visible = false"
      :visible="visible">
      <p><b>所属系统：</b>{{aGroup.system_name}}</p>
      <p><b>所属菜单：</b>{{aGroup.menu_name}}</p>
      <p><b>名称：</b>{{aGroup.name}}</p>
      <p><b>描述：</b>{{aGroup.desc || '-'}}</p>
      <p><b>url：</b>{{aGroup.url || '-'}}</p>
      <p><b>类型：</b>{{aGroup.type || '-'}}</p>
      <p><b>创建者：</b>{{aGroup.create_user_name}}</p>
      <p><b>创建时间：</b>{{aGroup.create_time | formatterTime}}</p>
      <p><b>更新者：</b>{{aGroup.last_modified_by_name}}</p>
      <p><b>更新时间：</b>{{aGroup.update_time | formatterTime}}</p>
    </a-drawer>

  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedGroupId: 'default', // 选中的组，默认是直授权
      groups: [],
      roleTreeData: [], // 角色权限
      roles: [], // 角色
      load: false,
      noTab: false, 
      visible: false,
      aGroup: {},
      activeKey: '', // 当前活动的tab
    }
  },
  props: {
    rowInfo: Object
  },
  methods: {
    // 选中的node节点
    selectNode(selectedKeys, e) {
      if(!e.selected) { return } // 没有选中节点时候返回
      let selected = e.selectedNodes[0].data.props.dataRef
      if(selected.children && selected.children.length > 0) {
        return
      }
      this.aGroup = selected
      this.visible = true
    },
    selectGroup(value) {
      this.getGroupRoles()
    },
    loadTree(key) {
      this.getRoleData(key)
    },
    // 获取第一个角色的数据
    getRoleData(id) {
      let vm = this
      vm.load = true
      vm.api.role.getRoleAuthPermission(id).then(res => {
        let handleTreeData = JSON.parse(JSON.stringify(res.data))
        vm.cutTree(handleTreeData, vm)
        vm.roleTreeData = handleTreeData
        vm.load = false
      })
    },
    cutTree(nodes, ref) {
      let temp = [...nodes]
      temp.length > 0 && temp.forEach(function(node, index) {
        if(node.children && node.children.length !== 0) {
          ref.cutTree(node.children, ref)
        } else {
          if(node.permissions && node.permissions.length > 0) {
              node.children = node.permissions
          } else {
              node.children = [{ title: '无'}]
          }
        }        
      })
    },
    // 获取组角色
    getGroupRoles() {
      let vm = this
      if(vm.selectedGroupId == 'default') {
        vm.getDirUserRoles()
      }else {
        vm.api.group.getGroupAuthRoles(vm.selectedGroupId).then( res => {
          if(res.data.length === 0) {
            vm.roles.push({title: '没有数据'})
            vm.noTab = true
          } else {
            vm.roles = res.data
            vm.activeKey = res.data[0].id
            vm.getRoleData(res.data[0].id)
          }
        })
      }
    },
    // 组列表获取
    getGroupList() {
      let vm = this
      vm.api.user.getUserGounps(vm.rowInfo.id).then(res => {
        vm.groups = res.data
      })
    },
    // 获取直接授权角色
    getDirUserRoles() {
      let vm = this
      vm.api.user.getDirUserRoles(vm.rowInfo.id).then(res => {
        if(res.data.length === 0) {
          vm.roles.push({title: '没有数据'})
          vm.noTab = true
        } else {
          vm.roles = res.data
          vm.activeKey = res.data[0].id
          vm.getRoleData(res.data[0].id)
        }
      })
    }
  },
  mounted() {
    this.getGroupList()
    this.getGroupRoles()
  },
  filters: {
    formatterTime(val) {
      let arr = val ? val.split(' ') : ''
      return arr != '' ? arr[0]+' '+arr[1] : ''
    }
  }
}
</script>

<style lang="less" scoped>
.auth-info{
  .handle-area {
      display: flex;
      flex-direction: row;
      margin-bottom: 10px;
      margin-top: 20px;
    }
    .ant-input {
      width: 140px;
      margin: 0 8px 0 0;
    }
    .ant-select {
      width: 140px;
      margin: 0 8px 0 0;
    }
    .load-icon{
      position: relative; 
      transform: translate(-50%, 0);
      left: 50%;
    }
}
</style>

<style lang="less">
#auth-tree{
  .ant-tree-node-content-wrapper-normal{
    color: #1890ff !important;
  }
}
</style>