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
        width="100">
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
        width="100">
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
        prop="owner.phone"
        label="房东电话">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作 (状态)"
        width="250">
        <template slot-scope="scope" >
          <el-button v-if="scope.row.rent.state=='首租'||scope.row.rent.state=='续租中'" @click="handleClick(scope.row)" type="success" size="mini" round>续租</el-button>
          <el-button v-if="scope.row.rent.state=='首租'||scope.row.rent.state=='续租中'" @click="handleClick2(scope.row)" type="info" size="mini" round >退租结算</el-button>
          <span v-if="scope.row.rent.state=='已退租,待退押金'||scope.row.rent.state=='已退租,已退押金'">订单失效({{scope.row.rent.state}})</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="续租"   :visible.sync="payDialogVisible" width="30%" auto-complete @close="cancel" ref="hi">
      <template>
        <span>续租时长：</span>&nbsp&nbsp
        <el-input-number v-model="timeNum" @change="handleChange" :min="1" :max="10" label="续租时间"></el-input-number>
        <span v-if="curHouseTimeType=='日租'">天</span>
        <span v-else>个月</span>
        <span v-if="curHouseTimeType=='年租'">年</span>
        <br>
      </template>
      <br/>
      <el-input placeholder="请输入您的支付密码" type="password" v-model="reRentJson.payPwd" maxlength="6" minlength="6"> <template slot="prepend">支付密码:</template></el-input>
      <p></p>
      <span style="font-size:18px;display: inline-block;position: relative;left: 260px;top: 10px">租金共计:&nbsp&nbsp<span style="color:red;font-size: 24px">{{reRentJson.money}}</span></span>
      <span slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="pay">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="退租结算"   :visible.sync="backDialogVisible" width="30%" auto-complete>
      <el-input placeholder="请输入您的支付密码" type="password" v-model="giveBackJson.payPwd" maxlength="6" minlength="6"> <template slot="prepend">支付密码:</template></el-input>
      <p></p>
      <span style="font-size:18px;display: inline-block;position: relative;left: 180px;top: 10px">需缴纳水电费共计:&nbsp&nbsp<span style="color:red;font-size: 24px">{{giveBackJson.money}}</span> 元</span>
      <span slot="footer" class="dialog-footer">
            <el-button @click="backDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="giveBack">确 认 退 租</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "rentInfo",
    data(){
      return  {
        loginUser:{},
        rentList:[],
        curHouseTimeType:'',
        curHousePrice:0,
        timeNum: 1,
        payDialogVisible:false,
        backDialogVisible:false,
        reRentJson:{
          id:'',
          payerId:'',
          payeeId:'',
          money:0,//租金
          payPwd:'',//支付密码
          tenancy:'',//续租后的租住到期时间
          houseId:'',
        },
        giveBackJson:{
          id:'',
          payerId:'',
          payeeId:'',
          money:0,//需要缴纳的水电费
          payPwd:'',//支付密码
          tenancy:'',//续租后的租住到期时间
          houseId:'',
        },
      }
    },
    methods:{
      pay(){
        console.log(this.reRentJson)
        this.$axios.post("/api/user/reRent",this.reRentJson).then(res=>{
          console.log(res)
          if (res.data.respCode=="000000"){
            this.searchRent()
            this.$message.success("续租成功")
            var user=JSON.parse(sessionStorage.getItem("user"))
            user.money=user.money-this.reRentJson.money
            user=JSON.stringify(user)
            sessionStorage.setItem("user",user)
          } else {
            this.$message.warning("续租失败!"+res.data.respMsg)
          }
        }).catch(res=>{
          this.$message.error("系统出错")
        })
        this.payDialogVisible=false;
      },

      giveBack(){
        console.log(this.giveBackJson)
        this.$axios.post("/api/user/giveBackRent",this.giveBackJson).then(res=>{
          console.log(res)
          if (res.data.respCode=="000000"){
            this.searchRent()
            this.$message.success("退租成功")
            var user=JSON.parse(sessionStorage.getItem("user"))
            user.money=user.money-this.giveBackJson.money
            user=JSON.stringify(user)
            sessionStorage.setItem("user",user)
          } else {
            this.$message.warning("退租失败!"+res.data.respMsg)
          }
        }).catch(res=>{
          this.$message.error("系统出错")
        })
        this.backDialogVisible=false;
      },

      handleChange(){
        this.reRentJson.money=this.curHousePrice*this.timeNum;
      },
      cancel(){
        this.payDialogVisible = false
        this.timeNum=1
      },
      handleClick(rent){
        this.curHouseTimeType=rent.house.timeType
        this.reRentJson.id =rent.rent.id;
        this.reRentJson.money= rent.house.price
        this.curHousePrice=rent.house.price
        var newDate=new Date(rent.rent.tenancy)
        console.log(newDate.Format("yyyy-M-d h:m:s"))
        if (this.curHouseTimeType=='日租'){
            newDate.setDate(newDate.getDate()+this.timeNum)
        }else if(this.curHouseTimeType=='年租'){
          newDate.setFullYear(newDate.getFullYear()+this.timeNum)
        }else {
          newDate.setMonth(newDate.getMonth()+this.timeNum)
        }
        console.log(newDate.Format("yyyy-M-d h:m:s"))
        this.reRentJson.tenancy=newDate.Format("yyyy-M-d h:m:s");
        this.reRentJson.payeeId=rent.rent.ownerId;
        this.reRentJson.payerId=rent.rent.rentId;
        this.reRentJson.houseId=rent.rent.houseId;
        this.payDialogVisible=true;

      },
      handleClick2(rent){
        this.giveBackJson.id =rent.rent.id;
        this.giveBackJson.money=(rent.rent.power+rent.rent.water).toFixed(2)
        this.giveBackJson.payeeId=rent.rent.ownerId;
        this.giveBackJson.payerId=rent.rent.rentId;
        this.giveBackJson.houseId=rent.rent.houseId;
        this.backDialogVisible=true;

      },

      searchRent(){
        this.$axios.get("/api/rent/doSearchByRentId/"+this.loginUser.id).then(res=>{
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
