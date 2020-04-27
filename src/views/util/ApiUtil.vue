<template>
  <div style="text-align: left">
    <div style="margin-bottom: 30px"><img src="../../../static/img/postTeemo.png" style="width: 30px;height: 30px;border-radius:50%;float: right"><h3 style="display: inline">TeemoPost</h3></div>
    <el-input placeholder="Enter Request URL" v-model="api.url">
      <el-select v-model="api.method" slot="prepend" placeholder="Request Method" style="width: 150px;">
        <el-option label="GET" value="GET"></el-option>
        <el-option label="POST" value="POST"></el-option>
        <el-option label="PUT" value="PUT"></el-option>
        <el-option label="DELETE" value="DELETE"></el-option>
      </el-select>
      <el-button slot="append" type="primary" @click="sendRequest">SEND</el-button>
    </el-input>
    <h5>Request</h5>
    <el-tabs v-model="activeNameForRequest" type="border-card" style="margin-top: 15px">
      <el-tab-pane label="Params" name="params">
        <h5>Query Params</h5>
        <div class="demo-input-suffix" v-for="param in params" style="margin-bottom: 10px">
          <el-input
            placeholder="KEY"
            v-model="param.key" style="width: 200px" size="small">
          </el-input>
          -
          <el-input
            placeholder="VALUE"
            v-model="param.value" style="width: 200px" size="small">
          </el-input>
          <el-button type="primary" round icon="el-icon-circle-plus-outline" size="small" style="margin-left: 30px" @click="addParamKv">ADD</el-button>
          <el-button type="danger" round icon="el-icon-remove-outline" size="small" v-if="params.length!==1"  @click="delParamKv(param)">DELETE</el-button>
        </div>

      </el-tab-pane>
      <el-tab-pane label="Headers" name="headers">
        <h5>Headers</h5>
        <div class="demo-input-suffix" v-for="header in headers" style="margin-bottom: 10px">
          <el-input
            placeholder="KEY"
            v-model="header.key" style="width: 200px" size="small">
          </el-input>
          -
          <el-input
            placeholder="VALUE"
            v-model="header.value" style="width: 200px" size="small">
          </el-input>
          <el-button type="primary" round icon="el-icon-circle-plus-outline" size="small" style="margin-left: 30px" @click="addHeaderKv">ADD</el-button>
          <el-button type="danger" round icon="el-icon-remove-outline" size="small" v-if="headers.length!==1"  @click="delHeaderKv(header)">DELETE</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Cookies" name="cookies">
        <h5>Cookies</h5>
        <div class="demo-input-suffix" v-for="cookie in cookies" style="margin-bottom: 10px">
          <el-input
            placeholder="KEY"
            v-model="cookie.key" style="width: 200px" size="small">
          </el-input>
          -
          <el-input
            placeholder="VALUE"
            v-model="cookie.value" style="width: 200px" size="small">
          </el-input>
          <el-button type="primary" round icon="el-icon-circle-plus-outline" size="small" style="margin-left: 30px" @click="addCookieKv">ADD</el-button>
          <el-button type="danger" round icon="el-icon-remove-outline" size="small" v-if="cookies.length!==1"  @click="delCookieKv(cookie)">DELETE</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Body" name="body" v-if="api.method!=='GET'">
        <el-radio-group v-model="contentType">
          <el-radio :label="1">x-www-form-urlencoded</el-radio>
          <el-radio :label="2">form-data</el-radio>
          <el-radio :label="3">json</el-radio>
        </el-radio-group>
        <div class="demo-input-suffix" v-for="formParam in formParams" style="margin-top: 20px" v-if="contentType===1">
          <el-input
            placeholder="KEY"
            v-model="formParam.key" style="width: 200px" size="small">
          </el-input>
          -
          <el-input
            placeholder="VALUE"
            v-model="formParam.value" style="width: 200px" size="small">
          </el-input>
          <el-button type="primary" round icon="el-icon-circle-plus-outline" size="small" style="margin-left: 30px" @click="addFormParamKv">ADD</el-button>
          <el-button type="danger" round icon="el-icon-remove-outline" size="small" v-if="formParams.length!==1"  @click="delFormParamKv(formParam)">DELETE</el-button>
        </div>
        <div class="demo-input-suffix" v-for="urlParam in urlParams" style="margin-top: 20px" v-if="contentType===2">
          <el-input
            placeholder="KEY"
            v-model="urlParam.key" style="width: 200px" size="small">
          </el-input>
          -
          <el-input
            placeholder="VALUE"
            v-model="urlParam.value" style="width: 200px" size="small">
          </el-input>
          <el-button type="primary" round icon="el-icon-circle-plus-outline" size="small" style="margin-left: 30px" @click="addUrlParamKv">ADD</el-button>
          <el-button type="danger" round icon="el-icon-remove-outline" size="small" v-if="urlParams.length!==1"  @click="delUrlParamKv(urlParam)">DELETE</el-button>
        </div>
        <div class="demo-input-suffix"  style="margin-top: 20px" v-if="contentType===3">
          <Code :mime="'python'"  v-model="json"></Code>
          <json-viewer
            :value="this.jsonFormatObject"
            :expand-depth=5
            copyable
            boxed
            sort style="height:auto;width:100%;float: right"></json-viewer>
        </div>
      </el-tab-pane>
    </el-tabs>
    <h5>Response</h5>
    <div style="text-align: right;font-size: small">
      <span style="margin-right: 30px">Status: <strong v-if="statusCode===200" style="color: #5daf34">{{statusCode}}</strong>
      <strong v-else style="color: #dd6161">{{statusCode}}</strong>
      </span>
    </div>
    <el-tabs v-model="activeNameForResponse"  type="border-card" style="margin-top: 15px">
      <el-tab-pane label="Body" name="body">
        <el-radio-group v-model="resContentType">
          <el-radio :label="1">json</el-radio>
          <el-radio :label="2">raw</el-radio>
        </el-radio-group>

        <div class="demo-input-suffix"  style="margin-top: 20px" v-if="resContentType===1">
          <Code :mime="'python'"  v-model="resJson" :readOnly="true"></Code>
          <json-viewer
            :value="this.resJsonFormatObject"
            :expand-depth=5
            copyable
            boxed
            sort style="height:auto;width:100%;float: right"></json-viewer>
        </div>

        <div class="demo-input-suffix"  style="margin-top: 20px" v-if="resContentType===2">
          <Code :mime="'python'"  v-model="raw" :readOnly="true"></Code>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Headers" name="headers">
        <Code :mime="'python'"  v-model="resHeaders" :readOnly="true"></Code>
        <json-viewer
          :value="this.resHeaderFormatObject"
          :expand-depth=5
          copyable
          boxed
          sort style="height:auto;width:100%;float: right"></json-viewer>
      </el-tab-pane>
      <el-tab-pane label="Cookies" name="cookies">
        <Code :mime="'python'"  v-model="resCookies" :readOnly="true"></Code>
        <json-viewer
          :value="this.resCookieFormatObject"
          :expand-depth=5
          copyable
          boxed
          sort style="height:auto;width:100%;float: right"></json-viewer>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

  import Code from '@/common/component/codeView/Code.vue'

  export default {
    name:'ApiUtil',
    data(){
      return {
        activeNameForRequest: 'params',
        activeNameForResponse: 'body',
        contentType:1,
        raw:'',
        methodOptions: [{
          value: 'GET',
          label: 'GET'
        }, {
          value: 'POST',
          label: 'POST'
        }, {
          value: 'PUT',
          label: 'PUT'
        }, {
          value: 'DELETE',
          label: 'DELETE'
        }],
        api:{
          url:'',
          method:'GET'
        },
        params:[
          {
            key: '',
            value: ''
          }
        ],
        headers:[
          {
            key: '',
            value: ''
          }
        ],
        globalHeaders:[
          {
            key: '',
            value: ''
          }
        ],
        globalCookies:[
          {
            key: '',
            value: ''
          }
        ],
        formParams:[
          {
            key: '',
            value: ''
          }
        ],
        urlParams:[
          {
            key: '',
            value: ''
          }
        ],
        cookies:[
          {
            key: '',
            value: ''
          }
        ],
        json:'',
        resJson:'',
        resContentType:1,
        resHeaders:'',
        resCookies:'',
        statusCode:''
      }
    },
    methods:{
      addParamKv(){
        this.params.push({key:'',value:''})
      },
      delParamKv(param){
        this.params.splice(this.params.indexOf(param),1)
      },
      addHeaderKv(){
        this.headers.push({key:'',value:''})
      },
      delHeaderKv(param){
        this.headers.splice(this.headers.indexOf(param),1)
      },
      addFormParamKv(){
        this.formParams.push({key:'',value:''})
      },
      delFormParamKv(param){
        this.formParams.splice(this.formParams.indexOf(param),1)
      },
      addUrlParamKv(){
        this.urlParams.push({key:'',value:''})
      },
      delUrlParamKv(param){
        this.urlParams.splice(this.urlParams.indexOf(param),1)
      },
      addCookieKv(){
        this.cookies.push({key:'',value:''})
      },
      delCookieKv(param){
        this.cookies.splice(this.cookies.indexOf(param),1)
      },

      sendRequest(){
        let body = {};
        let params = {};
        let headers = {};
        let cookies = {};
        this.resJson = {};
        this.statusCode = "";
        this.raw = "";
        if (this.contentType===1){
          for (const index in this.formParams){
            if (this.formParams.length===1 && this.formParams[0].key===''){
              body = {};
              break;
            }
            const key = this.formParams[index].key;
            body[key] = this.formParams[index].value;
          }
          body = JSON.stringify(body);

        }else if (this.contentType===2){
          for (const index in this.urlParams){
            if (this.urlParams.length===1 && this.urlParams[0].key===''){
              break;
            }
            const key = this.urlParams[index].key;
            const value = this.urlParams[index].value;
            body[key] = value;
          }
          body = JSON.stringify(body);
        }else{
          if (this.json === ''){
            body = '{}';
          } else{
            body = this.json;
          }

        }

        for (const index in this.params){
          if (this.params.length===1 && this.params[0].key===''){
            params = {};
            break;
          }
          const key = this.params[index].key;
          params[key] = this.params[index].value;
        }
        if (params!==null){
          params = JSON.stringify(params);
        }

        for (const index in this.headers){
          if (this.headers.length===1 && this.headers[0].key===''){
            headers = {};
            break;
          }
          const key = this.headers[index].key;
          headers[key] = this.headers[index].value;
        }
        if (headers!==null){
          headers = JSON.stringify(headers);
        }

        for (const index in this.cookies){
          if (this.cookies.length===1 && this.cookies[0].key===''){
            cookies = {};
            break;
          }
          const key = this.cookies[index].key;
          cookies[key] = this.cookies[index].value;
        }
        if (cookies!=null){
          cookies = JSON.stringify(cookies);
        }
          let data = {
            body: body,
            contentType: this.contentType,
            cookie: cookies,
            header: headers,
            method: this.api.method,
            param: params,
            url: this.api.url
          };
          this.$axios.post("/apis/testUtil/testApi",data).then(res=>{
            if (res.data.code === 200){
              this.$notify({
                title: '成功',
                type:'success',
                message:res.data.msg
              });
              try {
                JSON.parse(res.data.data.responseBody);
                this.resJson = res.data.data.responseBody;
                this.resContentType = 1;
              }catch (e) {
                this.raw = res.data.data.responseBody;
                this.resContentType = 2;
              }
              this.resCookies = res.data.data.responseCookie;
              this.resHeaders = res.data.data.responseHeader;
              this.statusCode = res.data.data.status;
            } else {
              this.$notify({
                title: '失败',
                type:'warning',
                message:res.data.msg
              });
              this.resContentType = 2;
              this.raw = res.data.data;
            }


          }).catch(err=>{
            this.$notify({
              title: '成功',
              type:'error',
              message:err
            });
          });
      }
    },
    computed:{
      jsonFormatObject(){
        if (this.json!==''){
          try{
            return JSON.parse(this.json);
          }catch (e) {
            return {"msg":"JSON格式化错误！"+e}
          }

        }else{
          return {};
        }
      },
      resJsonFormatObject(){
        if (this.resJson!==''){
          try{
            return JSON.parse(this.resJson);
          }catch (e) {
            return {"msg":"JSON格式化错误！"+e}
          }

        }else{
          return {};
        }
      },
      resHeaderFormatObject(){
        if (this.resJson!==''){
          try{
            return JSON.parse(this.resHeaders);
          }catch (e) {
            return {"msg":"JSON格式化错误！"+e}
          }

        }else{
          return {};
        }
      },
      resCookieFormatObject(){
        if (this.resJson!==''){
          try{
            return JSON.parse(this.resCookies);
          }catch (e) {
            return {"msg":"JSON格式化错误！"+e}
          }

        }else{
          return {};
        }
      }
    },
    components:{
      Code
    }
  }
</script>


