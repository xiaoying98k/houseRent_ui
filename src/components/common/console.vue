<template>
  <div>
    <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#00FA9A">
      <el-menu-item index="1" @click="changeView('home')">首页</el-menu-item>
      <el-submenu index="2"  v-if="loginUser.type==2">
        <template slot="title">房屋管理</template>
        <el-menu-item index="2-1" @click="changeView('myIssue')">我的发布</el-menu-item>
        <el-menu-item index="2-2" @click="changeView('orderCenter')">订单中心</el-menu-item>
      </el-submenu>
      <el-menu-item index="3" @click="changeView('message')" v-if="loginUser.type==2">
        <el-badge v-if="messageCount>0"  :max="10" type="danger" :value="messageCount" style="margin-top: -4px">
          消息中心
      </el-badge>
        <template slot="title"  v-if="messageCount==0" >消息中心</template>
      </el-menu-item>
      <el-submenu index="3" v-if="loginUser.type==1">
        <template slot="title">租房管理</template>
        <el-menu-item index="3-1" @click="changeView('orders')">我的预定</el-menu-item>
        <el-menu-item index="3-2" @click="changeView('rentInfo')">租房信息</el-menu-item>
        <el-menu-item index="3-3" @click="changeView('goodsRepair')">物品报修</el-menu-item>
      </el-submenu>
      <el-menu-item index="4" @click="changeView('addHouse')" v-if="loginUser.type==2">房源发布</el-menu-item>
      <el-submenu index="5">
        <template slot="title">{{editInfo.nickname}}</template>
        <el-menu-item index="5-1" @click="showMoney">我的账户</el-menu-item>
        <el-menu-item index="5-2" @click="dialogFormVisible=true">修改资料</el-menu-item>
        <el-menu-item index="5-3"  @click="logout">退出登录</el-menu-item>
      </el-submenu>
      <el-dialog title="修改资料"  :visible.sync="dialogFormVisible" :close-on-click-modal="false" :before-close="cancel">
        <el-form :model="editInfo" :rules="editRules" ref="editForm">
          <el-form-item label="角色" :label-width="formLabelWidth">
            <el-radio-group v-model="editInfo.type" disabled>
              <el-radio :label="1">租客</el-radio>
              <el-radio :label="2">房主</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="账号" prop="name" :label-width="formLabelWidth">
            <el-input disabled size="small" style="width: 50%" v-model="editInfo.name"  autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="昵称" :label-width="formLabelWidth">
            <el-input size="small" placeholder="(非必填,最大长度不可超过15个字符)"style="width: 50%" v-model="editInfo.nickname" maxlength="15" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
            <el-input size="small" style="width: 50%" type="password" v-model="editInfo.password" maxlength="15" show-password autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="againPassword" :label-width="formLabelWidth">
            <el-input size="small" style="width: 50%" type="password" v-model="editInfo.againPassword" maxlength="15" show-password autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话号码" prop="phone" :label-width="formLabelWidth">
            <el-input size="small" style="width: 50%" v-model="editInfo.phone" maxlength="11" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="支付密码" prop="payPwd" :label-width="formLabelWidth">
            <el-input size="small" style="width: 50%" type="password" v-model="editInfo.payPwd" maxlength="6" show-password autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认支付密码" prop="againPayPwd" :label-width="formLabelWidth">
            <el-input size="small" style="width: 50%" type="password" v-model="editInfo.againPayPwd" maxlength="6" show-password autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="edit('editForm')">确 定</el-button>
        </div>
      </el-dialog>
    </el-menu>
    <message v-if="view=='message'" :orderList="orderList" @refresh="searchOrder"></message>
    <orders v-if="view=='orders'" :orderList="orderList" @refresh="searchOrder"></orders>
    <home v-if="view=='home'"></home>
    <add-house v-if="view=='addHouse'"></add-house>
    <my-issue v-if="view=='myIssue'"></my-issue>
    <rent-info v-if="view=='rentInfo'"></rent-info>
    <order-center v-if="view=='orderCenter'"></order-center>
    <goods-repair v-if="view=='goodsRepair'"></goods-repair>
  </div>
</template>
<script>
  import home from "@/components/common/home"
  import addHouse from "@/components/owner/addHouse"
  import message from "@/components/owner/message";
  import orders from "@/components/tenant/orders"
  import rentInfo from "@/components/tenant/rentInfo"
  import MyIssue from "@/components/owner/myIssue";
  import orderCenter from "@/components/owner/orderCenter";
  import GoodsRepair from "@/components/tenant/goodsRepair";
  import VuePopper from "element-ui/lib/utils/vue-popper";
  export default {

    name:'console',
    components: {VuePopper, GoodsRepair, orderCenter, MyIssue, message,home,addHouse,orders,rentInfo},
    data() {
      var validatePass1 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.editInfo.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.editInfo.payPwd) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      var checkPhone = (rule, value, callback) => {
        let reg = /^1[345789]\d{9}$/;
        if (value != '' && reg.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的手机号'))
        }
      };
      var checkName = (rule, value, callback) => {
        let reg = /^[A-Za-z0-9]{6,15}$/;
        if (value != '' && reg.test(value)) {
          callback()
        } else {
          callback(new Error('由6到15为数字或英文字母组成'))
        }
      };
      var checkPayPwd = (rule, value, callback) => {
        let reg = /^\d{6}$/;
        if (value != '' && reg.test(value)) {
          callback()
        } else {
          callback(new Error('支付密码为6位数字组成'))
        }
      };
      return {
        loginUser:{},
        notifyUrl:'',
        messageCount:0,
        view:'home',
        input:'',
        select: '',
        editInfo:{
          name:'',
          nickname:'',
          password:'',
          againPassword:'',
          type:1,
          payPwd:'',
          againPayPwd:'',
          phone:''
        },
        orderList:[
          {
            id:'',
            ownerId:-1,
            houseId:-1,
            rentId:-1,
            rentName:'',
            rentPhone:'',
            houseNumber:'',
            housePrice:'',
            deposit:'',
            rentTime:'',
            state:'',
            houseTimeType:'',
            houseRentType:'',
          }
        ],
        editRules:{
          phone:[
            {required:true,message:"手机号码为11位数字",trigger:'blur'|'change'},
            {validator:checkPhone,trigger:'blur'|'change'}
          ],
          password:[
            {required:true,message:"请输入您的登录密码",trigger:'blur'},
            {validator:checkName,trigger:'blur'|'change'}
          ],
          againPassword:[
            {required:true,message:"请再次确认登录密码",trigger:'blur'|'change'},
            {validator:validatePass1,trigger:'blur'}
          ],
          payPwd:[
            {required:true,message:"支付密码必须为6位数字",trigger:'blur'|'change'},
            {validator:checkPayPwd,trigger:'blur'|'change'}
          ],
          againPayPwd:[
            {required:true,message:"请再次确认支付密码",trigger:'blur'|'change'},
            {validator:validatePass2,trigger:'blur'}
          ]
        },
        formLabelWidth: '120px',
        dialogFormVisible:false,
        activeIndex: '1',
        activeIndex2: '1'
      };
    },
    methods: {
      logout(){
        this.$router.push("/login")
      },
      showMoney(){
          this.$alert('您的账户余额为:  '+JSON.parse(sessionStorage.getItem("user")).money+' 元', '账户余额', {
            confirmButtonText: '确定',
          });
        }
      ,
      changeView(viewName){
        this.view=viewName;
        this.searchOrder()
      },
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      cancel(){
        this.dialogFormVisible = false;
        this.editInfo=JSON.parse(sessionStorage.getItem("user"))
      },

      edit(formName){
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.$axios.post("/api/user/update",this.editInfo)
              .then(res=> {
                console.log(res);
                if (res.data=true){
                  //修改成功，返回登录页
                  this.$message.success("修改个人信息成功，请重新登录")
                  this.$router.push({name:'login'})
                }else {
                  this.$message.error("修改个人信息失败")
                }
              })
              .catch(res=>{
                this.$message.error("请求失败")
              })
          }else {
            this.$message.error("请正确填写您的个人信息")
            return false;
          }
        })
      },

      searchOrder(){
        var url=''
        console.log(this.loginUser)
        if (this.loginUser.type==2){
           url='/api/orders/doSearchByOwnerId/'
        } else {
           url='/api/orders/doSearchByRentId/'
        }
        this.$axios.get(url+this.editInfo.id)
          .then(res=>{
            console.log(res)
              this.orderList=res.data
              var count=0;
              for (var i=0;i<this.orderList.length;i++)  {
                if (this.orderList[i].state=="待确认"){
                  count++
                }
              }
              this.messageCount=count
          })
      },
      //======================= WebSocket相关 =======================
      initWebSocket(){
        if (typeof WebSocket === "undefined") {
          alert("您的浏览器不支持socket");
        } else {
          // 监听地址
          this.notifyUrl = "ws:127.0.0.1/webSocket/" +this.loginUser.id+"/"+this.loginUser.type;
          // 实例化socket
          console.log(this.notifyUrl)
          this.socket = new WebSocket(this.notifyUrl);
          // 监听socket连接
          this.socket.onopen = this.openWebSocket;
          // 监听socket错误信息
          this.socket.onerror = this.errorWebSocket;
          // 监听socket消息
          this.socket.onmessage = this.getSocketMsg;
          // 路由跳转时结束websocket链接
          let testSocket = this.socket;
          this.$router.afterEach(function() {
            testSocket.close();
          });
        }
      },
      openWebSocket(){
        console.log("WebSocket连接成功");
      },
      errorWebSocket(){
        console.log("WebSocket连接发生错误");
      },
      // 监听后端获取数据
      getSocketMsg(res) {
        console.log(res)
        var resJson=JSON.parse(res.data)
        if (resJson.title=="预订单消息"){
          var orderInfo=resJson.message;
          this.searchOrder()
          this.$notify({
            title: "新消息",
            message:orderInfo,
            duration: 0
          });
        } else if (resJson.title=="催租提醒"){
          var urgeInfo=JSON.parse(res.data)
          var  urgeTime=urgeInfo.urgeTime
          var  urgeMessage=urgeInfo.message
          var  houseNumber=urgeInfo.houseNumber
          this.$notify({
            title: "催租提醒"+" ("+urgeTime+")",
            message: urgeMessage+"    ["+houseNumber+"]",
            duration: 0
          });
        }else if(resJson.title=="物品报修申请"){
          var goodsRepairInfo=JSON.parse(res.data)
          var time=goodsRepairInfo.time
          var message=goodsRepairInfo.message
          var houseNumber=goodsRepairInfo.houseNumber
          var  id=goodsRepairInfo.id
          const h=this.$createElement
         const instance=this.$notify({
            title: "物品维修申请"+" ("+time+")",
            message: h('p', [
              h('p', null, message+"["+houseNumber+"]"),
              h('p', {
                style: 'text-align: right;width:195px;dispaly:block;margin-top: 8px;color:#43c39d;cursor:pointer',
                on: {
                  click: () => {
                   instance.close()
                  this.changeGoodsState(id)
                  },
                },
              }, '我已处理'),
            ]),
            duration: 0,
          });
        }
      },
      closeWebSocket(){
        console.log("socket已经关闭");
      },

      //房主提交物品维修结果（修改状态）
      changeGoodsState(id){
        this.$axios.get("/api/repair/updateById/"+id).then(res=>{
          if (res.data.respCode=="000000"){
              this.$message.success(res.data.respMsg)
          }else {
            this.$message.warning(res.data.respMsg)
          }
        }).catch(res=>{
          this.$message.error("系统出错")
        })
      }
    },
    created(){
      this.editInfo=JSON.parse(sessionStorage.getItem("user"))
      this.loginUser=JSON.parse(sessionStorage.getItem("user"))
      // window.setInterval(()=>{
      //   setTimeout(this.searchOrder(),0)
      // },10000)
    },
    mounted() {// 初始化WebSocket
      this.searchOrder()
      this.initWebSocket();
    },

  }
</script>

<style>
  .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
  .el-badge__content.is-fixed{
    top:12px;

  }

</style>
