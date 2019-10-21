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
  }
};

const mutations = {

  changeAddDataBaseShow(state,bol){
    state.adddatabaseshow = bol;
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
    const p = {
      "id":project.pid,
      "name":project.pname,
      "envList":project.envs
    };
    state.projectDetail = p;
  },
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
