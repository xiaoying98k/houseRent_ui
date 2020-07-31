<template>
  <div>
    <el-table
      :data="rentList"
      style="width: 100%">
      <el-table-column
        prop="house.location"
        label="区域"
        width="200">
      </el-table-column>
      <el-table-column
        prop="house.number"
        label="小区名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="house.timeType"
        label="租期"
        width="80">
      </el-table-column>
      <el-table-column
      prop="rent.rentTime"
      label="生效时间"
      width="160">
    </el-table-column>
      <el-table-column
        prop="rent.tenancy"
        label="到期时间"
        width="160">
      </el-table-column>
      <el-table-column
        prop="rent.rental"
        label="租金"
        width="80">
      </el-table-column>
      <el-table-column
        prop="rent.deposit"
        label="押金"
        width="80">
      </el-table-column>
      <el-table-column
        prop="rent.water"
        label="水费"
        width="80">
      </el-table-column>
      <el-table-column
        prop="rent.power"
        label="电费"
        width="80">
      </el-table-column>
      <el-table-column
        prop="tenant.phone"
        label="租户电话"
        width="120">
      </el-table-column>
      <el-table-column
        prop="rent.state"
        label="订单状态"
        width="130">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="160">
        <template slot-scope="scope">
          <el-button v-if="scope.row.rent.state!='已退租,待退押金'&&scope.row.rent.state!='已退租,已退押金'" @click="handleClick(scope.row)" type="primary" size="mini" round>催租提醒</el-button>
          <el-button v-if="scope.row.rent.state=='已退租,待退押金'" @click="handleClick2(scope.row)" type="success" size="mini" round>退还押金</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="催租提醒"   :visible.sync="urgeDialogVisible" width="40%" auto-complete>
      <el-input placeholder="自定义发送给租客的消息" type="textarea" v-model="urge.message" maxlength="60" show-word-limit> <template slot="prepend">消息内容</template></el-input>
      <span slot="footer" class="dialog-footer">
      <el-button @click="urgeDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="sendMessage">发 送</el-button>
  </span>
    </el-dialog>

    <el-dialog title="退还押金"   :visible.sync="depositDialogVisible" width="30%" auto-complete>
      <el-input placeholder="请输入您的支付密码" type="password" v-model="depositJson.payPwd" maxlength="6" minlength="6"> <template slot="prepend">支付密码:</template></el-input>
      <p></p>
      <span style="font-size:18px;display: inline-block;position: relative;left: 180px;top: 10px">退还金额:&nbsp&nbsp<span style="color:red;font-size: 24px">{{depositJson.money}}</span> 元</span>
      <span slot="footer" class="dialog-footer">
            <el-button @click="depositDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="giveBackDeposit">确 认 退 还</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "orderCenter",
    data(){
      return  {
        loginUser:{},
        rentList:[],
        urgeDialogVisible:false,
        depositDialogVisible:false,
        urge:{
          message:'您的租期即将结束，请及时缴租或续租。',
          rentId:-1,
          tenantId:-1,
          houseNumber:''
        },
        depositJson:{
          id:'',
          payerId:'',
          payeeId:'',
          money:0,//需要退还的押金
          payPwd:'',//支付密码
        },

      }
    },
    methods:{
      handleChange(){
      },
      handleClick(rent){//催租提醒
        this.urge.rentId=rent.rent.id
        this.urge.tenantId=rent.tenant.id
        this.urge.houseNumber=rent.house.number
        this.urgeDialogVisible=true;

      },
      handleClick2(rent){//退还押金
        this.depositJson.id=rent.rent.id
        this.depositJson.payeeId=rent.tenant.id
        this.depositJson.payerId=rent.rent.ownerId
        this.depositJson.money=rent.rent.deposit
        this.depositDialogVisible=true;

      },

      giveBackDeposit(){
        this.$axios.post("/api/user/giveBackDeposit",this.depositJson).then(res=>{
          console.log(res)
          if (res.data.respCode=="000000"){
            this.searchRent()
            this.$message.success(res.data.respMsg)
          } else {
            this.$message.warning(res.data.respMsg)
          }
        }).catch(res=>{
          this.$message.error("系统错误")
        })
        this.depositDialogVisible=false;
      },
      sendMessage(){
        this.$axios.post("/api/rent/urge",this.urge).then(res=>{
          console.log(res)
          if (res.data.respCode=="000000"){
            this.searchRent()
            this.$message.success(res.data.respMsg)
          } else {
            this.$message.warning(res.data.respMsg)
          }
        }).catch(res=>{
          this.$message.error("系统错误")
        })
        this.urgeDialogVisible=false;
      },

      searchRent(){
        this.$axios.get("/api/rent/doSearchByOwnerId/"+this.loginUser.id).then(res=>{
          this.rentList=res.data
          console.log(res)
        })
      }
    },
    mounted() {
      this.searchRent();
    },
    created() {
      this.loginUser=JSON.parse(sessionStorage.getItem("user"))
    }
  }
</script>

<style scoped>

</style>
