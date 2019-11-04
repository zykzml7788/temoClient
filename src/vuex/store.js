import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const state = {
  addcaseshow: false,
  addprojectshow: false,
  addenvshow: false,
  editenvshow: false,
  projectdetailshow: false,
  editprojectshow: false,
  adddatabaseshow: false,
  editdatabaseshow: false,
  addscriptshow: false,
  editscriptshow: false,
  envList:[],
  envDetail:{
    id:'',
    envId:'',
    envName:'',
    host:'',
    port:''
  },
  projectDetail:{
    id:'',
    envList: [],
    name:''
  },
  databaseDetail:{},
  scriptDetail:{}
};

const mutations = {

  changeAddDataBaseShow(state,bol){
    state.adddatabaseshow = bol;
  },
  changeEditDataBaseShow(state,bol){
    state.editdatabaseshow = bol;
  },
  changeAddProjectShow(state,bol){
    state.addprojectshow = bol;
  },
  changeAddEnvShow(state,bol){
    state.addenvshow = bol;
  },
  changeEditEnvShow(state,bol){
    state.editenvshow = bol;
  },
  changeProjectDetailShow(state,bol){
    state.projectdetailshow = bol;
  },
  changeEditProjectShow(state,bol){
    state.editprojectshow = bol;
  },
  changeAddScriptShow(state,bol){
    state.addscriptshow = bol;
  },
  changeEditScriptShow(state,bol){
    state.editscriptshow = bol;
  },
  appendEnv(state,env){
    state.envList.push(env);
  },
  rmEnvById(state,id){
    state.envList.splice(id,1);
  },
  setEnvList(state,envs){
    state.envList = envs;
  },
  clearEnvList(){
    state.envList.splice(0,state.envList.length);
  },
  editEnv(state,env){
    state.envList.splice(env.id,1,{
      "envId": env.envId,
      "envName": env.envName,
      "host": env.host,
      "port": env.port
    });
    console.log(state.envList);
  },
  setEnvDetail(state,env){
    state.envDetail = env;
  },
  setProjectDetail(state,project){
    state.projectDetail = {
      "id": project.pid,
      "name": project.pname,
      "envList": project.envs
    };
  },
  setDatabaseDetail(state,database){
    state.databaseDetail = {
      "dbId": database.dbId,
      "dbName": database.dbName,
      "host": database.host,
      "port": database.port,
      "user": database.user,
      "pwd": database.pwd,
      "dbLibraryName": database.dbLibraryName,
      "updatetime": database.updatetime,
      "createtime": database.createtime
    };
  },
  setScriptDetail(state,script){
    state.scriptDetail = script;
  }
};
const getters = {
  getEnvList(state) {
    return state.envList;
  },
  getProjectDetail(state){
    return state.projectDetail;
  }
};


export default new Vuex.Store({
  state,
  mutations,
  getters
})
