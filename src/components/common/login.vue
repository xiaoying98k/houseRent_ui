<template>
  <div  class="login" v-loading="loading"
        element-loading-text="登录中">
    <el-container><el-header height="200px" width="400px" style="font-size: 4em;margin: 30px auto;letter-spacing:30px;color: aliceblue">房屋出租管理系统</el-header></el-container>
  <el-form  :model="loginData" class="login_box" :rules="loginRules" ref="loginForm">
    <el-form-item label="" prop="name">
      <el-input  prefix-icon="el-icon-user" placeholder="请输入账号" type="text" maxlength="15" v-model="loginData.name"></el-input>
    </el-form-item>
    <el-form-item label="" prop="password">
      <el-input   prefix-icon="el-icon-unlock" placeholder="请输入密码" type="password" maxlength="15" v-model="loginData.password" show-password></el-input>
    </el-form-item>
    <el-form-item>
      <el-radio-group v-model="loginData.type">
        <el-radio :label="1">租客</el-radio>
        <el-radio :label="2">房主</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item class="btns">
      <el-button type="text" @click="dialogFormVisible = true" style="margin-right: 120px">没有账号?点我注册</el-button>
      <el-button type="primary" @click="login('loginForm')">登录</el-button>
      <el-button type="info" @click="resetForm('loginForm')">重置</el-button>
    </el-form-item>
  </el-form>
    <!--用户注册弹出框-->
    <el-dialog title="用户注册"  :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form :model="registryInfo" :rules="registryRules" ref="registryForm">
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-radio-group v-model="registryInfo.type">
            <el-radio :label="1">租客</el-radio>
            <el-radio :label="2">房主</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="账号" prop="name" :label-width="formLabelWidth">
          <el-input size="small" @blur="checkExist(registryInfo.name)" style="width: 50%" v-model="registryInfo.name" maxlength="15" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称" :label-width="formLabelWidth">
          <el-input size="small" placeholder="(非必填,最大长度不可超过15个字符)"style="width: 50%" v-model="registryInfo.nickname" maxlength="15" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
          <el-input size="small" style="width: 50%" type="password" v-model="registryInfo.password" maxlength="15" show-password autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="againPassword" :label-width="formLabelWidth">
          <el-input size="small" style="width: 50%" type="password" v-model="registryInfo.againPassword" maxlength="15" show-password autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" prop="phone" :label-width="formLabelWidth">
          <el-input size="small" style="width: 50%" v-model="registryInfo.phone" maxlength="11" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="支付密码" prop="payPwd" :label-width="formLabelWidth">
          <el-input size="small" style="width: 50%" type="password" v-model="registryInfo.payPwd" maxlength="6" show-password autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认支付密码" prop="againPayPwd" :label-width="formLabelWidth">
          <el-input size="small" style="width: 50%" type="password" v-model="registryInfo.againPayPwd" maxlength="6" show-password autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="registry('registryForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

    export default {
        name: "login",
      data(){
        var validatePass1 = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再次输入密码'));
          } else if (value !== this.registryInfo.password) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
        };
        var validatePass2 = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再次输入密码'));
          } else if (value !== this.registryInfo.payPwd) {
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
          return{
            loading:false,
            loginData:{
              name:'',
              password:'',
              type:1
            },
            loginRules:{
              name:[
                {required:true,message:"请输入您的用户名",trigger:'blur'},
                {validator:checkName,trigger:'blur'|'change'}
              ],
              password:[
                {required:true,message:"请输入您的密码",trigger:'blur'},
                {validator:checkName,trigger:'blur'|'change'}
              ]
            },
            registryInfo:{
              name:'',
              nickname:'',
              password:'',
              againPassword:'',
              type:1,
              payPwd:'',
              againPayPwd:'',
              phone:''
            },
            registryRules:{
              name:[
                {required:true,message:"请输入您的用户名",trigger:'blur'},
                {validator:checkName,trigger:'blur'|'change'}
              ],
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
            dialogFormVisible: false
          };
      },
      methods:{
          //登录方法
        login(formName){
            this.$refs[formName].validate(valid => {
              if (valid) {
                this.loading=true;
                this.$axios.post("/api/user/login",this.loginData)
                  .then(res=> {
                    console.log(res);
                    if (res.data.name!=null){
                      //登录成功，跳转到首页
                      let user = res.data
                      console.log(user)
                      this.$store.commit('setUser',user)
                      this.$router.push({name:'console',query:{user:user}})
                      this.loading=false;
                    }else {
                      this.$message.error("账号或密码错误，登录失败！")
                      this.loading=false;
                    }
                    }).catch(res=>{
                      this.$message.error("系统出错")
                      this.loading=false;

                })
              }else {
                this.$message.error("请正确填写您的账号信息")
                return false;
              }
            })
          },
        //检查注册用是否已经存在
        checkExist(name){
          let reg = /^[A-Za-z0-9]{6,15}$/;
          if (name != '' && reg.test(name)){
            var param={
              name:name
            }
            this.$axios.post("/api/user/login",param)
              .then(res=> {
                if (res.data.name==null){
                  this.$message.success("恭喜您，该账号可以使用")
                } else {
                  this.$message.error("该账号已被人注册，请重新设置")
                  this.registryInfo.name='';
                }
              })
          }
        },
        //注册用户
        registry(formName){
          this.$refs[formName].validate(valid => {
            if (valid) {
              this.$axios.post("/api/user/registry",this.registryInfo)
                .then(res=> {
                  console.log(res);
                })
            }else {
              this.$message.error("请正确填写所有注册信息");
              return false;
            }
          })
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
        }
      }
    }
</script>

<style scoped>
  .login{
    height: 100%;
    background-color: #2b4b6b;
  }
  .login_box{
    width: 450px;
    height: 350px;
    background-color: aliceblue;
    border-radius: 3px;
    left: 0;
    top: 0;
    padding: 80px 10px;
    transform: translate(120%,70%);
    box-sizing: border-box;
    position: absolute;
  }
  .btns{
    display: flex;
    justify-content: flex-end;
  }
</style>
