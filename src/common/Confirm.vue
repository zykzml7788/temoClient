<template>
  <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
    width="30%"
    @close="closeDialog(false)" style="font-weight: bold;">
    <span style="font-weight: bold">{{msg}}</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog(false)">取 消</el-button>
      <el-button type="primary" @click="closeDialog(true)">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    name:'Confirm',
    data() {
      return {
        dialogVisible: this.dialog
      };
    },
    props: {
      dialog:{
        type: Boolean,
        required: true
      },
      msg:{
        type:String,
        required:true
      }
    },
    methods: {

      closeDialog(bol){
        this.dialogVisible = false;
        this.$emit("closeCf",this.dialogVisible,bol);
      }
    },
    watch: {
      dialog: {
        immediate: true,
        deep: true,
        handler(val){
          this.dialogVisible = val;
        }
      }
    }
  };
</script>
