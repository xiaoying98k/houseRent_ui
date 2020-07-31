<template>
  <div>
  <el-tabs  v-model="type" type="border-card"  @tab-click="searchHouseList">
    <el-tab-pane label="全部" :name=0></el-tab-pane>
    <el-tab-pane label="待出租" :name=1></el-tab-pane>
    <el-tab-pane label="已出租" :name=2></el-tab-pane>

  </el-tabs>
  <div class="searchInfo" v-if="houseList">
    <div class="houseInfo" v-for="house in houseList" :key="house.id">
      <el-image
        style="width: 250px;"
        :src="house.image">
      </el-image>
      <div class="miaoshu">
        <p>
          <el-tooltip class="item" effect="light" content="点击修改房源信息" placement="top-end">
             <el-link @click="toEdit(house)" style="font-size: 25px;">{{house.rentType}}·{{house.number}} {{house.houseType}}</el-link>
          </el-tooltip>
          <span v-if="house.timeType=='年租'" style="position:absolute;font-size:2em;color:red;right: 40px">{{house.price}} 元/年</span>
          <span v-if="house.timeType=='日租'" style="position:absolute;font-size:2em;color:red;right: 40px">{{house.price}} 元/天</span>
          <span v-if="house.timeType!='日租'&&house.timeType!='年租'" style="position:absolute;font-size:2em;color:red;right: 40px">{{house.price}} 元/月</span>
        </p>
        <p style="font-size: 18px">{{house.location}}<span style="position:absolute;font-size:1em;color:cornflowerblue;right:40px">注:押金({{house.deposit}}元)</span></p>
        <p><label style="color: silver">{{house.label}}</label></p>
        <p>{{house.count}}人预定过</p>
      </div>
    </div>
    <!--<el-pagination-->
      <!--background-->
      <!--layout="prev, pager, next"-->
      <!--:total="1000">-->
    <!--</el-pagination>-->
    <edit-house v-if="showEdit"></edit-house>
  </div>
  </div>
</template>

<script>
    export default {
      name: "myIssue",
      data(){
          return {
            showEdit:false,
            loginUser:{},
            type:0,
            houseList: [{
              ownerId:-1,
              number: '',
              houseType: '',
              image: '',
              location: '',
              price: '',
              rentType: '',
              timeType:'',
              area:'',
              label:'',
              houseDesc: '',
              renting:1
            }],
          }
        },
      methods:{
        toEdit(house){
          this.$router.push({name:'editHouse',query:{houseInfo:house}})
        },
        searchHouseList(){
          this.$axios.get("api/house/get/"+this.loginUser.id+"/"+this.type).then(res=>{
            console.log(res)
            var resp=res.data
              if (resp.respCode==resp.SUCCESS){
                this.$message.success(resp.respMsg)
                this.houseList=resp.data;
              }else {
                this.$message.warning(resp.respMsg)
              }
          })
        }
      },
      created(){
        this.loginUser=JSON.parse(sessionStorage.getItem("user"))
        this.searchHouseList();

      }
    }
</script>

<style scoped>
  .searchInfo{
    width: 1300px;
    height: 450px;
    padding-top: 10px;
    margin-left: 80px;
  }
  .houseInfo{
    width: 100%;
    height: 240px;
  }
  .miaoshu {
    position: relative;
    top: -20px;
    left:120px;
    width: 700px;
    height: 180px;
    margin: 0px 20px;
    display: inline-block;
  }
</style>
