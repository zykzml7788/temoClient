<template>
  <el-dialog :visible.sync="$store.state.addcaseforapishow" style="height: 100%;" :close-on-click-modal="false" :append-to-body="true"
             @close="">
    <div id="caseTest">
      <h2 style="text-align: left">添加接口用例</h2>

      <el-tabs v-model="activeName" @tab-click="handleClick">

        <el-tab-pane label="接口基本信息" name="apiInfo">
          <el-input placeholder="Enter Request URL" v-model="api.url">
            <el-select v-model="api.method" slot="prepend" placeholder="Request Method" style="width: 150px;">
              <el-option label="GET" value="GET"></el-option>
              <el-option label="POST" value="POST"></el-option>
              <el-option label="PUT" value="PUT"></el-option>
              <el-option label="DELETE" value="DELETE"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" disabled></el-button>
          </el-input>

          <el-tabs v-model="activeNameForApi" @tab-click="handleClick" type="border-card" style="margin-top: 15px">
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
                <el-radio :label="1">form-data</el-radio>
                <el-radio :label="2">x-www-form-urlencoded</el-radio>
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
                <el-input type="textarea" v-model="json" :rows="20" style="width: 50%"></el-input>
                <json-viewer
                  :value="this.jsonFormatObject"
                  :expand-depth=5
                  copyable
                  boxed
                  sort style="height:auto;width: 400px;float: right"></json-viewer>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
        <el-tab-pane label="关联参数设置" name="paramSave">

        </el-tab-pane>
        <el-tab-pane label="断言设置" name="verify">

        </el-tab-pane>
        <el-tab-pane label="延迟时间" name="delayTime">

        </el-tab-pane>
        <el-tab-pane label="全局Cookie & Header注入" name="cookieAndHeader">

        </el-tab-pane>
      </el-tabs>
    </div>
  </el-dialog>
</template>

<script>


  export default {
    data() {
      return {
        activeName: 'apiInfo',
        activeNameForApi: 'params',
          contentType:1,
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
          method:''
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

      };
    },
    methods:{
      handleClick(tab, event) {
        console.log(tab, event);
      },
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
            this.headers.splice(this.params.indexOf(param),1)
        },
        addFormParamKv(){
            this.formParams.push({key:'',value:''})
        },
        delFormParamKv(param){
            this.formParams.splice(this.params.indexOf(param),1)
        },
        addUrlParamKv(){
            this.urlParams.push({key:'',value:''})
        },
        delUrlParamKv(param){
            this.urlParams.splice(this.params.indexOf(param),1)
        },
        addCookieKv(){
            this.cookies.push({key:'',value:''})
        },
        delCookieKv(param){
            this.cookies.splice(this.params.indexOf(param),1)
        },
    },
    computed: {
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
        }
    },

    components:{
    }
  };
</script>
