import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const state = {
  addcaseshow: false,
  addprojectshow: false,
  addenvshow: false,
  editenvshow: false,
  envList:[],
  envDetail:{
    id:'',
    envName:'',
    host:'',
    port:''
  }
};

const mutations = {

  changeAddCaseShow(state,bol){
    state.addcaseshow = bol;
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
  appendEnv(state,env){
    state.envList.push(env);
  },
  rmEnvById(state,id){
    state.envList.splice(id,1);
  },
  clearEnvList(){
    state.envList.splice(0,state.envList.length);
  },
  editEnv(state,env){
    console.log(state.envList);
    console.log(env.id);
    state.envList.splice(env.id,1,{
      "envName": env.envName,
      "host": env.host,
      "port": env.port
    });
    console.log(state.envList);
  },
  setEnvDetail(state,env){
    state.envDetail = env;
  }
};
const getters = {
  getEnvList: state => {
    return state.envList;
  },
};


export default new Vuex.Store({
  state,
  mutations,
  getters
})
