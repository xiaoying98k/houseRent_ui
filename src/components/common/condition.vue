<template>
<div>
<div style="margin-top: 15px;">
  <el-input placeholder="请输入城市区域名或者小区名称搜索" v-model="searchValue.locationAndNumber" class="input-with-select" style=" margin-left:150px;width: 840px">
    <template slot="prepend">区域 / 小区名</template>
    <el-button slot="append" icon="el-icon-search" @click="fuzzySearch"></el-button>
  </el-input>
</div>
  <div class="tiaojian">
    <ul>
      <li  style="margin-right: 80px">区域</li>
      <li style="margin-right: 48px"> <el-cascader
        :options="options"
        v-model="selectedOptions"
        @change="handleChange"
        ref="cascaderAddr">
      </el-cascader></li>
    </ul>
  <ul>
    <li style="margin-right: 48px">租住方式</li>
    <el-radio-group v-model="searchMap.rentType" @change="priceHandle">
    <el-radio label="">不限</el-radio>
    <el-radio label="整租">整租</el-radio>
    <el-radio label="合租">合租</el-radio>
    </el-radio-group>
  </ul>
    <ul>
      <li style="margin-right: 80px">租金</li>
      <el-radio-group v-model="priceRange"  @change="priceHandle">
      <el-radio  label="1">≤1500元</el-radio>
      <el-radio  label="2">1500-2000元</el-radio>
      <el-radio  label="3">2000-3000元</el-radio>
      <el-radio  label="4">3000-5000元</el-radio>
      <el-radio  label="5">5000-8000</el-radio>
      <el-radio  label="6">≥8000元</el-radio>
      </el-radio-group>
    </ul>
    <ul>
      <li style="margin-right: 80px">户型</li>
      <el-radio-group v-model="searchMap.houseType"  @change="searchHandle">
      <el-radio label="一居">一居</el-radio>
      <el-radio label="二居">两居</el-radio>
      <el-radio label="三居">三居</el-radio>
      <el-radio label="四居+">四居+</el-radio>
      </el-radio-group>
    </ul>
    <ul>
      <li style="margin-right: 80px">租期</li>
      <el-radio-group v-model="searchMap.timeType" @change="searchHandle">
      <el-radio label="日租">日租</el-radio>
      <el-radio  label="月租">月租</el-radio>
      <el-radio  label="年租">年租</el-radio>
      <el-radio  label="1-3个月">1-3个月</el-radio>
      <el-radio  label="4-6个月">4-6个月</el-radio>
      </el-radio-group>
    </ul>
  </div>
  <div class="clear"></div>
</div>
</template>

<script>
  import bus from '../../../src/assets/eventBus'
  let pca = require('../../assets/pca-code1.json')
  console.log(pca)
  export default {
    name:'condition',
    data() {
      return {
        priceRange:'',
        searchValue:{locationAndNumber: ''},
        options: pca,
        selectedOptions: [],
        searchMap: {
          number: '',
          houseType: '',
          location: '',
          maxPrice: '',
          minPrice: '',
          rentType: '',
          timeType:'',
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
        }],
      }
    },
    methods: {
      priceHandle(){
        if (this.priceRange=="1"){
          this.searchMap.minPrice=1;
          this.searchMap.maxPrice=1500;
        } else if(this.priceRange=="2"){
          this.searchMap.minPrice=1500;
          this.searchMap.maxPrice=2000;
        }else if(this.priceRange=="3"){
          this.searchMap.minPrice=2000;
          this.searchMap.maxPrice=3000;
        }else if(this.priceRange=="4"){
          this.searchMap.minPrice=3000;
          this.searchMap.maxPrice=5000;
        }else if(this.priceRange=="5"){
          this.searchMap.minPrice=5000;
          this.searchMap.maxPrice=8000;
        }else if(this.priceRange=="6"){
          this.searchMap.minPrice=8000;
          this.searchMap.maxPrice=20000;
        }
        this.searchHandle();
      },
      searchHandle(){
        this.$axios.post("/api/house/findHouseBySearch",this.searchMap)
          .then(res=> {
            console.log(res);
              this.houseList=res.data;
              bus.$emit("acceptHouse",this.houseList)
          })
          .catch(res=>{
            console.log(res.response)
          })
      },

      //模糊查询
      fuzzySearch(){
        this.$axios.post("/api/house/fuzzySearch",this.searchValue)
          .then(res=> {
            console.log(res);
            this.houseList=res.data;
            bus.$emit("acceptHouse",this.houseList)
          })
      },

      handleChange(value){
        const checkedNodes = this.$refs['cascaderAddr'].getCheckedNodes()
        // console.log(checkedNodes[0].data.label) // 获取当前点击的节点的label
        // console.log(checkedNodes[0].pathLabels) // 获取由 label 组成的数组
        this.searchMap.location='';
        for (var  i=0;i<checkedNodes[0].pathLabels.length;i++) {
          this.searchMap.location+=checkedNodes[0].pathLabels[i];
        }
        this.searchHandle()
      },

    }

  }
</script>
<style>
  .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
  .tiaojian  {
    float: left;
    margin-left: 90px;
    margin-top: 20px;

  }
  .tiaojian li{
    margin: 0 25px;
    display: inline;
  }
  .clear{ clear:both}
</style>
