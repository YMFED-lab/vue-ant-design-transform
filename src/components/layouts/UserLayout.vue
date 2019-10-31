<template>
  <div id="userLayout" :class="['user-layout-wrapper', device]">
    <div class="container">
      <!-- <div id="star">
        <div class="star" v-for="(star, key) in stars" :key="key" :style="{top: star.y , left: star.x}"></div>
      </div> -->
      <div class="center-pos">
        <div class="top">
          <div class="header">
            <router-link :to="{path: '/user/login'}" style='display: block;text-decoration: none;x'>
              <img src="~@/assets/logo-min.png" class="logo" alt="logo">
              <span class="title" style="color: #666;">测试平台</span>
            </router-link>
          </div>
          <div class="desc">{{desc}}</div>
        </div>
        <route-view></route-view>
      </div>

      <div class="footer">
        <!-- <div class="links">
          <router-link :to="{ path: '/self/help' }">帮助</router-link>
          <router-link :to="{ path: '/self/privacy' }">隐私</router-link>
          <router-link :to="{ path: '/self/clause' }">条款</router-link>
        </div> -->
        <div class="copyright">
            Copyright &copy; **有限公司
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mixinDevice } from '@/utils/mixin.js'
   import RouteView from '@/components/layouts/RouteView'
  // import { showLocalTime } from '@/utils/util'

  export default {
    name: 'UserLayout',
    components: { RouteView },
    mixins: [mixinDevice],
    data () {
      return {
        desc: '欢迎使用测试平台',
        // tickTime: '', // 时间跳动
        stars: [
          // {
          //   x: 1, // x坐标
          //   y: 1, // y坐标
          // }
        ], // 星星的数组
        screenWidth: document.body.clientWidth,
        screenHeight: document.body.clientHeight
      }
    },
    created () {
      // 展示时间
      // setInterval(() => {
      //   this.tickTime = showLocalTime()
      // }, 1000)

      // this.generateStars()
    },
    mounted () {
      document.body.classList.add('userLayout')
      // window.onresize = () => {
      //   this.screenWidth = document.body.clientWidth
      //   this.generateStars()
      // }
    },
    beforeDestroy () {
      document.body.classList.remove('userLayout')
    },
    methods: {
      // 生成星星
      generateStars() {
        let vm = this
        vm.screenWidth = vm.screenWidth > 1600 ? 1600 : vm.screenWidth
        vm.$nextTick(function() {
          let stars = new Set()

          // js随机生成流星
          for (let j = 0; j < 16; j++) {
            stars.add({
              x: vm.randomDistance(vm.screenWidth, 300) + 'px', // left
              y: vm.randomDistance(vm.screenHeight, -100) + 'px', // top
            })
          }

          vm.stars = [...stars]
        })
      },
      randomDistance (max, min) {
        let distance = Math.floor(Math.random() * (max - min + 1) + min)
        return distance
      },
      jumpLogin() {
        this.$router.push({ path: '/user/login'})
      }
    }
  }
</script>

<style lang="less" scoped>
  #userLayout.user-layout-wrapper {
    width:100%;
    height:100%;
    background:#fff;
    // background: #fff url('../../assets/site_bg.jpg') repeat;
    &.mobile {
      .container {
        .main {
          /*max-width: 368px;*/
          width: 98%;
        }
      }
    }
    .container {
      width: 100%;
      min-height: 100%;
      background: #f5f5f5 url(~@/assets/background.svg) no-repeat 50%;
      position: relative;
      .center-pos {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
      .top {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .header {
          .logo {
            height: 46px;
            vertical-align: top;
            margin-right: 12px;
            margin-top:-10px;
            border-style: none;
            vertical-align: middle;
          }

          .title {
            font-size: 30px;
            color: #333;
            font-family: "Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            font-weight: 600;
            position: relative;
            top: 2px;
          }
        }
      }

      .desc{
        font-size: 14px;
        margin-top: 16px;
        color: #999;
      }

      .footer {
        height:10%;
        width: 100%;
        padding: 48px 0 24px 0px;
        text-align: center;
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translate(-50%, 0);
        .links {
          font-size: 12px;
          a {
            color: rgba(0, 0, 0, 0.45);
            &:not(:last-child) {
              margin-right: 40px;
            }
          }
        }
        .copyright {
          color: rgba(0, 0, 0, 0.45);
          font-size: 14px;
        }          
      }
    }
  }

#star{
  margin: 0 auto;
  max-width: 1600px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  .star{
    display: block;
    background: transparent;
    position: relative;
    opacity: 0;
    width: 1px;
    // width: 2px; height: 10px;background: red;
    /*过渡动画*/ 
    animation: star-fall 3s linear infinite;
  }
  .star:after {
    content: '';
    display: block;
    border: 0px solid #fff;
    border-width: 0px 90px 2px 90px;
    border-color: transparent transparent transparent rgba(146, 153, 251, .5);
    box-shadow: 0 0 1px 0 rgba(146, 153, 251, .1);
    /*变形*/       
    transform: rotate(-45deg) translate3d(1px, 3px, 0);
    transform-origin: 0% 100%;
  }
}

@keyframes star-fall {
  0% {
    opacity: 0;
    transform: scale(0.5) translate3d(0, 0, 0);
  }
  50% {
    opacity: 1;
    transform: translate3d(-200px, 200px, 0);
  }
  100% {
    opacity: 0;
    transform: scale(1.2) translate3d(-300px, 300px, 0);
  }
}
</style>
