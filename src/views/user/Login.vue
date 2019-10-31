<template>
  <div id="login" class="main">
    <div class="loginBox">
      <div class="contentBox">
        <a-form
          id="formLogin"
          class="user-layout-login"
          ref="formLogin"
          :form="form"
          @submit="handleSubmit">
          <a-form-item :style="{marginBottom:'5px',height:screenSize=='default'?'52px':'62px'}">
            <a-input
              :size="screenSize"
              type="text"
              placeholder="账户名或邮箱地址 / admin"
              v-decorator="[
                'username',
                {rules: [{ required: true, message: '账号不能为空！' }, { validator: handleUsernameOrEmail }], validateTrigger: 'blur'}
              ]">
              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>

          <a-form-item :style="{marginBottom:'5px',height:screenSize=='default'?'52px':'62px'}">
            <a-input
              :size="screenSize"
              type="password"
              autocomplete="false"
              placeholder="密码 / admin"
              v-decorator="[
                'password',
                {rules: [{ required: true, message: '密码不能为空！' }], validateTrigger: 'blur'}
              ]">
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>

          <a-form-item style="margin-top: 10px;">
            <a-button
              :size="screenSize"
              type="primary"
              htmlType="submit"
              :class="['login-button', state.loginBtn ? '' : 'animation-login']"
              :loading="state.loginBtn"
              :disabled="state.loginBtn"
              >登录</a-button>
          </a-form-item>

          <!-- <a-form-item :style="{marginBottom:'5px',height:screenSize=='default'?'52px':'62px'}">
            <a-input
              style="width: 70%" 
              :size="screenSize"
              type="text"
              placeholder="验证码"
              v-decorator="[
                'kaptcha', 
                {rules: [{ required: true, message: '验证码有误！' }], validateTrigger: 'blur'}
              ]">
              <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
            <img style="width: 30%; height: 32px; margin-top: -6px;" :size="screenSize" :src="kaptchaUrl" @click="refreshKaptcha"/>
          </a-form-item> -->
        </a-form>
      </div>
    </div>
  </div>
</template>

<script>
  import { timeFix } from '@/utils/util'
  import { mapActions } from 'vuex'
  import { setTimeout } from 'timers'
  import { createRoute } from '@/utils/util'
  import {getStore, setStore} from "@/utils/storage"

  export default {
    name: 'login',
    data() {
      return {
        customActiveKey: 'tab1',
        // uuid: '',
        form: this.$form.createForm(this),
        screenWidth: document.body.clientWidth,
        screenSize: 'default',
        state: {
          time: 60,
          loginBtn: false,
          // login type: 0 email, 1 username, 2 telephone
          loginType: 0,
          smsSendBtn: false
        }
    }
    },
    computed: {
      // kaptchaUrl () {
      //   return `/api/auth/kaptcha?uuid=${this.uuid}`
      // }
    },
    created() {
      this.screenWidth = document.body.clientWidth
      this.screenSize = this.screenWidth > 800 ? 'large' : 'default'
    },
    watch: {
      screenWidth: function() {
        this.screenSize = this.screenWidth > 800 ? 'large' : 'default'
      }
    },
    mounted() {
      let vm = this
      window.onresize = () => {
        return (() => {
            this.screenWidth = document.body.clientWidth
        })()
      }
      this.$notification.open({
          message: '温馨提示',
          description: '建议使用谷歌浏览器，部分浏览器存在兼容性问题，尤其是IE，360浏览器兼容模式。',
          icon: <a-icon type="smile" style="color: #faad14" />,
          duration:10
      })
    },
    methods: {
      ...mapActions('user', ['login']),
      // refreshKaptcha() {
      //   this.uuid = new UUID().id
      //   console.log('刷新验证码')
      // },
      handleUsernameOrEmail(rule, value, callback) {
        const { state } = this
          const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
          if (regex.test(value)) {
            state.loginType = 0
          } else {
            state.loginType = 1
          }
          callback()
      },
      handleSubmit(e) {
        e.preventDefault()
        const {
          form: { validateFields },
          customActiveKey,
          state,
          login
        } = this

        state.loginBtn = true

        const validateFieldsKey = customActiveKey === 'tab1' ? ['username', 'password'] : ['mobile', 'captcha'] // ['username', 'password', 'kaptcha'] 中的kaptcha是验证码，暂时不要
        validateFields(validateFieldsKey, { force: true }, (err, values) => {
          if(!err) {
            const loginParams = { ...values }
            // login(loginParams)
            //   .then((res) => this.dealDataBeforeLogin(res))
            //   .catch(err => this.requestFailed(err))
            //   .finally(() => {})
            this.loginSuccess()
          } else {
            setTimeout(() => {
              state.loginBtn = false
            }, 600)
          }
        })
      },
      dealDataBeforeLogin (res) {
        let vm = this;
        if(res.data) {
          const obj = {
            userInfo: res.data.member,
            tokenList: res.data.token
          }
          vm.$store.dispatch('setLogin', obj)
          // let params = {
          //   system: "authcenter",
          //   username: obj.userInfo.username,
          //   refresh: 1, // 表示刷新
          // }
          // vm.$store.dispatch('getSideMenu', params).then(() => {
          //   vm.loginSuccess(res)
          // })
        }
        vm.loginSuccess(res)
      },
      loginSuccess (res) {
        this.$router.push({path: '/'})
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，${res.data.member.first_name}，欢迎回来`
        })
        // setTimeout(() => {
        //   // const side_menus = getStore('side_menus', true)
        //   if (side_menus) {
        //     let routes = this.$router.options.routes

        //     side_menus.forEach(function (v) {
        //       routes[0].children.push(createRoute(v))
        //       if(v.children.length > 0) {
        //         v.children.forEach(function (v2) {
        //           routes[0].children.push(createRoute(v2));
        //           if (v2.children) {
        //               v2.children.forEach(function (v3) {
        //                   routes[0].children.push(createRoute(v3));
        //               });
        //           }
        //         })
        //       }
        //     })
        //     this.$router.addRoutes(routes)
        //     this.$router.push({path: '/'})
        //     this.$notification.success({
        //       message: '欢迎',
        //       description: `${timeFix()}，${res.data.member.name}，欢迎回来`
        //     })
        //   }
        // }, 0)
      },
      requestFailed (err) {
        this.$notification['error']({
          message: '登录失败',
          description: '账号或密码不正确',
          duration: 4
        })
        this.state.loginBtn = false
      },
    }
      
  }
</script>

<style lang="less">
  .main{
    width:100%;
    /*height:70%;*/
    display:flex;
    justify-content: center;
  }
  .loginBox{
    /*display:flex;*/
    max-height: 540px;
    min-height: 350px;
    // min-width: 533px;
    min-width: 375px;
    max-width: 802px;
    /*width: 46%;*/
    border-radius:6px;
    // background:red;
    // box-shadow: 0px 0px 16px 0px rgba(0,92,205,0.15);
    // 注释.picBox后添加
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    .picBox{
      display:inline-block;
      width:40%;
      min-width:210px;
      max-width:320px;
      min-height:350px;
      max-height:540px;
      vertical-align: top;
      /*height:100%;*/
      img{
        width:100%;
        height:100%;
      }
    }
    .contentBox{
      display:inline-block;
      // width:60%;
      width: 80%;
      // height:100%;
      height: auto;
      font-family:PingFangSC-Medium;
      font-weight: bold;
      box-sizing: border-box;
      // padding: 0 10%;
      .title{
        font-size:18px;
        // margin-top:18%;
        margin-bottom:18px;
        text-align: center;
      }
      .title-large{
        font-size:30px;
        // margin-top:30%;
        font-size:24px;
        margin-bottom: 30px;
      }
      .description{
        font-size:10px;
      }
      .description-large{
        font-size:14px;
      }
    }
    .ant-form-item{
      margin-bottom: 14px;
      font-size:12px;
    }
    .ant-form-item-with-help{
      margin-bottom:5px;
    }
    .ant-input{
      font-size:12px;
    }
    button.login-button {
      padding: 0 15px;
      font-size: 16px;
      height: 40px;
      width: 100%;
      background: linear-gradient(90deg, rgb(138, 203, 241), #2d8cf0);
      border:none;
    }
  }

</style>

<style lang="less" scoped>
.hint-msg{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
button.animation-login {
  transform: rotate(0deg);
  animation: move 1s infinite;
}
@keyframes  move {
  0% {
    transform: rotate(1deg);
    transform: scale(1.01);
  }
  50% {
    transform: rotate(-1deg);
    transform: scale(0.99);
  }
  100% {
    transform: rotate(0deg);
    transform: scale(1);
  }
}
</style>