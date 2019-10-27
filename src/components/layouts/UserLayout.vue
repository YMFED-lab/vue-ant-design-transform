<template>
  <div id="userLayout" :class="['user-layout-wrapper', device]">
    <div class="container">
      <div id="star">
        <div class="star" v-for="(star, key) in stars" :key="key" :style="{top: star.y , left: star.x}"></div>
      </div>
      <div class="top">
        <!-- <p class="time">{{tickTime}}</p> -->
      </div>
      <router-view />

      <!-- <div class="footer">
        <div class="links">
          <router-link :to="{ path: '/self/help' }">帮助</router-link>
          <router-link :to="{ path: '/self/privacy' }">隐私</router-link>
          <router-link :to="{ path: '/self/clause' }">条款</router-link>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
  import { mixinDevice } from '@/utils/mixin.js'
  // import { showLocalTime } from '@/utils/util'

  export default {
    name: 'UserLayout',
    mixins: [mixinDevice],
    data () {
      return {
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

      this.generateStars()
    },
    mounted () {
      document.body.classList.add('userLayout')
      window.onresize = () => {
        this.screenWidth = document.body.clientWidth
        this.generateStars()
      }
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
      /*min-width: 100%;*/
      /*min-height: 518px;*/
      /*max-height: 540px;*/
      height:100%;
      position: relative;
      .top {
        /*height:120px;*/
        height:20%;
        z-index: 9;
        position: relative;
        .logo {
          width: 200px;
          height: 77px;
          margin-left:80px;
          // cursor: pointer;
        }
        .time {
          width: 94%;
          font-size: 16px;
          text-align: right;
          color: #6860F4;
          text-shadow: 3px 3px 3px #6860F4;
        }
      }

      .footer {
        height:10%;
        width: 100%;
        padding: 48px 0 24px 0px;
        text-align: center;
        .links {
          font-size: 12px;
          a {
            color: rgba(0, 0, 0, 0.45);
            &:not(:last-child) {
              margin-right: 40px;
            }
          }
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
