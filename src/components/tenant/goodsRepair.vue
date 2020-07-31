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
        prop="rent.tenancy"
        label="租期截止"
        width="160">
      </el-table-column>
      <el-table-column
        prop="repair.time"
        label="提交日期"
        width="160">
        <template slot-scope="scope">{{scope.row.repair==null?'无':scope.row.repair.time}}</template>
      </el-table-column>
      <el-table-column
        prop="repair.goodsDesc"
        label="物品维修信息"
        width="400">
        <template slot-scope="scope">{{scope.row.repair==null?'无':scope.row.repair.goodsDesc}}</template>
      </el-table-column>
      <el-table-column
        prop="owner.phone"
        label="房东电话"
        width="150">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="220">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="success" size="mini" round>物品报修</el-button>
          <el-popover
            placement="bottom"
            width="400"
            trigger="click"
          v-if="scope.row.repair!=null">
            <el-steps :space="200" :active="scope.row.repair.state=='待维修'?1:3" finish-status="success">
              <el-step title="已提交"></el-step>
              <el-step title="维修中"></el-step>
              <el-step title="完成"></el-step>
            </el-steps>
            <el-button  slot="reference" type="info" size="mini" round >维修进度</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="维修申请"   :visible.sync="goodsDialogVisible" width="30%" auto-complete>
      <el-form v-model="goodsInfo">
        <el-form-item label="小区信息">
          <el-input v-model="goodsInfo.houseNumber" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="物品维修描述">
          <el-input
            type="textarea"
            placeholder="请说明需要维修的物品并加上适当的问题描述（例：厕所堵了  客厅灯坏了）"
            v-model="goodsInfo.goodsDesc"
            maxlength="100"
            show-word-limit
            :rows="5"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
            <el-button @click="goodsDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addRepair">提 交</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "goodsRepair",
    data(){
      return  {
        loginUser:{},
        rentList:[],
        goodsDialogVisible:false,
        goodsInfo:{
          //描述信息
          houseNumber:'',
          rentId:-1,
          houseId:-1,
          ownerId:-1,
          goodsDesc:'',
        },
      }
    },
    methods:{
      addRepair(){
        console.log(this.goodsInfo)
        this.$axios.post("/api/repair/add",this.goodsInfo).then(res=>{
          console.log(res)
          if (res.data.respCode=="000000"){
            this.searchRentAndRepair()
            this.$message.success("维修申请已提交")
          } else {
            this.$message.warning("抱歉，维修申请失败!"+res.data.respMsg)
          }
        }).catch(res=>{
          this.$message.error("抱歉，系统出错")
        })
        this.goodsDialogVisible=false;
      },

      handleClick(rent){
        this.goodsInfo.houseNumber=rent.house.number
        this.goodsInfo.houseId=rent.rent.houseId
        this.goodsInfo.ownerId=rent.rent.ownerId
        this.goodsInfo.rentId=rent.rent.rentId
        this.goodsDialogVisible=true;

      },

      searchRentAndRepair(){
        this.$axios.get("/api/rent/searchRentAndRepairByRentId/"+this.loginUser.id).then(res=>{
          this.rentList=res.data
          console.log(res.data)
        })
      }
    },
    mounted() {
      this.searchRentAndRepair();
    },
    created() {
      this.loginUser=JSON.parse(sessionStorage.getItem("user"))
    }
  }
</script>

<style scoped>

</style>
