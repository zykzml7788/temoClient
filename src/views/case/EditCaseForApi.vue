<template>
  <el-dialog :visible.sync="$store.state.editcaseforapishow" style="height: 100%;" :close-on-click-modal="false" :append-to-body="true"
             @close="closeEditCase" :width="'70%'">
    <div id="caseAdd">
      <h2 style="text-align: left">编辑接口用例</h2>
      <el-form :model="caseInfo" :rules="rules" ref="caseInfo" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用例描述" prop="caseDesc">
          <el-input v-model="caseInfo.caseDesc"></el-input>
        </el-form-item>
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
            <strong>关联参数</strong>
            <el-tooltip content="KEY为自定义的变量名，可供后续用例使用，可选择从响应体或者响应头提取，可选择关联方式为JSONPATH OR 正则表达式" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>

            <div  v-for="save in saves" style="margin-top: 20px">
              <el-select v-model="save.saveFrom"  placeholder="saveFrom" style="width: 150px;" size="small">
                <el-option label="Response Body" value="1"></el-option>
                <el-option label="Response Header" value="2"></el-option>
                <el-option label="Cookie" value="3"></el-option>
              </el-select>
              <el-input
                placeholder="KEY"
                v-model="save.key" style="width: 200px" size="small">
              </el-input>
              <el-select v-model="save.saveBy"  placeholder="saveBy" style="width: 150px;" size="small" @change="clearSave(save)">
                <el-option label="JSONPATH" value="1"></el-option>
                <el-option label="REGEX" value="2"></el-option>
              </el-select>
              <el-input
                placeholder="JSONPATH"
                v-model="save.jsonpath" style="width: 200px" size="small" v-if="save.saveBy!=='2'" >
              </el-input>
              <el-input
                placeholder="REGEX"
                v-model="save.regex" style="width: 200px" size="small" v-if="save.saveBy==='2'">
              </el-input>
              <el-button type="primary" round icon="el-icon-circle-plus-outline" size="small" style="margin-left: 10px" @click="addSaveKv">ADD</el-button>
              <el-button type="danger" round icon="el-icon-remove-outline" size="small" v-if="save.length!==1"  @click="delSaveKv(save)">DELETE</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="断言设置" name="verify">
            <strong>Assertion</strong>
            <el-tooltip content="设置相关断言，可选择正则断言 OR JSONPATH 断言,支持多种关系选择" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
            <br>
            <br>
            <el-radio-group v-model="assertType">
              <el-radio :label="1">
                <el-tooltip content="断言点添加" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                Assert Point
              </el-radio>
              <el-radio :label="2">
                <el-tooltip content="JSON断言添加，只会比对JSON中存在的字段是否一致" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                JSON Assert
              </el-radio>

            </el-radio-group>
            <div  v-for="assert in asserts" style="margin-top: 20px" v-if="assertType===1">
              <el-select v-model="assert.assertBy"  placeholder="assertBy" style="width: 150px;" size="small" @change="clearAssert(assert)">
                <el-option label="JSONPATH" value="1"></el-option>
                <el-option label="REGEX" value="2"></el-option>
              </el-select>
              <el-input
                placeholder="JSONPATH"
                v-model="assert.jsonpath" style="width: 200px" size="small" v-if="assert.assertBy!=='2'" >
              </el-input>
              <el-input
                placeholder="REGEX"
                v-model="assert.regex" style="width: 200px" size="small" v-if="assert.assertBy==='2'">
              </el-input>
              <el-select v-model="assert.relation"  placeholder="relation" style="width: 150px;" size="small">
                <el-option label="is" value="1"></el-option>
                <el-option label="not" value="2"></el-option>
                <el-option label="contains" value="3"></el-option>
                <el-option label="not contains" value="4"></el-option>
                <el-option label="in" value="5"></el-option>
                <el-option label="not in" value="6"></el-option>
                <el-option label="is null" value="7"></el-option>
                <el-option label="not null" value="8"></el-option>
                <el-option label=">" value="9"></el-option>
                <el-option label="<" value="10"></el-option>
                <el-option label=">=" value="11"></el-option>
                <el-option label="<=" value="12"></el-option>
              </el-select>
              <el-input
                placeholder="EXPECT"
                v-model="assert.expect" style="width: 200px" size="small" disabled v-if="assert.relation==='7' || assert.relation==='8'">
              </el-input>
              <el-input
                placeholder="EXPECT"
                v-model="assert.expect" style="width: 200px" size="small" v-if="assert.relation!=='7' && assert.relation!=='8'">
              </el-input>
              <el-button type="primary" round icon="el-icon-circle-plus-outline" size="small" style="margin-left: 10px" @click="addAssertKv">ADD</el-button>
              <el-button type="danger" round icon="el-icon-remove-outline" size="small" v-if="asserts.length!==1"  @click="delAssertKv(assert)">DELETE</el-button>
            </div>
            <div><el-input type="textarea" v-model="jsonAssert" :rows="20" style="margin-top: 20px" v-if="assertType===2"></el-input></div>
          </el-tab-pane>
          <el-tab-pane label="延迟时间" name="delayTime">
            <el-form-item label="延迟时间(s)">
              <el-input v-model="delayTime"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="全局Cookie & Header注入" name="cookieAndHeader">
            <el-tabs type="border-card">
              <el-tab-pane label="Global Headers">
                <h5>Global Headers</h5>
                <div class="demo-input-suffix" v-for="globalHeader in globalHeaders" style="margin-bottom: 10px">
                  <el-input
                    placeholder="KEY"
                    v-model="globalHeader.key" style="width: 200px" size="small">
                  </el-input>
                  -
                  <el-input
                    placeholder="VALUE"
                    v-model="globalHeader.value" style="width: 200px" size="small">
                  </el-input>
                  <el-button type="primary" round icon="el-icon-circle-plus-outline" size="small" style="margin-left: 30px" @click="addGlobalHeaderKv">ADD</el-button>
                  <el-button type="danger" round icon="el-icon-remove-outline" size="small" v-if="globalHeaders.length!==1"  @click="delGlobalHeaderKv(param)">DELETE</el-button>
                </div>
              </el-tab-pane>
              <el-tab-pane label="Global Cookies">
                <h5>Global Cookies</h5>
                <div class="demo-input-suffix" v-for="globalCooie in globalCookies" style="margin-bottom: 10px">
                  <el-input
                    placeholder="KEY"
                    v-model="globalCooie.key" style="width: 200px" size="small">
                  </el-input>
                  -
                  <el-input
                    placeholder="VALUE"
                    v-model="globalCooie.value" style="width: 200px" size="small">
                  </el-input>
                  <el-button type="primary" round icon="el-icon-circle-plus-outline" size="small" style="margin-left: 30px" @click="addGlobalCookieKv">ADD</el-button>
                  <el-button type="danger" round icon="el-icon-remove-outline" size="small" v-if="globalCookies.length!==1"  @click="delGlobalCookieKv(param)">DELETE</el-button>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="addCase">确 定</el-button>
      <el-button @click="closeEditCase">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>


    export default {
        data() {
            return {
                caseId:'',
                activeName: 'apiInfo',
                activeNameForApi: 'params',
                setId:'',
                contentType:1,
                assertType:1,
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
                saves:[
                    {
                        saveFrom:'',
                        saveBy: '',
                        key: '',
                        jsonpath: '',
                        regex:''
                    }
                ],
                asserts:[
                    {
                        assertBy: '',
                        jsonpath: '',
                        regex:'',
                        relation:'',
                        expect:''
                    }
                ],
                delayTime:'0',
                jsonAssert:'',
                caseInfo:{
                    caseDesc:''
                },
                rules:{
                    caseDesc:[
                        { required: true, message: '请输入用例描述', trigger: 'blur' },
                    ],
                }
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
            addGlobalCookieKv(){
                this.globalCookies.push({key:'',value:''})
            },
            delGlobalCookieKv(param){
                this.globalCookies.splice(this.globalCookies.indexOf(param),1)
            },
            addGlobalHeaderKv(){
                this.globalHeaders.push({key:'',value:''})
            },
            delGlobalHeaderKv(param){
                this.globalHeaders.splice(this.globalHeaders.indexOf(param),1)
            },
            addSaveKv(){
                this.saves.push({
                    saveFrom:'',
                    saveBy: '',
                    key: '',
                    jsonpath: '',
                    regex:''
                });
            },
            delSaveKv(param){
                this.saves.splice(this.saves.indexOf(param),1)
            },
            clearSave(save){
                save.jsonpath='';
                save.regex='';
            },
            clearAssert(assert){
                assert.jsonpath='';
                assert.regex='';
            },
            addAssertKv(){
                this.asserts.push({
                    assertBy: '',
                    jsonpath: '',
                    regex:'',
                    relation:'',
                    expect:''
                });
            },
            delAssertKv(param){
                this.asserts.splice(this.asserts.indexOf(param),1)
            },
            addCase(){
                let body = {};
                let url = this.api.url;
                let params = {};
                let headers = {};
                let cookies = {};
                let globalHeaders = {};
                let globalCookies = {};
                let saves = [];
                let asserts = [];
                if (this.activeNameForApi === 'body'){
                    if (this.contentType===1){
                        for (const index in this.formParams){
                            if (this.formParams.length===1 && this.formParams[0].key===''){
                                body = null;
                                break;
                            }
                            const key = this.formParams[index].key;
                            body[key] = this.formParams[index].value;
                        }
                        if (body!==null){
                            body = JSON.stringify(body);
                        }

                    }else if (this.contentType===2){
                        const kvs = [];
                        body=null;
                        for (const index in this.urlParams){
                            if (this.urlParams.length===1 && this.urlParams[0].key===''){
                                break;
                            }
                            const key = this.urlParams[index].key;
                            const value = this.urlParams[index].value;
                            kvs.push(key+"="+value);
                        }
                        if (kvs.length!==0){
                            url = url+"?"+kvs.join("&");
                        }
                    }else{
                        body = this.json;
                    }
                }else{
                    body = null;
                }
                for (const index in this.params){
                    if (this.params.length===1 && this.params[0].key===''){
                        params = null;
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
                        headers = null;
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
                        cookies = null;
                        break;
                    }
                    const key = this.cookies[index].key;
                    cookies[key] = this.cookies[index].value;
                }
                if (cookies!=null){
                    cookies = JSON.stringify(cookies);
                }
                for (const index in this.globalHeaders){
                    if (this.globalHeaders.length===1 && this.globalHeaders[0].key===''){
                        globalHeaders = null;
                        break;
                    }
                    const key = this.globalHeaders[index].key;
                    globalHeaders[key] = this.globalHeaders[index].value;
                }
                if (globalHeaders!==null){
                    globalHeaders = JSON.stringify(globalHeaders);
                }

                for (const index in this.globalCookies){
                    if (this.globalCookies.length===1 && this.globalCookies[0].key===''){
                        globalCookies = null;
                        break;
                    }
                    const key = this.globalCookies[index].key;
                    globalCookies[key] = this.globalCookies[index].value;
                }
                if (globalCookies!==null){
                    globalCookies = JSON.stringify(globalCookies);
                }

                for (const index in this.saves){
                    if (this.saves.length===1 && this.saves[0].key===''){
                        saves = null;
                        break;
                    }
                    const save = {
                        caseId: this.caseId,
                        jexpression:this.saves[index].jsonpath,
                        paramKey:this.saves[index].key,
                        regex:this.saves[index].regex,
                        saveFrom:this.saves[index].saveFrom,
                        saveType:this.saves[index].saveBy
                    };
                    saves.push(save);
                }
                for (const index in this.asserts){
                    if (this.asserts.length===1 && this.asserts[0].expect===''){
                        asserts = null;
                        break;
                    }
                    const assert = {
                        caseId: this.caseId,
                        verifyType:this.asserts[index].assertBy,
                        rexpression:this.asserts[index].regex,
                        jexpression:this.asserts[index].jsonpath,
                        expect:this.asserts[index].expect,
                        relationShip:this.asserts[index].relation
                    };
                    asserts.push(assert);
                }

                const data = {
                    caseId: this.caseId,
                    body:body,
                    caseDesc: this.caseInfo.caseDesc,
                    caseType: 1,
                    cookies: cookies,
                    delayTime: this.delayTime,
                    globalCookies:globalCookies,
                    globalHeaders:globalHeaders,
                    header:headers,
                    jsonAssert:this.jsonAssert?this.jsonAssert:null,
                    url:url,
                    method:this.api.method,
                    param:params,
                    saves:saves,
                    verify:asserts,
                    setId:this.setId
                };
                this.$refs['caseInfo'].validate(bol=>{
                    if (bol){
                        this.$axios.put('/apis/testcase/'+this.caseId,data).then(res=>{
                                this.loading = true;
                                if (res.data.code === 200){
                                    this.closeEditCase();
                                    this.$notify({title:'操作成功',type:'success',message:res.data.msg});
                                    this.$emit("getCaseInfo");
                                } else {
                                    this.$notify({title:'操作失败',type:'warning',message:res.data.msg});
                                }

                            }

                        ).catch(err=>{
                            this.$notify({title:'操作失败',type:'error',message:err});
                        });
                    }

                });

            },
            closeEditCase(){
                this.api={
                    url:'',
                    method:'GET'
                };
                const setUp = [
                    {
                        key: '',
                        value: ''
                    }
                ];
                this.params=setUp;
                this.urlParams=setUp;
                this.headers=setUp;
                this.cookie=setUp;
                this.formParams=setUp;
                this.globalHeaders=setUp;
                this.globalCookies=setUp;
                this.json='';
                this.saves=[
                    {
                        caseId: this.caseId,
                        saveFrom:'',
                        saveBy: '',
                        key: '',
                        jsonpath: '',
                        regex:''
                    }
                ];
                this.asserts=[{
                    caseId: this.caseId,
                    assertBy: '',
                    jsonpath: '',
                    regex:'',
                    relation:'',
                    expect:''
                }];
                this.delayTime='0';
                this.jsonAssert='';
                this.caseInfo.caseDesc='';
                this.activeName='apiInfo';
                this.activeNameForApi= 'params';
                this.contentType=1;
                this.assertType=1;
                this.$refs['caseInfo'].resetFields();
                this.$store.commit('changeEditcaseForApiShow',false);
            }
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
            },

        },
        watch:{
            '$store.state.caseInfo': function (val) {
                this.setId = val.setId;
                this.caseId = val.caseId;
                this.json = val.body?val.body:'' ;
                this.caseInfo.caseDesc = val.caseDesc;
                this.delayTime = val.delayTime;
                this.jsonAssert = val.jsonAssert;
                this.api.method = val.method;
                this.api.url = val.url;
                if (val.cookies!==null && val.cookies!==''){
                    const cookies = JSON.parse(val.cookies);
                    this.cookies=[];
                    for (const k in cookies){
                        this.cookies.push({key:k,value:cookies[k]});
                    }
                }

                if (val.globalCookies!==null && val.globalCookies!==''){
                    const globalCookies = JSON.parse(val.globalCookies);
                    this.globalCookies=[];
                    for (const k in globalCookies){
                        this.globalCookies.push({key:k,value:globalCookies[k]});
                    }
                }
                if (val.globalHeaders!==null && val.globalHeaders!==''){
                    const globalHeaders = JSON.parse(val.globalHeaders);
                    this.globalHeaders=[];
                    for (const k in globalHeaders){
                        this.globalHeaders.push({key:k,value:globalHeaders[k]});
                    }
                }
                if (val.header!==null && val.header!==''){
                    const header = JSON.parse(val.header);
                    this.headers=[];
                    for (const k in header){
                        this.headers.push({key:k,value:header[k]});
                    }
                }
                if (val.param!==null && val.param!==''){
                    const param = JSON.parse(val.param);
                    this.params=[];
                    for (const k in param){
                        this.params.push({key:k,value:param[k]});
                    }
                }
                if (val.saves!==null && val.saves.length!==0){
                    this.saves = [];
                    for (const index in val.saves){
                        const save = {
                            caseId: this.caseId,
                            saveFrom:val.saves[index].saveFrom,
                            saveBy: val.saves[index].saveType,
                            key: val.saves[index].paramKey,
                            jsonpath: val.saves[index].jexpression,
                            regex:val.saves[index].regex
                        };
                        this.saves.push(save);
                    }
                }
                if (val.verify!==null && val.verify.length!==0){
                    this.asserts = [];
                    for (const index in val.verify){
                        const assert = {
                            caseId: this.caseId,
                            assertBy: val.verify[index].verifyType,
                            jsonpath: val.verify[index].jexpression,
                            regex:val.verify[index].rexpression,
                            relation:val.verify[index].relationShip,
                            expect:val.verify[index].expect
                        };
                        this.asserts.push(assert);
                    }
                }

            }
        },

        components:{
        }
    };
</script>
