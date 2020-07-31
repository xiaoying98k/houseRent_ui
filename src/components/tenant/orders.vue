<template>
  <div>
  <el-table
    :data="orderList"
    style="width: 100%">
    <el-table-column
      prop="houseNumber"
      label="小区名"
      width="180">
    </el-table-column>
    <el-table-column
      prop="houseTimeType"
      label="租期"
      width="100">
    </el-table-column>
    <el-table-column
      prop="houseRentType"
      label="租住方式"
      width="100">
    </el-table-column>
    <el-table-column
      prop="orderTime"
      label="时间"
      width="180">
    </el-table-column>
    <el-table-column
      prop="rentTime"
      label="租住时长"
      width="120">
    </el-table-column>
    <el-table-column
      prop="housePrice"
      label="价格"
      width="100">
    </el-table-column>
    <el-table-column
      prop="deposit"
      label="押金"
      width="100">
    </el-table-column>
    <el-table-column
      prop="state"
      label="状态"
      width="100">
    </el-table-column>
    <el-table-column
      prop="ownerName"
      label="联系人"
      width="150">
    </el-table-column>
    <el-table-column
      prop="ownerPhone"
      label="电话"
      width="150">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="200">
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="primary" size="mini" round v-if="scope.row.state=='待付款'">立即付款</el-button>
        <el-button @click="cancelOrder(scope.row)" type="info" size="mini" round v-if="scope.row.state=='待付款'">取消预订</el-button>
        <el-tooltip class="item" effect="dark" content="等待房主确认" placement="top-start" v-if="scope.row.state=='待确认'">
          <el-button type="warning"  icon="el-icon-question"  circle></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="订单已完成" placement="top-start" v-if="scope.row.state=='已付款'">
          <el-button type="success"  icon="el-icon-success" circle></el-button>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog title="支付租金"   :visible.sync="payDialogVisible" width="30%" auto-complete>
    <el-input placeholder="请输入您的支付密码" type="password" v-model="payJson.payPwd" maxlength="6" minlength="6"> <template slot="prepend">支付密码:</template></el-input>
    <p></p>
      <span style="font-size:18px;display: inline-block;position: relative;left: 260px;top: 10px">租金共计:&nbsp&nbsp<span style="color:red;font-size: 24px">{{total}}</span></span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="payDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="pay">确 定</el-button>
        </span>
  </el-dialog>
</div>
</template>

<script>
    export default {
        name: "orders",
        props:{
          orderList:{
            type:Array,
            default(){
              return [];
            }
          }
        },
        data(){
          return  {
            payDialogVisible:false,
            orders:{
              id:'',
              state:''
            },
            payJson:{
              payeeId:'',
              payerId:'',
              payPwd:'',//支付密码
              rental:'',//租金
              deposit:'',//押金
              money:'',//共计
              tenancy:'',//租住时长
              houseId:'',
            },
            total:''
          }
        },
        methods:{
          pay(){
            this.$axios.post("/api/user/payment",this.payJson).then(res=>{
              console.log(res)
              if (res.data.respCode=="000000"){
                this.$message.success("支付成功")
                //支付成功后开始修改订单状态
                this.$axios.post("/api/orders/update",this.orders).then(res=>{
                  this.$emit("refresh")
                  console.log(res)
                  var user=JSON.parse(sessionStorage.getItem("user"))
                  user.money=user.money-this.payJson.money
                  user=JSON.stringify(user)
                  sessionStorage.setItem("user",user)
                  if (res.data==true){
                    this.$message.success("修改状态成功")
                  } else {
                    this.$message.warning("修改状态失败")
                  }
                }).catch(res=>{
                  this.$emit("refresh")
                  this.$message.error("系统出错")
                })

              } else {
                this.$message.warning("支付失败！"+res.data.respMsg)
              }
            }).catch(res=>{
              this.$emit("refresh")
              this.$message.error("系统出错")
            })
            this.payDialogVisible=false;
          },
          cancelOrder(order){
            this.$confirm('取消此预订单?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$axios.get("/api/orders/delete/"+order.id).then(res=>{
                console.log(res)
                this.$emit("refresh")
                if (res.data.respCode=="000000") {
                  this.$message.success(res.data.respMsg)
                }else {
                  this.$message.warning(res.data)
                }
              }).catch(res=>{
                this.$message.error("抱歉，系统出错，操作失败")
                this.$emit("refresh")
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '操作取消'
              });
            });
          },
          handleClick(order){
            var date=new Date()
            if (order.rentTime=='一天'){
              date.setDate(date.getDate()+1)
            }else if(order.rentTime=='一个月'){
              date.setMonth(date.getMonth()+1)
            }else if (order.rentTime=='一年') {
              date.setFullYear(date.getFullYear()+1)
            }
            this.payJson.tenancy=date.Format("yyyy-M-d h:m:s")
            this.total=order.housePrice+order.deposit;
            this.payJson.payeeId=order.ownerId;
            this.payJson.payerId=order.rentId;
            this.payJson.money=this.total;
            this.payJson.deposit=order.deposit;
            this.payJson.rental=order.housePrice;
            this.payJson.houseId=order.houseId;
            this.payDialogVisible=true;
            this.orders.id=order.id;
            this.orders.state='已付款';
          }
        }
    }
</script>

<style scoped>

</style>
