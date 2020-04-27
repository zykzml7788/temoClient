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
  addcasesetshow: false,
  editcasesetshow:false,
  addcaseforapishow: false,
  editcaseforapishow: false,
  addtaskshow:false,
  edittaskshow:false,
  addtimingtaskshow:false,
  edittimingtaskshow:false,
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
  scriptDetail:{},
  caseSetDetail:{},
  caseSetInfo:{},
  caseInfo:{},
  taskDetail:{},
  timingTaskDetail:{},
  worktab: {
    list: [
      {
        name: 'main',
        tabname: '主页',
        path: '/main'
      }
    ],
    current: {
      name: 'main',
      tabname: '主页',
      path: '/main'
    }
  },
  closingPage: ''
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
  changeAddCaseSetShow(state,bol){
    state.addcasesetshow = bol;
  },
  changeAddCaseShow(state,bol){
    state.addcaseshow = bol;
  },
  changeEditCaseSetShow(state,bol){
    state.editcasesetshow = bol;
  },
  changeAddcaseForApiShow(state,bol){
    state.addcaseforapishow = bol;
  },
  changeEditcaseForApiShow(state,bol){
    state.editcaseforapishow = bol;
  },
  changeAddTaskShow(state,bol){
    state.addtaskshow = bol;
  },
  changeEditTaskShow(state,bol){
    state.edittaskshow = bol;
  },
  changeAddTimingTaskShow(state,bol){
    state.addtimingtaskshow = bol;
  },
  changeEditTimingTaskShow(state,bol){
    state.edittimingtaskshow = bol;
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
  setCaseSetDetail(state,caseSet){
    state.caseSetDetail = caseSet;
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
  },
  setCaseSetInfo(state,param){
    state.caseSetInfo = param;
  },
  setCaseInfo(state,param){
    state.caseInfo = param;
  },
  setTaskDetail(state,param){
    state.taskDetail = param;
  },
  setTimingTaskDetail(state,param){
    state.timingTaskDetail = param;
  },
  worktabRemove (state, p) {
    // 关闭标签
    let ind = state.worktab.list.findIndex(s => s.name === p)
    if (ind > -1) {
      // 清理 keep alive - start
      state.closingPage = state.worktab.list[ind].name
      // 清理 keep alive - end
      state.worktab.list.splice(ind, 1)
    }
    if (p === state.worktab.current.name) {
      // 是当前页，返回上一页
      router.back()
    }
  },
  worktabRoute (state, p) {
    let ind = state.worktab.list.findIndex(s => s.name === p.to.name)
    if (ind > -1) {
      // 标签已存在
      state.worktab.current = state.worktab.list[ind]
    } else {
      // 标签不存在，现在新建
      state.worktab.list.push(p.to);
      state.worktab.current = p.to
    }
    state.closingPage = ''
  }
};
const getters = {
  getEnvList(state) {
    return state.envList;
  },
  getProjectDetail(state){
    return state.projectDetail;
  },
  getCaseSetInfo(state){
    return state.caseSetInfo;
  }
};
const actions = {
  worktabRemove ({commit}, p) {
    commit('worktabRemove', p)
  },
  worktabRoute ({commit}, p) {
    commit('worktabRoute', p)
  }
};


export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})
