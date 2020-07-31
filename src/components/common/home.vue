<template>
  <div>
    <condition></condition>
    <el-divider></el-divider>
    <result></result>
  </div>
</template>
<script>
  import Condition from '@/components/common/condition'
  import Result from "@/components/common/result";
  import bus from '@/assets/eventBus'

  export default {
    name:'home',
    components: {Result, Condition},
    data() {
      return {
      };
    },
    methods: {

    },
    computed: {
      // ...mapState({
      //   'user' : state =>{
      //     if (state.user.name=='') {
      //         state.user=JSON.parse(sessionStorage.getItem("user"))
      //     }
      //     console.log(state.user)
      //     return state.user;
      //   }
      // })
    },

  }
</script>

<style scoped>
  .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
