<template>
  <el-table
    :data="orderList"
      border
      style="width: 100%">
    <el-table-column
      prop="houseNumber"
      label="小区名"
      width="180">
    </el-table-column>
    <el-table-column
      prop="houseTimeType"
      label="租期要求"
      width="120">
    </el-table-column>
    <el-table-column
      prop="rentTime"
      label="租住时长"
      width="120">
    </el-table-column>
    <el-table-column
      prop="orderTime"
      label="时间"
      width="180">
    </el-table-column>
    <el-table-column
      prop="houseRentType"
      label="租住方式"
      width="120">
    </el-table-column>
    <el-table-column
      prop="housePrice"
      label="租金"
      width="120">
    </el-table-column>
    <el-table-column
      prop="deposit"
      label="押金"
      width="120">
    </el-table-column>
    <el-table-column
      prop="state"
      label="状态"
      width="120">
    </el-table-column>
    <el-table-column
      prop="rentName"
      label="预定人">
    </el-table-column>
    <el-table-column
      prop="rentPhone"
      label="联系电话">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="180">
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="primary" size="mini" round v-if="scope.row.state=='待确认'">接受</el-button>
        <el-button @click="cancelOrder(scope.row)" type="info" size="mini" round v-if="scope.row.state=='待确认'">忽略</el-button>

        <el-tooltip class="item" effect="dark" content="等待对方确认" placement="top-start" v-if="scope.row.state=='待付款'">
        <el-button type="warning"  icon="el-icon-question"  circle></el-button>
       </el-tooltip>

        <el-tooltip class="item" effect="dark" content="订单已完成" placement="top-start" v-if="scope.row.state=='已付款'">
          <el-button type="success"  icon="el-icon-success" circle></el-button>
        </el-tooltip>

      </template>
    </el-table-column>
  </el-table>
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
            orders:{
              id:'',
              state:''
            }
          }
        },
        methods:{
          handleClick(order){
            this.orders.id=order.id;
            this.orders.state='待付款'
            this.$axios.post("/api/orders/update",this.orders).then(res=>{
              this.$emit("refresh")
              console.log(res)
              if (res.data==true){
                this.$message.success("确认成功")

              } else {
                this.$message.warning("确认失败")
              }
            }).catch(res=>{
              this.$message.error("系统出错")
              this.$emit("refresh")
            })
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
          }
        }
    }
</script>

<style>

</style>
