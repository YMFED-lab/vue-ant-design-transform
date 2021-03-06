<template>
  <a-layout class="main-layout" style="height: 100%;">
    <a-layout-sider
      :trigger="null"
      collapsible
      v-model="collapsed"
      :class="[isMobile && collapsed? 'mobile-side':'common-side', !isMobile ? 'normal-side' : '']">
      <div class="logo" @click="()=>{this.$router.push({path: '/'})}">
        <div v-show="collapsed">
            <img class="logo-img-s" src="~@/assets/logo-min.png" alt="">
        </div>
        <div v-show="!collapsed"> <!--使用v-show是因为不用改变dom，体验更好v-if要计算渲染-->
            <img class="logo-img" src="~@/assets/logo.png" alt="">
        </div>
      </div>
      <a-menu 
        :openKeys="openKeys"
        v-model="selectedKeys"
        @openChange="onOpenChange"
        theme="dark"
        mode="inline">
        <template v-for="(menu, index) in side_menus" :propsData="index">
          <a-menu-item v-if="menu.children.length == 0" :key="menu.id.toString()" @click="menuClick($event, menu)">
            <a-icon :type="menu.icon" />
            <span>{{menu.title}}</span>
          </a-menu-item>
          <a-sub-menu v-else :key="menu.id.toString()">
            <span slot="title"><a-icon :type="menu.icon" /><span>{{menu.title}}</span></span>
            <a-menu-item v-for="secMenu in menu.children" :key="secMenu.id.toString()" @click="menuClick($event, secMenu)">{{secMenu.title}}</a-menu-item>
          </a-sub-menu>
        </template>
      </a-menu>
    </a-layout-sider>

    <a-layout>

      <a-layout-header class="header">
        <div class="left-menu">
          <a-icon
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="()=> collapsed = !collapsed"/>
        </div>
        <div class="right-menu">
          <header-avatar></header-avatar>
        </div>
      </a-layout-header>

      <a-layout-content style="margin: 0 16px">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item><router-link :to="{path: '/'}">首页</router-link></a-breadcrumb-item>
          <a-breadcrumb-item v-if="currentRouteInfo.title">{{currentRouteInfo.title}}</a-breadcrumb-item>
        </a-breadcrumb>
        <div :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '180px' }">
          <transition name="router-fade" mode="out-in">
            <router-view />
          </transition>
        </div>
      </a-layout-content>
    </a-layout>
    <div class="mobile-mask" v-if="isMobile && !collapsed" @click="() => collapsed = !collapsed"></div><!--使用a-row，点击事件click不生效-->
  </a-layout>
</template>
<script>
// import {mapState} from 'vuex'
import HeaderAvatar from '@/components/layouts/header/HeaderAvatar'
import {getStore} from "@/utils/storage"
import { deviceEnquire, DEVICE_TYPE } from '@/utils/device'
export default {
  data(){
    return {
      collapsed: false,
      openKeys: [],
      selectedKeys: [],
      side_menus: [],
      isMobile: false,
      currentRouteInfo: {}
    }
  },
  components: {
    HeaderAvatar
  },
  computed: {
    // ...mapState({
    //       side_menus: state => state.menu.side_menus
    //   }),
  },
  methods: {
    onOpenChange (openKeys) {
      this.openKeys = openKeys
    },
    menuClick(event, menu) {
      // 点击左侧导航栏跳转页面
      let vm = this
      let openKeys = []
      if(!menu.parent_id) {
        vm.openKeys = []
      }
      if(!vm.openKeys.length){
        openKeys = [menu.id.toString()]
      } else {
        openKeys = JSON.parse(JSON.stringify(vm.openKeys))
      }
      vm.side_menus.forEach(function (v) {
        if(v.id == openKeys) {
          let turnPath = '/'
          if(v.children && v.children.length > 0) {
            v.children.forEach(function (v2) {
              if(v2.id == event.key) {
                turnPath += v2.fullUrl
              }
            })
          } else {
            turnPath += v.fullUrl
          }
          vm.$router.push(turnPath)
        }
      });
    },
    // 更新左侧的菜单选项
    checkLayout() {
      let vm = this
      vm.selectedKeys = [vm.$route.name.toString()]
      this.currentRouteInfo = this.$route.meta.info || {}
    },
    // 适配设备
    deviceAdapt() {
      let vm = this
      const { $store } = this
      deviceEnquire(deviceType => {
        switch (deviceType) {
        case DEVICE_TYPE.DESKTOP:
          vm.isMobile = false
          vm.collapsed = false
          $store.commit('TOGGLE_DEVICE', 'desktop')
          break
        case DEVICE_TYPE.TABLET:
          vm.isMobile = false
          vm.collapsed = true
          $store.commit('TOGGLE_DEVICE', 'tablet')
          break
        case DEVICE_TYPE.MOBILE:
        default:
          vm.isMobile = true
          vm.collapsed = true
          $store.commit('TOGGLE_DEVICE', 'mobile')
          break
        }
      })
    }
  },
  created() {
    this.side_menus = getStore('side_menus', true)
    this.checkLayout()
    this.deviceAdapt()
  },
  watch: {
    $route: function (to, from) {
        this.checkLayout();
    },
  }
}
</script>
<style lang="less" scoped>
.main-layout{
  .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    margin-right: 10px;
    &:hover {
        background: #f7f7f7;
    }
  }
  .logo {
    height: 32px;
    margin: 16px;
    .logo-img {
        width: 134px;
        position: absolute;
        transform: translate(-50%, 0);
        left: 50%;
    }
    .logo-img-s{
        width: 40px;
        position: absolute;
        left: 20px;
        top: 10px;
    }
  }
  .header{
    padding: 0;
    width: 100%;
    display: flex; 
    flex-direction: row; 
    justify-content: space-between;
    background: #fff;
    .left-menu{
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }
  .mobile-side{
    position: fixed;
    background: rgb(0, 21, 41);
    height: 100%;
    left: -400px;
    z-index: 999;
  }
  .common-side{
    position: fixed;
    left: 0;
    background: rgb(0, 21, 41);
    height: 100%;
    z-index: 999
  }
  .mobile-mask{
    width: 100%;
    height: 100%;
    background: #333;
    opacity: 0.6;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 990;
  }
  // 非手机设备，正常显示
  .normal-side {
    position: relative;
  }
}
</style>