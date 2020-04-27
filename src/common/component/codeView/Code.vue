<template>
<!--  <textarea ref="mycode" class="codesql" v-model="mValue" id="code" @change="changeData"></textarea>-->
  <div>
    <codemirror
      ref="myCode"
      v-model="curCode"
      :options="cmOptions"
      class="code"
      @changes="changeData" >
    </codemirror>
  </div>
</template>
<script>
  import { codemirror } from 'vue-codemirror'
  import "codemirror/theme/ambiance.css";
  import "codemirror/theme/idea.css";
  import "codemirror/theme/eclipse.css";
  import "codemirror/lib/codemirror.css";
  import "codemirror/addon/hint/show-hint.css";
  require("codemirror/addon/edit/matchbrackets");
  require("codemirror/addon/selection/active-line");
  require("codemirror/mode/sql/sql");
  require("codemirror/addon/hint/show-hint");
  require("codemirror/addon/hint/sql-hint");
  require("codemirror/mode/javascript/javascript.js");
  require("codemirror/mode/python/python.js");
  require("codemirror/mode/sql/sql.js");
  require("codemirror/mode/yaml/yaml.js");
  require("codemirror/mode/xml/xml.js");


  export default {
    name: "Code",
    data () {
      return {
        // mValue:'',
        editor:'',
        curCode:'',
        cmOptions:{
          value:this.curCode,
          mode:this.mime,
          theme: this.theme?this.theme:'ambiance',
          readOnly:this.readOnly,
          indentWithTabs: true,
          smartIndent: true,
          lineNumbers: true,
          matchBrackets: true,
          autofocus: true,
          extraKeys: {'Ctrl': 'autocomplete'},//自定义快捷键
          hintOptions: {//自定义提示选项
            tables: {
              users: ['name', 'score', 'birthDate'],
              countries: ['name', 'population', 'size']
            }
          },
          lineWrapping: true, //代码折叠
          foldGutter: true,
          autoCloseBrackets: true,
          autoRefresh: true
        }
      }
    },
    props:{
      mime : [String],
      value: [Object,String],
      theme: [String],
      readOnly: [Boolean]
    },
    mounted:function () {
      this.editor = this.$refs.myCode;
      this.editor.codemirror.focus();
      this.editor.codemirror.setCursor(2,1);
      setTimeout(()=>{
        this.editor.codemirror.refresh();
      },1);
    },
    methods:{
      changeData(){
        this.$emit('input',this.curCode);
      }
    },
    watch:{
      value: {
        handler(val,oldVal){
          this.curCode=val;
          this.editor.codemirror.setValue(val);
          setTimeout(()=>{
            this.editor.codemirror.refresh();
          },1);
        },
        immediate:true
      }
      ,
      theme(val){
        this.cmOptions.theme = val;
      },
      mime(val){
        console.log(val);
        this.cmOptions.mode = val;
      },
      readOnly(val){
        this.cmOptions.readOnly = val;
      }
    },
    components:{
      codemirror
    }
  }
</script>
<style scoped>
  .codesql {
    font-size: 11pt;
    font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif;
  }
</style>
