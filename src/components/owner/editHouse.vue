<template>
  <div class="editHouseForm">
    <el-page-header @back="goBack" content="房源信息修改" style="margin: 20px auto;padding-left: 10px">
    </el-page-header>
    <el-form  :model="house" class="login_box" :rules="houseRules" ref="editHouseForm">
      <el-form-item label="所在区域" prop="location">
        <el-cascader
          style="width: 30%;position: absolute;left: 100px"
          :options="options"
          @change="handleChange"
          ref="cascaderAddr">
        </el-cascader>
      </el-form-item>
      <el-form-item label="小区名及编号" prop="number">
        <el-input  placeholder="请输入小区名及编号" style="width: 30%;position: absolute;left: 100px" type="text" v-model="house.number"></el-input>
      </el-form-item>
      <el-form-item label="出租类型" prop="rentType">
        <el-radio-group v-model="house.rentType"  style="margin: auto 30px">
          <el-radio label="整租">整租</el-radio>
          <el-radio label="合租">合租</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="租期要求" prop="timeType">
        <el-radio-group v-model="house.timeType" style="margin: auto 30px">
          <el-radio label="日租">日租</el-radio>
          <el-radio label="月租">月租</el-radio>
          <el-radio label="年租">年租</el-radio>
          <el-radio label="1-3个月">1-3个月</el-radio>
          <el-radio label="4-6个月">4-6个月</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="期望租金" prop="price">
        <el-input  style="width: 30%;position: absolute;left: 100px" placeholder="期望租金" type="number" v-model="house.price"></el-input>
      </el-form-item>
      <el-form-item label="押金" prop="deposit">
        <el-input  style="width: 30%;position: absolute;left: 100px" placeholder="请根据您的租期要求合理设置押金" type="number" v-model="house.deposit"></el-input>
      </el-form-item>
      <el-form-item label="房屋类型" prop="houseType">
        <el-radio-group v-model="house.houseType" style="margin: auto 30px">
          <el-radio label="一居">一居</el-radio>
          <el-radio label="二居">二居</el-radio>
          <el-radio label="三居">三居</el-radio>
          <el-radio label="四居+">四居+</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="房屋面积" prop="area">
        <el-input style="width: 30%;position: absolute;left: 100px" placeholder="房屋面积" type="number" v-model="house.area"></el-input>
        <i slot="suffix" style="font-style:normal;font-size: 12px;margin-right: 200px">㎡</i>
      </el-form-item>
      <el-form-item label="个性标签">
        <div style="margin:auto 100px">
        <el-tag
          style="cursor: pointer;user-select: none;"
          v-for="label in labels"
          :key="label.label"
          :type="label.type"
          @click="handleLabel(label,labels)"
          :effect="label.checked?'dark':'plain'">
          {{ label.label }}
        </el-tag>
        </div>
      </el-form-item>
      <el-form-item label="图片说明">
        <el-upload
          style="margin:auto 100px"
          ref="imageUpload"
          action="/api/house/update"
          list-type="picture-card"
          :data="house"
          accept="image/jpeg,image/gif,image/png,image/bmp"
          :on-success="handleSuccess"
          :on-error="handleError"
          :auto-upload="false">
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{file}">
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
            <span class="el-upload-list__item-actions">
        <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
          <i class="el-icon-zoom-in"></i>
        </span>
        <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
          <i class="el-icon-delete"></i>
        </span>
      </span>
          </div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="房屋整体描述">
        <el-input
          style="width: 40%;"
          rows="6"
          type="textarea"
          placeholder="房屋描述"
          v-model="house.houseDesc"
          maxlength="100"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item class="btns">
        <el-button type="primary" @click="editHouse('editHouseForm')">确认修改</el-button>
        <el-button type="info" @click="resetForm('editHouseForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  let pca = require('@/assets/pca-code1.json')
  export default {
    name: "editHouse",
    data() {
      return {
        houseRules: {
          location: [
            {required: true, message: '请输入小区名及楼牌号', trigger: 'blur'},
          ],
          number: [
            {required: true, message: '请输入小区名及楼牌号', trigger: 'blur'},
            {min: 6, max: 60, message: '长度在 6 到 60 个字符', trigger: 'blur'}
          ],
          timeType: [
            {required: true, message: '请选择租期', trigger: 'blur'},
          ],
          deposit: [
            {required: true, message: '请填写押金(无需押金可设置为0)', trigger: 'blur'},
          ],
          rentType: [
            {required: true, message: '请选择出租方式', trigger: 'blur'},
          ],
          price: [
            {required: true, message: '请输入租金', trigger: 'blur'},
          ],
          houseType: [
            {required: true, message: '请选择出租方式', trigger: 'blur'},
          ],
          area: [
            {required: true, message: '请输入房屋面积', trigger: 'blur'},
          ],
        },
        labels:[
          { type: '', label: '近地铁',checked:false},
          { type: '', label: '精装修',checked:false},
          { type: '', label: '拎包入住',checked:false},
          { type: '', label: '随时看房',checked:false },
          { type: '', label: '集中供暖',checked:false },
          { type: '', label: '押一付一',checked:false }
        ],
        dialogImageUrl: '',
        dialogVisible: false,
        disabled: false,
        house: {
          ownerId:-1,
          number: '',
          houseType: '',
          image: '',
          location: '',
          price: '',
          deposit:'',
          rentType: '',
          timeType:'',
          area:'',
          label:'',
          houseDesc: '',
          renting:1
        },
        input: '',
        select: '',
        options: pca,
        selectedOptions: []
      }
    },
    methods: {
      editHouse(editHouseForm){
        this.$refs[editHouseForm].validate(valid => {
          if (valid) {
            this.$refs.imageUpload.submit();
          }else {
            this.$message.error("请正确填写所有房源信息");
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      //文件上传（修改房源）成功后的钩子
      handleSuccess(){
        this.$message.success("修改成功")
        this.goBack()
      },
      //文件上传（修改房源）失败后的钩子
      handleError(){
        this.$message.error("修改失败")
      },
      goBack(){
       history.back(-1)
      },
      handleChange(value){
        this.house.location="";
        const checkedNodes = this.$refs['cascaderAddr'].getCheckedNodes()
        console.log(checkedNodes[0].pathLabels)
        for (var  i=0;i<checkedNodes[0].pathLabels.length;i++) {
          this.house.location+=checkedNodes[0].pathLabels[i];
        }
      },
      handleLabel(label,labels){
        label.checked=label.checked?false:true;
        this.house.label='';
        console.log(labels)
        var flag=false
        for (var  m=0;m<labels.length;m++) {
          if (labels[m].checked){
            if (flag){
              this.house.label+=","+labels[m].label
              continue;
            }
            flag=true;
            this.house.label+=labels[m].label
          }
        }
      },
      handleRemove(file) {
        console.log(file);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
    },
    created() {
      this.house.ownerId=JSON.parse(sessionStorage.getItem("user")).id;
      this.house=this.$route.query.houseInfo;
      var labels=this.house.label.split(",")
      for (var i=0;i<labels.length;i++){
        for (var m=0;m<this.labels.length;m++){
          if (this.labels[m].label==labels[i]){
            this.labels[m].checked=true;
          }
        }
      }
      console.log(this.house)
    }
  }
</script>

<style scoped>
.editHouseForm{
  margin-left: 30px;
}
</style>
