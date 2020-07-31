<template>
  <div class="searchInfo" v-if="houseList.length!=0&&houseList[0].ownerId!=-1">
   <p>为您找到{{houseList.length}}条房源信息</p>
    <div class="houseInfo" v-for="house in houseList" :key="house.id">
      <el-image
        style="width: 250px;"
        :src="house.image">
      </el-image>
      <div class="miaoshu">
      <p><el-link @click="openBook(house)" style="font-size: 25px">{{house.rentType}}·{{house.number}} {{house.houseType}}</el-link>
        <span v-if="house.timeType=='年租'" style="position:absolute;font-size:2em;color:red;right: 40px">{{house.price}}元/年</span>
        <span v-if="house.timeType=='日租'" style="position:absolute;font-size:2em;color:red;right: 40px">{{house.price}}元/天</span>
        <span v-if="house.timeType!='日租'&&house.timeType!='年租'" style="position:absolute;font-size:2em;color:red;right: 40px">{{house.price}}元/月</span>
      </p>
        <el-dialog title="发起预定"  :visible.sync="bookVisible">
          <el-table :data="houseArray">
            <el-table-column label="方式" prop="type" width="100"></el-table-column>
            <el-table-column  label="价格" width="100" prop="price"></el-table-column>
            <el-table-column  label="押金" width="100" prop="deposit"></el-table-column>
            <el-table-column  label="小区信息" width="180" prop="number"></el-table-column>
            <el-table-column  label="联系人(电话)" width="220" prop="nameAndPhone"></el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
            <el-button @click="bookVisible = false">取 消</el-button>
            <el-button type="primary" @click="orderHouse">立 即 预 定</el-button>
          </div>
        </el-dialog>
        <p style="font-size: 18px">{{house.location}}<span style="position:absolute;font-size:1em;color:cornflowerblue;right:40px">注:押金({{house.deposit}}元)</span></p>
      <p><label style="color: silver">{{house.label}}</label></p>
      </div>
    </div>
    <!--<el-pagination-->
      <!--background-->
      <!--layout="prev, pager, next"-->
      <!--:total="1000">-->
    <!--</el-pagination>-->
  </div>
</template>

<script>
    import bus from '@/assets/eventBus'
    export default {
      name: "result",
      data(){
          return{
            bookVisible:false,
            owner:{
              id:'',
              name:'',
              nickname:'',
              type:1,
              phone:''
            },
            houseArray:[],
            currentUser:{
              id:'',
              name:'',
              nickname:'',
              type:1,
              phone:''
            },
            orders:{
              ownerId:-1,
              houseId:-1,
              rentId:-1,
              rentName:'',
              ownerName:'',
              ownerPhone:'',
              rentPhone:'',
              rentTime:'',
              houseNumber:'',
              housePrice:'',
              deposit:'',
              houseTimeType:'',
              houseRentType:'',
              state:'',
            },
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
            }]
          }
        },
      created(){
        bus.$on('acceptHouse',houseList=>{
          this.houseList=houseList;
          console.log(this.houseList)
        })
      },
      methods:{
        openBook(house){
          this.$axios.get('/api/user/get/'+house.ownerId).then(res=>{
            if (res.data.name!=''){
              this.owner=res.data;
              this.houseArray[0]=house;
              console.log(this.houseArray)
              //自定义属性
              this.houseArray[0].nameAndPhone=this.owner.nickname+"("+this.owner.phone+")";
              this.houseArray[0].type="("+house.rentType+")"+house.timeType;
              this.bookVisible=true;
              //先在这里封装订单数据
              this.orders.houseId=house.id;
              this.orders.ownerId=house.ownerId;
              this.orders.houseNumber=house.number;
              this.orders.housePrice=house.price;
              this.orders.deposit=house.deposit;
              this.orders.houseRentType=house.rentType;
              this.orders.houseTimeType=house.timeType;
              if (house.timeType=='日租'){
                this.orders.rentTime="一天";
              }else if(house.timeType=='月租'){
                this.orders.rentTime="一个月";
              }else if (house.timeType=='1-3个月') {
                this.orders.rentTime="一个月"
              }else if(house.timeType=='4-6个月'){
                this.orders.rentTime="一个月"
              }else if(house.timeType=='年租'){
                this.orders.rentTime="一年"
              }
              this.currentUser=JSON.parse(sessionStorage.getItem("user"));
              this.orders.rentId=this.currentUser.id;
              this.orders.rentName=this.currentUser.nickname;
              this.orders.rentPhone=this.currentUser.phone;
              this.orders.ownerName=this.owner.nickname;
              this.orders.ownerPhone=this.owner.phone;
              this.orders.state='待确认';
            } else {
              this.$message.error("房屋信息查询失败")
            }
          }).catch(res=>{
            console.log(res)
          })
        },
        orderHouse(){
          console.log(this.orders)
          this.$axios.post('/api/orders/add',this.orders).then(res=>{
            if (res.data.respCode=="000000"){
              this.$message.success(res.data.respMsg)
            } else {
              this.$message.warning(res.data.respMsg)
            }
          }).catch(rse=>{
            this.$message.error("系统出错")
          })
          this.bookVisible=false;
        }
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
    left:150px;
    width: 700px;
    height: 180px;
    margin: 0px 20px;
    display: inline-block;
  }
</style>
