// @ts-ignore
import { Store } from 'herbjs';
import servicesCreactor from "../../utils/serviceCreator"
import * as services from "../../services/acitivty"
import * as actions from "./actions"
import serviceplugin from "../../utils/serviceplugin"
import common from '../../utils/common'
import { getUserId } from '../../utils/TinyAppHttp'

const MtopEnable = false

const defaultActivityId = 99

export interface IPageState {
 // pswObj:any;

}

export interface IPageGetters {
  //isShowList: boolean;

}

export interface IPageMutations {
  //unlock(state, payload: { lock: boolean }): void;

}

export interface IPageActions {
  //loadItem(ctx): void;
}

export interface IPageStore {
  state: IPageState;
  getters: IPageGetters;
  mutations: IPageMutations;
  actions: IPageActions;
}

Store<IPageState, IPageGetters, IPageMutations, IPageActions>({
  state: {
    redBag:{},
    redBagDouble:{},    
    liveList: [],
    liveTitle: '',
    layoutOrder: [],
    preLoadImages:[],
    taskList3:[],
    taskList2:[],
    checkMatch:false
  },
  getters: {

  },
  plugins: ['logger', serviceplugin()],
 // services: servicesCreactor(services),
  mutations: {
   
  },
  actions: {
    ...actions,
 
    async pageOnLoad({ state, dispatch, commit, getters }: any) {  
       console.log("time",+Date.now()) 
    let p:any=[
        dispatch('$global:getPageJSON', 'pages/index/index') ,
         common.getSystemInfoSync(),
       ]
      let res = await Promise.all(p)   
      await dispatch("pageOnNextLoad")
    },
   async pageOnNextLoad({ state, dispatch, commit, getters ,global}: any) {
      console.time('time-pageOnNextLoad') 
      console.log("time",+Date.now())
      let app:any = getApp()
      let globalData = app.globalData 
      //let completeList:any = {}
      let  curpage = global.getIn(['pageJson', 'pages/index/index'],{})// getters.getIn('curpage')
      let page_title = curpage['page_title']
      let {bizScenario,version,env} =  globalData     
      if(!bizScenario) { 
        bizScenario = /*app.Tracker?.Mtr.bizScenario   ||*/ 'default' 
      }
      if(page_title) {
        if(env==='sit') {
          page_title = page_title+ '['+bizScenario +']'
        }
        my.setNavigationBar({title:page_title})
      }
  
      let  backClass=  curpage['backClass'] || []//getters.getIn('backClass')
      
    
      let examine =  (curpage['auditminiapp']==version) 
      //examine = true
   
      /*
      backClass =  backClass.filter((t:any)=>{  
        if(t.bizScenario ) 
          return  t.bizScenario.indexOf(bizScenario) >-1 
        else 
           return true
       })
       */
      
       backClass =  backClass.map((t:any)=>{  
          t.taskId =    t.taskId  || t.sellerId
           let match = true
           if(t.bizScenario ) 
           { 
             match = false
             let regular  = t.bizScenario.split(',')
               for(let i =0 ;i<regular.length ;i++) {
               try{
                let reg = new RegExp(regular[i])                
                if(reg.test(bizScenario)) 
                  { match = true }
               }catch(e) {
                console.warn(e)
               }
              }
            // match =   t.bizScenario.indexOf(bizScenario) >-1 
           }
           else 
            { 
              match =  true
            }
           t.match = match
          return t
       })
     
      
    
      
    
       let layoutOrder: any = curpage['layoutOrder']
     
      let newUser = curpage['newUser2']
      if(examine) {
        newUser = "OFF"
        if (layoutOrder && typeof layoutOrder === 'string') {
        layoutOrder = layoutOrder.replace(/,shopTaskZone|,gifZone|,live/g,"")//live
      }
      }

     
      if (layoutOrder && typeof layoutOrder === 'string') {
        layoutOrder = layoutOrder.split(",")
      }
       let page = curpage['page']
       if(page) {
         if(page.image) {
           let res = await common.getSystemInfoSync()
           page.image = common.crossImage(page.image,{width:750,height:1690,systemInfo:res})
         }
       }
      
      //let rule = curpage.ruleText
      //curpage.ruleText = ""
      //https://braft.margox.cn/demos/basic 在线富文本编辑器
      //https://operation-citytsm.oss-cn-hangzhou.aliyuncs.com/EditJS/index.html


      let topTask = curpage['topTask']
      if(topTask && topTask.length) {
        topTask =  topTask.filter((t:any)=>{  
        if(t.bizScenario ) 
          return  t.bizScenario.indexOf(bizScenario) >-1 
        else 
           return true
       })
      }
   
          //gifZone
      //flashsaleZone
      //liveList
      //brandList
      //backClass
      //topTask
    //data-spmId="${spmAPos}.${spmBPos}.c_N.d"  data-scm="${system}.${subsystem}.item.${sellerId||'-'}.${traceId}"
     let {gifZone,flashsaleZone,liveList,brandList} =  curpage
     /*
     if (gifZone && gifZone.length) {//商品名称-立即解锁  商品名称-立即领取
       gifZone = gifZone.map((t: any) => {
         t.spmId = "${spmAPos}.${spmBPos}.c_N.d"
          let {creativeId,sellerId} =  t
          t.scm = `\${system}.\${subsystem}.creative.${creativeId||'-'}.\${traceId}.${sellerId||'-'}`
         return t
       })
     }
     //优惠券抢购 ？

     if (flashsaleZone && flashsaleZone.length) {//商品抢购 
       flashsaleZone = flashsaleZone.map((t: any) => {
         t.spmId = "${spmAPos}.${spmBPos}.c_N.d"
         let {creativeId,sellerId} =  t
         t.scm = `\${system}.\${subsystem}.creative.${creativeId||'-'}.\${traceId}.${sellerId||'-'}`
         return t
       })
     }*/
     if (liveList && liveList.length) {//直播 a56.b23056.c58535.d120961_N
       liveList = liveList.map((t: any,index:number) => {
         t.spmId = `\${spmAPos}.\${spmBPos}.c58535.d120961_${index+1}`
         let {creativeId,sellerId} =  t
         t.scm = `\${system}.\${subsystem}.creative.${creativeId||'-'}.\${traceId}.${sellerId||'-'}`
         return t
       })
     }
     if (brandList && brandList.length) { //品牌墙 浏览店铺 a56.b23056.c58536.d120962_N
       brandList = brandList.map((t: any,index:number) => {
         t.spmId = `\${spmAPos}.\${spmBPos}.c58536.d120962_${index+1}`
           let {creativeId,sellerId} =  t
         t.scm = `\${system}.\${subsystem}.creative.${creativeId||'-'}.\${traceId}.${sellerId||'-'}`
         return t
       })
     }
       if (topTask && topTask.length) {//绿色出行气泡 a56.b23056.c58532.d120953
       topTask = topTask.map((t: any) => {
         t.spmId = `\${spmAPos}.\${spmBPos}.c58532.d120953`
         let {creativeId,sellerId} =  t
         t.scm = `\${system}.\${subsystem}.creative.${creativeId||'-'}.\${traceId}.${sellerId||'-'}`
         return t
       })
     }
/*
      if (backClass && backClass.length) {//品牌气泡 a56.b23056.c58532.d120952
       backClass = backClass.map((t: any,index:number) => {
         t.spmId = `\${spmAPos}.\${spmBPos}.c58532.d120952_${index+1}`
         let {creativeId,sellerId} =  t
         t.scm = `\${system}.\${subsystem}.creative.${creativeId||'-'}.\${traceId}.${sellerId||'-'}`
         return t
       })
     }
     */
     let treasureBox = true
     let treasure_box = curpage['treasure_box']
     if(treasure_box && treasure_box.sw=="OFF") {
       treasureBox = false
     }

     // let redBagDouble =  await globalData.get("redBagDouble",)
      commit("pageOnLoad", {
        ...curpage,
        page,
        examine,
        layoutOrder: layoutOrder,   
        treasureBox,
        backClass, 
        topTask,  
        newUser,
        gifZone,
        flashsaleZone,
        liveList,
        brandList
       // redBagDouble:redBagDouble || {}
      })
  
   
      //dispatch('updateTopicBanner')
     

     
    
     
     // let imageUrl =  "https://images.allcitygo.com/miniapp/202005/redbg.png?x-oss-process=image/format,webp"
  
      //let preLoad = false
 
      
      dispatch('preLoadAction') 
    
      //let gamebg= ''
    
      //preLoadImages
     /*  commit("preLoadImages",{     
         preLoad, 
         //gamebg,     
         //resultBgImage:imageUrl,       
        })*/
      console.timeEnd('time-pageOnNextLoad')
 
    },

    async  preLoadAction({ state, dispatch, commit, getters }: any) {
        console.log("time",+Date.now())
        my.showLoading({content:"加载中...",delay:500})   
        //dispatch('updateMtop') 
        updateMtop({ state, dispatch, commit, getters })
        //dispatch("updateGoShopList")
        //dispatch("updateTaskList")      
        let userId = await getUserId()      
        my.reportAnalytics("preloadaction",{userId})
        dispatch('$service:preheatRedBagShow') // 【红包】展示
        dispatch('$service:babycareCheck')//人群标签
        let layoutOrder  = state.getIn(["layoutOrder"],[])
        let userTaskList = state.getIn(["backClass"],[])
        userTaskList = userTaskList.map((t:any)=>{ return t.taskId})
        userTaskList && userTaskList.length && dispatch('$service:getTaskState',{userTaskList})//【入会任务】查询任务是否完成过
        dispatch('$service:getInitiationLimitList') //有返回sellerId 限制

        if(layoutOrder.indexOf('shopTaskZone')>-1) { //到店任务 关闭，不查询
        let shopTaskZone =  state.getIn(["shopTaskZone"],[])
        let storeTaskList= shopTaskZone.map((t:any)=>{return t.sellerId})
        storeTaskList && storeTaskList.length && dispatch('$service:getStoreTaskState',{storeTaskList})//【到店任务】查询是否完成到店任务
        dispatch('$service:getStoreLimitList')  //有返回sellerId 限制
        }

         if(layoutOrder.indexOf('gifZone')>-1) { //实物抽奖区域 关闭，不查询
        let activityId = defaultActivityId
        dispatch('$service:getEntityPrizeList',{activityId})  //实物抽奖区域列表
         }
        //dispatch('$service:getShareRecordList') //用户分享记录查询 需要的时候调用
   
       // dispatch('$service:preheatRedBagDouble')  //【红包】红包翻倍按钮 完成任务之后调用
       // dispatch('$service:preheatRedBagSend')  //【红包】红包不翻倍（领取奖励）
      
       
       // dispatch('$service:preheatRedBagRandom')  //【到店红包】 到店调用
      //  dispatch('$service:preheatRedBagList')     //【中奖记录】用户中奖记录列表  需要的时候调用
      //  dispatch('$service:getEntityPrize')  //【实物抽奖区】获取实物奖品信息 需要的时候调用
       // dispatch('$service:addPrizeAddress')  //【实物抽奖区】获取实物奖品（抽奖 ） 填写地址
        
      //  dispatch('$service:getOkTaskList')  //updateTaskList   
          my.hideLoading()
    },
    getEntityPrizeList({ state, dispatch, commit, getters }: any) {
        console.log("time",+Date.now())
        let activityId = defaultActivityId
        dispatch('$service:getEntityPrizeList',{activityId})  //实物抽奖区域列表
    },
/*
    async updateTopicBanner({ state, dispatch, commit, getters }: any) {
      let goodsList = state.getIn(["curpage", "goodsList"], [])
      let topicList = state.getIn(["curpage", "topicList"], [])

      //topicList.
      topicList = topicList.map((topic: any) => {
        let goods = goodsList.filter((t: any) => topic.goodsList?.indexOf(t.goodsId) > -1)
        return { ...topic, goods }
      })
      commit("topicList", { topicList })

    },
*/
    getTaskState({ state, dispatch, commit, getters }: any) {
        console.log("time",+Date.now())
        let userTaskList = state.getIn(["backClass"],[])
        userTaskList = userTaskList.map((t:any)=>{ return t.taskId})
        userTaskList && userTaskList.length && dispatch('$service:getTaskState',{userTaskList})
    },

    async updateGoShopList({ state, dispatch, commit, getters }: any) {  
        console.log("time",+Date.now())
       let shopTaskZone = state.getIn(['shopTaskZone'], [])
       let globalData = getApp().globalData
      shopTaskZone = shopTaskZone.map((item:any)=>{
        let {sellerId} = item
        let res =  globalData.getIn(`goshop-${sellerId||'-'}`)
        item.state = res || item.state || 0
        return item
      })
      commit("shopTaskZone", { shopTaskZone: shopTaskZone })
   

    },
   
  
    async updateTaskList({ state, dispatch, commit, getters }: any) {
       console.log("updateTaskList")
         console.log("time",+Date.now())
     // console.time('updateTaskList')
      let {globalData} =  getApp()  
      let taskList2:any = []
      let backClass = state.getIn('backClass', [])
      if(backClass.length==0) {
        return
      }
      
      //taskId
     // let blackList = state.getIn('blackList', '')
      let getOkTaskList = state.getIn(['$result', 'getTaskState'], [])
     /*if(getOkTaskList.length==0) {
        return
      }*/
      let getInitiationLimitList = state.getIn(['$result', 'getInitiationLimitList'],[])
      let mtopResult =  globalData.mtopResult
      //console.log("updateMtop",mtopResult)
      let taskStateReady =  !!getOkTaskList.length
      if(getOkTaskList && getOkTaskList.length) {
        getOkTaskList= getOkTaskList.reduce((p:any,v:any)=>{
          let {sellerId:taskId,state} = v
          delete v.sellerId       
          if(taskId) p[taskId] = v
          return p
        },{})
      }else {
        getOkTaskList = {}
      }
      if(getInitiationLimitList && getInitiationLimitList.length) {
        getInitiationLimitList= getInitiationLimitList.reduce((p:any,v:any)=>{
          let taskId = v
           if(taskId) p[taskId] = {taskId,limit:true}
          return p
        },{})
      }else {
        getInitiationLimitList = {}
      }
       if(mtopResult && mtopResult.length) {
        mtopResult= mtopResult.reduce((p:any,v:any)=>{
          let {taskId,sellerId} = v
            taskId = taskId || sellerId
           if(taskId)  p[taskId] = v
          return p
        },{})
      }else {
        mtopResult = {}
      }
      backClass = backClass.map((element:any) => {
        let {taskId,sellerId,taskType} = element
        element.taskType = taskType || "member" //默认入会
        taskId = taskId || sellerId
        element.taskId = taskId
        let obj = getOkTaskList[taskId]
        if(obj) {
         element = {...element,...obj}
        }
        
        obj = getInitiationLimitList[taskId]
        if(obj) {
           element = {limit:true,...element,...obj}
        }
        
        obj = mtopResult[taskId]
        if(obj) {
           element = {...element,...obj}
         } 
         if(!element.isMember) {
           let ret =   globalData.getIn(`${sellerId}-${element.taskType}`)
           element.isMember = !!ret
         }
        return element
      });
           let completeCount = 0
      let backClass2 = backClass.filter((t:any)=>{  // 过滤调没有完成，并且是会员，或限流的
           if(t.state==1) completeCount++    
           if(!t.match)  return false
           if( (!t.state) && t.isMember) {
                return false
             }            
             return true
       })
    
      taskList2 = taskStateReady? backClass2.filter((t:any)=>{   //过滤已完成          
             if(t.limit) return false
             return t.state!=1
       }):[]
      let taskList3 =taskStateReady? taskList2.slice(0,4):[]
      let taskCount = taskList2.length
      let app:any = getApp()
      app.Tracker && app.Tracker.setData("completeTaskCount",completeCount)
    //  let loadReady =  state.getIn(['loadReady'])
     // let loading = (!globalData.mtopEnd) ||  (!loadReady) // state.getIn(['loading'])

     if (taskList3 && taskList3.length) {//品牌气泡 a56.b23056.c58532.d120952
       taskList3 = taskList3.map((t: any,index:number) => {
         t.spmId = `\${spmAPos}.\${spmBPos}.c58532.d120952_${index+1}`
         let {creativeId,sellerId} =  t
         t.scm = `\${system}.\${subsystem}.creative.${creativeId||'-'}.\${traceId}.${sellerId||'-'}`
         return t
       })
      }
     let reachDrawTime =  state.getIn(['reachDrawTime'])
     let count = completeCount
     let gifReach = (reachDrawTime && ( (+count) >= +reachDrawTime )) || false // 改成完成任务次数
     commit("taskList", {gifReach, completeCount,taskCount, backClass,taskList2,taskList3,mtopResult ,getInitiationLimitList,mtopEnd:!MtopEnable ||  globalData.mtopEnd})
     console.log("updateTaskList end")
    
    },



  }
})


  async function updateMtop({ state, dispatch, commit, getters }: any) {
      try {
        if(!MtopEnable) {
          return
        }
         // console.time('updateMtop')
            console.log("time",+Date.now())
         let globalData =  getApp().globalData
         let mtopResult:any[]= []
         globalData.mtopResult = mtopResult
         globalData.mtopEnd = false
         //globalData.firstTask={}
         let backClass = state.getIn('backClass', [])
          // console.log("updateTaskList--> taskList and completeList",JSON.stringify(taskList),JSON.stringify(completeList))
          //let p: any = []
         let firstTask:boolean =false
          backClass && backClass.length && backClass.forEach((element: any,index:number) => {
            let  {taskType}  = element
            taskType = taskType || 'member' //默认入会
            if (taskType == 'member') {
               common.isMember(element).then((ret:any)=>{
                 console.log("isMember",index,ret)
                  mtopResult.push(ret)
                  if(firstTask==false && ret.isMember) {
                       firstTask = true
                       dispatch("updateTaskList")
                       console.log("updateMtop firstTask")
                  }
                 else if(mtopResult.length==backClass.length) {
                       globalData.mtopEnd = true
                    dispatch("updateTaskList")
                    console.log("updateMtop end")
                  }
               })
            } else if (taskType == 'follow') {
              common.isFollow(element).then((ret:any)=>{
                 console.log("isFollow",index,ret)
                  mtopResult.push(ret)  
                  if(mtopResult.length==backClass.length) {
                     globalData.mtopEnd = true
                     dispatch("updateTaskList")
                  }                         
                 
              })
            }else {
              mtopResult.push({})
            }
          });
          //let resAll = await Promise.all(p)
          //console.log("mtop  Promise.all result", resAll)
          
        } catch (err) {
          console.warn(err)
        }
       // console.timeEnd('updateMtop')
       
        
        
     }