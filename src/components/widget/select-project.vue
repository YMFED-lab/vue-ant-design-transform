<!-- 选择项目 -->
<template>
  <a-select
    class="scrollbar"
    showSearch
    allowClear
    placeholder="请选择项目"
    style="width: 160px; font-size: 12px;"
    @change="selectProject">
    <a-select-option 
      v-for="(item, index) in data" 
      :value="item.id" 
      :key="index">
      {{item.title}}
    </a-select-option>
  </a-select>
</template>

<script>
export default {
  name: 'select-project',
  data () {
    const projectData = [
      {
        id: 1,
        name: 'demo1',
        title: 'demo1'
      },
      {
        id: 2,
        name: 'demo2',
        title: 'demo2'
      },
      {
        id: 3,
        name: 'demo3',
        title: 'demo3'
      }
    ]
    return {
      data: projectData, // 项目数据
    }
  },
  methods: {
    selectProject(value) {
      // console.log(`selected ${value}`)
    }
  }
}
</script>

<style lang="less" scoped>

</style>