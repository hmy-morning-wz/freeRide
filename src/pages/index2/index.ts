import { IAppStore } from '../../store';
import { IPageStore } from './store';
import { Page } from 'herbjs';
import tmallshop from '../../services/tmallshop'
import basepage from '../../utils/basepage'
import common from '../../utils/common';
import {HMAC256} from "../../utils/sha256"
const DEBUG = true
const notifyListenerEnable = false
const defaultActivityId = 99
export interface IPageData {

}
export interface IPageMethonds {

}
Page<IPageData, IPageMethonds, IPageStore, IAppStore>({
  data: {     
    loading:true,
    recordListShow: false,
    drawResult: false,
    treasureBox:true,
    treasureBoxComplete:false,
    treasureBoxLogo:"/images/treasure_box.webp",
    brandIdx: 0,
    loadingBallOpacity:0,
    redBagDouble:{},
    showPopInfo: {

      // share：分享页面弹框  taskPop1：首次任务弹框 taskPop2：入会任务弹窗2（翻倍弹框）redPacket1：放弃红包翻倍弹框  redPacket2：成功获得红包
      // award1：获得奖品弹窗1实物   award2：获得奖品弹窗2 现金  notWinning：未中奖弹框  getAddress：填写地址  travelVoucher：出行券
      /*isShowPop: true,
      showPop: "inviolableRights",
      redEnvelopeAmount: 10, //红包金额
      brandText:"良品铺子", // 品牌广告文字
      travelVoucher:"两元公交地铁出行券",
      giftTitle:"26元神秘礼包",  // 获得健康金的标题文字 
      logoUrl:"https://images.allcitygo.com/image/double202011/pic_hongbao.png?x-oss-process=image/format,webp",
      taskTotalCount: 5,  // 翻倍弹框任务总数
      taskCompleteCount: 2, // 完成任务数
      awardName: "奖品名称奖品名称奖品名称奖品名称", // 奖品名称
      addressName:"姓名",   // 收货地址我的姓名
      addressMobile:"214235355543",   // 收货地址手机号码
      address:"浙江省杭州市上城区婺江路建江时代大厦A座18层通卡联城网络科技有限公司",   // 收货地址手机号码
      awardPicUrl: "https://images.allcitygo.com/image/double202011/pic_hongbao.png?x-oss-process=image/format,webp", // 奖品图片地址 
      shareList: [
        {
          userName: "13895069039", // 用户名
          completetStatus: 1,  // 分享的状态
          amount: 2,  // 金额
        },
        {
          userName: "13895069039", // 用户名
          completetStatus: 0,  // 分享的状态 0：待完成 1：已完成
          amount: 2,  // 金额
        },
        {
          userName: "13895069039", // 用户名
          completetStatus: 0,  // 分享的状态
          amount: 2,  // 金额
        },
        {
          userName: "13895069039", // 用户名
          completetStatus: 0,  // 分享的状态
          amount: 2,  // 金额
        },
        {
          userName: "13895069039", // 用户名
          completetStatus: 0,  // 分享的状态
          amount: 2,  // 金额
        },
      ],
      inviolableRightsList:[
        {
          itemId:"",
          itemTitle:"0.5现金红包",
          itemIcon:"https://images.allcitygo.com/image/double202011/icon_redbag.png?x-oss-process=image/format,webp",
          isShowBtn: false,
          itemDesc:"可在支付宝-卡包 中查看",
        },
        {
          itemId:"",
          itemTitle:"现金红包",
          itemIcon:"https://images.allcitygo.com/image/double202011/icon_gift.png?x-oss-process=image/format,webp",
          isShowBtn: true,
          itemDesc:"",
        }
      ],*/
    },
    loadReady: false
  },
  mapActionsToMethod: [''],
  // mapMutationsToMethod: ['helperWay'],
  async onLoad(query: { url: string, bizScenario: string, sellerId: string,sharerId:string }) {
    my.showNavigationBarLoading()
    my.reportAnalytics("page_load",{...query,route:this.route})
    this.time= +Date.now()
        let app:any =  getApp()
    setTimeout(()=>{
      this.setData({treasureBoxComplete:true})
       this.$mtr_click("浏览页面时长宝箱15秒计时到达")
    },15000)
    let globalData =  app.globalData
    let bizScenario = globalData.bizScenario
    if ((query && query.bizScenario) && !bizScenario) {
      globalData.bizScenario = query.bizScenario
    }
   globalData.sharerId = query.sharerId
   if( query.sharerId &&  query.bizScenario=='share'){
         my.setStorageSync({key:"sharerId",data:query.sharerId})
         my.ap.navigateToAlipayPage({
            path:'https://render.alipay.com/p/c/tr-17ujvzxi0jkw?entrance=member'
          })
     
   }
   if( query.bizScenario=='hy' ||  query.bizScenario=='hybc') {//hy 和 hybc
        let res =  my.getStorageSync({key:"sharerId"})
        globalData.sharerId = res.data
        console.log("sharerId", globalData.sharerId)
   }
   await this.dispatch("pageOnLoad")
  
   my.hideNavigationBarLoading()
 /*  let {mtopEnd} = this.data
   if(!mtopEnd) {
     setTimeout(()=>{
       let {loading} = this.data
       loading && this.hideLoading()
     },5000)
   }*/
   this.setData({ loadReady: true,loading:false,systemInfo:app.systemInfo })

    // @ts-ignore
    getApp().$emitter = this.$emitter
    if (!this.taobaoResultListener) {
      this.taobaoResultListener = this.$emitter.addListener('taobaoResult', () => {
        console.log("$emitter Listener  taobaoResult")
        setTimeout(() => {
          let { taobaoResult } = getApp().globalData
          if (taobaoResult) {        
          
            this.onTaskComple(taobaoResult)
            delete getApp().globalData.taobaoResult
          } else {
            console.warn("no taobaoResult")
          }

        }, this._isHided ? 500 : 0)
      })
    }


  },
  onHide(){
    let time = +Date.now() - this.time
    my.reportAnalytics("page_hide",{time,route:this.route})
  },
  onUnload() {
    let time = +Date.now() - this.time
    my.reportAnalytics("page_unload",{time,route:this.route})
    this.removeNotifyListener()
    this.taobaoResultListener && this.taobaoResultListener()

    delete this.taobaoResultListener
  
  },
  currentStepRef(ref: any) {
    this.stepRef = ref;
  },
///////////////////
  goNextTask(){ //做下一个任务 ，完成任务后根据 doNextTask 判断是否继续下个任务
      let {currentTask,taskList2} = this.data 
      if((!currentTask) ||  (!currentTask.sellerId) ) {
          currentTask = taskList2 && taskList2.length && taskList2[0] || {}
          currentTask.userTap="AUTO_NEXT"
      }
      this.setData({currentTask})
      //doNextTask //taskList2
      return  currentTask.sellerId && this.onGoTask(currentTask) //todo 
  },


 showLoading(delay:number){
   if(delay) {
    this.loadingTimer =  setTimeout(()=>{
          this.loadingTimer = 0
          this.setData({loading:true})
     },delay)
   }
   else {
     this.setData({loading:true})
   }
 },
 hideLoading(){ 
   this.setData({loading:false})
   if( this.loadingTimer) {
     clearTimeout(this.loadingTimer)
     this.loadingTimer= 0
   }
 },

  addNotifyListener() {
    this.notifyListener = true
    notifyListenerEnable && my.call('addNotifyListener', {
      name: 'NEBULANOTIFY_BRAND_MINIAPP_JOIN_MEBMER_SUCCESS',
      success: (result: any) => {
        console.log('NEBULANOTIFY_BRAND_MINIAPP_JOIN_MEBMER_SUCCESS success ', result, new Date().getTime());
        // if (getApp().globalData.env == 'sit') my.showToast({ content: "NEBULANOTIFY_XLIGHT_TASK_SUCCESS success " + JSON.stringify(result) });

      },
      fail: (result: any) => {
        this.notifyListener = false
        console.log('NEBULANOTIFY_BRAND_MINIAPP_JOIN_MEBMER_SUCCESS fail ', result, new Date().getTime());
        if (getApp().globalData.env == 'sit') my.showToast({ content: "NEBULANOTIFY_XLIGHT_TASK_SUCCESS fail " + JSON.stringify(result) });

      }
    }, (result) => {
      console.log('NEBULANOTIFY_BRAND_MINIAPP_JOIN_MEBMER_SUCCESS cb ', result, new Date().getTime());
      //my.showToast({ content: "NEBULANOTIFY_XLIGHT_TASK_SUCCESS cb " + JSON.stringify(result) });
      this.setData({ notification: JSON.stringify(result) });      
      this.onTaskComple({ ...result, type: "member", code: "SUCCESS" })
      //this.dispatch('$service:addUserTask',result)
    });
    /*
    my.call('addNotifyListener', {
      name: 'NEBULANOTIFY_XLIGHT_TASK_FAIL',
      success: (result: any) => {
        console.log('NEBULANOTIFY_XLIGHT_TASK_FAIL success ', result, new Date().getTime());
        if (getApp().globalData.env == 'sit') my.showToast({ content: "NEBULANOTIFY_XLIGHT_TASK_FAIL success " + JSON.stringify(result) });
      },
      fail: (result: any) => {
        console.log('NEBULANOTIFY_XLIGHT_TASK_FAIL fail ', result, new Date().getTime());
        if (getApp().globalData.env == 'sit') my.showToast({ content: "NEBULANOTIFY_XLIGHT_TASK_FAIL fail " + JSON.stringify(result) });

      }
    }, (result) => {
      console.log('NEBULANOTIFY_XLIGHT_TASK_FAIL cb ', result, new Date().getTime());
      //my.showToast({ content: "NEBULANOTIFY_XLIGHT_TASK_FAIL cb " + JSON.stringify(result) });
      //this.setData({ notification: JSON.stringify(result) });
      this.onTaskFail()
    });*/
  },


  removeNotifyListener() {
    this.notifyListener = false
    //NEBULANOTIFY_BRAND_MINIAPP_JOIN_MEBMER_SUCCESS  NEBULANOTIFY_XLIGHT_TASK_SUCCESS
   notifyListenerEnable &&  my.call('removeNotifyListener', {
      name: 'NEBULANOTIFY_BRAND_MINIAPP_JOIN_MEBMER_SUCCESS',
      success: (result: any) => {
        console.log('NEBULANOTIFY_BRAND_MINIAPP_JOIN_MEBMER_SUCCESS removeNotifyListener success ', result, new Date().getTime());
        // my.showToast({ content: "NEBULANOTIFY_XLIGHT_TASK_SUCCESS success " + JSON.stringify(result) });

      },
      fail: (result: any) => {
        console.log('NEBULANOTIFY_BRAND_MINIAPP_JOIN_MEBMER_SUCCESS removeNotifyListener fail ', result, new Date().getTime());
        //  my.showToast({ content: "NEBULANOTIFY_XLIGHT_TASK_SUCCESS fail " + JSON.stringify(result) });

      }
    }, (result) => {
      console.log('NEBULANOTIFY_BRAND_MINIAPP_JOIN_MEBMER_SUCCESS removeNotifyListener cb ', result, new Date().getTime());
      //my.showToast({ content: "NEBULANOTIFY_XLIGHT_TASK_SUCCESS cb " + JSON.stringify(result) });
      // this.setData({ notification: JSON.stringify(result) });
    });
    /*
    my.call('removeNotifyListener', {
      name: 'NEBULANOTIFY_XLIGHT_TASK_FAIL',
      success: (result: any) => {
        console.log('NEBULANOTIFY_XLIGHT_TASK_FAIL removeNotifyListener success ', result, new Date().getTime());
        //my.showToast({ content: "NEBULANOTIFY_XLIGHT_TASK_FAIL success " + JSON.stringify(result) });
      },
      fail: (result: any) => {
        console.log('NEBULANOTIFY_XLIGHT_TASK_FAIL removeNotifyListener fail ', result, new Date().getTime());
        //my.showToast({ content: "NEBULANOTIFY_XLIGHT_TASK_FAIL fail " + JSON.stringify(result) });
      }
    }, (result) => {
      console.log('NEBULANOTIFY_XLIGHT_TASK_FAIL removeNotifyListener cb ', result, new Date().getTime());
      //my.showToast({ content: "NEBULANOTIFY_XLIGHT_TASK_FAIL cb " + JSON.stringify(result) });
      //this.setData({ notification: JSON.stringify(result) });
    });*/
  },
  onReady(){
      let time = +Date.now() - this.time
      my.reportAnalytics("page_ready",{time,route:this.route})
  },
  onShow() {
    my.reportAnalytics("page_show",{route:this.route})
    //scene
    // const app: tinyapp.IAppInstance<any> = getApp()
    //let globalData = app.globalData
    // this.webViewContext && globalData.scene && this.webViewContext.postMessage({ onShow: { scene: globalData.scene } });

    if (this.data.loadReady) {
      let { currentTaskItem } = this.data
      this.dispatch("updateTaskList")
      if (currentTaskItem && currentTaskItem.sellerId) {
        console.log("task doing")
        return
      }
     

    }
    this.setData({ doDraw: false })


  },
  onShareAppMessage(options) {
    let url = options.webViewUrl || this.data.url
    /*   if(url && url.indexOf(app.alipayId)){
        url = url.replace(app.alipayId,"{userId}")
      }*/
    //my.alert({content:JSON.stringify(url)});
     
    let userId = getApp().globalData.userId
    return {
      title: `分享活动`,
      //desc: 'View 组件很通用',
      path: `pages/index2/index?sharerId=${userId}&bizScenario=share`,//?url=${encodeURIComponent(url)} `,
      'web-view': url,
    };
  },
  onRuleClose(e: tinyapp.ICustomEvent) {
    this.setData({ rule: false })
  },

 


  activityTap(e: any) {    //商品点击
    //@ts-ignore
    getApp().handleIconClick(e);

  },
  onShopTap(e: any) { //到店随机红包
    let obj = e.currentTarget.dataset.obj
     console.log("onShopTap",obj)
    let globalData = getApp().globalData
    let {sellerId,state} = obj
    if(!state) {
   //@ts-ignore
    getApp().handleIconClick(e);
    globalData.set(`goshop-${sellerId}`,1)
    this.dispatch("updateGoShopList")
    //点击后按钮变领取
    }else  if(state==1){ //点击后按钮变领取
      this.dispatch("$service:preheatRedBagRandom",{sellerId})  //todo 接口领取 -》 弹框 -》 更新
    }else  { //已领取
      console.log("已领取")
    }
  },
  couponsTap(e: any) {
    //@ts-ignore
    getApp().handleIconClick(e);
  },
  async onTopTaskTap(obj:any) {
   
     if(obj.drawId && obj.type=='draw') {
       if( this.flagTopTaskTap) {
         return
       }
       this.setData({jumpObj:obj})
       this.flagTopTaskTap = true
       await this.dispatch('$service:getIndustryVoucher', {activityId:defaultActivityId, campId:obj.drawId})
       setTimeout(() => {
           this.flagTopTaskTap = false
       }, 1000);
     }else if( obj.type=='jump') {
         common.handleNavigate(obj)
     }
   },
   onBallTap(obj:any) {
       obj.userTap = "BALL_TAP"
       this.setData({currentTask:obj})
       this.onDrawTap(obj)
   },
  onChangeTap() {
    let brandIndex = (this.data.brandIdx < this.data.gifZone3.length - 1) ? (this.data.brandIdx+1) : 0
    this.setData({
      brandIdx: brandIndex
    })
  },
  async onDrawTap(obj:any,option:any={}) {//红包领取点击
    
    let {redBag:{state,amount,count},gameZone,taskList2} = this.data
     let currentTask  = obj
    if(!obj) {
      currentTask =taskList2.length && taskList2[0] || {}
      currentTask.userTap =option.userTap?option.userTap: "DRAW"
      this.setData({currentTask})
    }
    console.log("onDrawTap",state)
    if(state==0 && !amount) { // 领取状态下，并且无奖金
    // 首次 弹框 -》 做任务 =》 回来翻倍弹框 （查询接口preheatRedBagDouble 获得翻倍金额）
     if(taskList2.length) {
        this.setData({dotask:1},()=>{
           let res = this.goNextTask()
           if (!res) {
          console.log("没有任务了")
           }
        })
        
     /*let showPopInfo ={
           isShowPop: true,
           showPop: "taskPop1",
           redEnvelopeAmount:gameZone.firstMoney ,
           brandText:`${currentTask.name}为红包助力，最高可得`,
           logoUrl:currentTask.icon_img
     }
     this.setData({showPopInfo})*/
      this.$mtr_click(obj?"气泡领取点击":"按钮领取点击",currentTask)
        if(!obj) { //领取点击
        //a56.b23056.c58532.d120956
        let spmId ="a56.b23056.c58532.d120954"
        let {creativeId,sellerId} = currentTask || {}
        let app:any = getApp()
        if( app.Tracert){
        let traceId =app.Tracker && app.Tracker.Mtr.traceId && app.Tracker.Mtr.traceId()
        let {system,subsystem} = app.Tracert
        let scm = `${system}.${subsystem}.creative.${creativeId||'-'}.${traceId}.${sellerId||'-'}`//todo     
        app.Tracert && app.Tracert.clickContent(spmId, scm || "",  "",  "");
        }
        }

    }else {
      this.$mtr_click("按钮领取点击-没有任务了-领兜底券")
        if(!obj) { //领取点击
        //a56.b23056.c58532.d120956
        let spmId ="a56.b23056.c58532.d120954"
         let {creativeId,sellerId} = currentTask || {}
        let app:any = getApp()
        if( app.Tracert){
        let traceId =app.Tracker && app.Tracker.Mtr.traceId && app.Tracker.Mtr.traceId()
        let {system,subsystem} = app.Tracert
        let scm = `${system}.${subsystem}.creative.${creativeId||'-'}.${traceId}.${sellerId||'-'}`//todo     
        app.Tracert && app.Tracert.clickContent(spmId, scm || "",  "",  "");
        }
        }
      this.showLoading()
      await this.dispatch('$service:sendVoucher')
      this.hideLoading()
     // my.showToast({content:"今日没有任务了，请明日再来"})
    }
  
    /*
    //@ts-ignore  
    my.confirm({  仅测试用
        title: '做任务',          
        confirmButtonText: '马上做任务',
        cancelButtonText: '暂不需要',
        success: (result) => {
          if(result.confirm) {
         let res = this.goNextTask()
         if(!res) {
           console.log("没有任务了")
          }
        }
        },
      });
     */
    }else {//翻倍
      // this.onDrawDoubleTap() 
      let  { redBagDouble,taskList2,redBag,} = this.data
       let  {totalCount} = redBagDouble || {}
     
      if(!totalCount) {
         redBagDouble.totalCount =   totalCount =  taskList2.length
      }
      
      if( taskList2.length ) { //有次数，翻倍
        let res = this.goNextTask()
        if (!res) {
          console.log("没有任务了")
        }
      /*  let amount = redBagDouble.doubleAmount 
        let progressBar =  redBagDouble.progressBar 
        let count =  redBagDouble.count 
        if(count && progressBar && amount) {
          */
        /*let showPopInfo= { //去除翻倍
            isShowPop: true,
            showPop: "taskPop2",
            redEnvelopeAmount:amount,
            brandText:`${currentTask.name}`,
            taskTotalCount: progressBar,//backClass.length  ,
            taskCompleteCount:progressBar-(count||0), //backClass.length - taskList2.length 
            logoUrl:currentTask.icon_img
        }
        this.setData({showPopInfo,doNextTask:true,redBagDouble})*/
     /* }else {*/
        /* 没有翻倍了
        this.showLoading()
        await this.dispatch('$service:pereheatRedBagPopup', { taskNumber: taskList2.length })
        this.setData({doNextTask:true})
        this.hideLoading()*/
     /* }*/
       
        this.$mtr_click(obj?"气泡领取点击":"按钮领取点击",currentTask)
        if(!obj) { //按钮翻倍点击
        //a56.b23056.c58532.d120956
        let spmId ="a56.b23056.c58532.d120955"
        let {creativeId,sellerId} = currentTask ||{}
        let app:any = getApp()
        if( app.Tracert){
        let traceId =app.Tracker && app.Tracker.Mtr.traceId && app.Tracker.Mtr.traceId()
        let {system,subsystem} = app.Tracert
        let scm = `${system}.${subsystem}.creative.${creativeId||'-'}.${traceId}.${sellerId||'-'}`//todo     
        app.Tracert && app.Tracert.clickContent(spmId, scm || "",  "",  "");
        }
        }
       
      }else {
        console.log("没有任务了，去领奖金")
       /* let {amount , redBagId} = redBag
        if(amount && redBagId) {
        this.$mtr_click("按钮领取点击-领奖金")
        if(!obj) { //领取点击
        //a56.b23056.c58532.d120956
        let spmId ="a56.b23056.c58532.d120954"
        let {creativeId,sellerId} = currentTask ||{}
        let app:any = getApp()
        if( app.Tracert){
        let traceId =app.Tracker && app.Tracker.Mtr.traceId && app.Tracker.Mtr.traceId()
        let {system,subsystem} = app.Tracert
        let scm = `${system}.${subsystem}.creative.${creativeId||'-'}.${traceId}.${sellerId||'-'}`//todo     
        app.Tracert && app.Tracert.clickContent(spmId, scm || "",  "",  "");
        }
        }
        this.onNotTaskTap()
        }else */{
          this.$mtr_click("按钮领取点击-没有任务了-领兜底券")
          if (!obj) { //领取点击
            //a56.b23056.c58532.d120956
            let spmId = "a56.b23056.c58532.d120954"
            let { creativeId, sellerId } = currentTask || {}
            let app: any = getApp()
            if (app.Tracert) {
              let traceId = app.Tracker && app.Tracker.Mtr.traceId && app.Tracker.Mtr.traceId()
              let { system, subsystem } = app.Tracert
              let scm = `${system}.${subsystem}.creative.${creativeId||'-'}.${traceId}.${sellerId||'-'}`//todo     
              app.Tracert && app.Tracert.clickContent(spmId, scm || "", "", "");
            }
          }
          this.showLoading()
          await this.dispatch('$service:sendVoucher')
          this.hideLoading()
            // my.showToast({content:"今日没有任务了，请明日再来"})
        }
      }
    }
    // 弹框
  }, 
   onGiveupDouble(){
      console.log("放弃翻倍")
      /* 没有翻倍了
      let  { redBagDouble: {amount,count},gameZone} = this.data
       let showPopInfo= {
            isShowPop: true,
            showPop: "redPacket1",   
            redEnvelopeAmount:amount ||  gameZone.money,             
        }
        this.setData({showPopInfo,doNextTask:false})*/
   },

  onDrawDoubleTap() {////点击去翻倍
    console.log("点击去翻倍")
     this.setData({doNextTask:false})
      let res = this.goNextTask()
      if(!res) {
        console.log("没有任务了")
      }
  },
  onDraw() {
    //this.goNextTask()
  },
  async onEntityDrawTap(e: any) { //实物抽奖
    let { currentTarget: { dataset } } = e
    let { obj } = dataset
    let {drawId:activityId,prizeId,status} = obj
    let {gifReach} = this.data
      console.log("onEntityDrawTap",{gifReach,activityId,prizeId,status})
    if(gifReach ==undefined) {
      my.showToast({content:"亲，请稍后再试"})
      console.log("亲，请稍后再试")
      return
    }
    if(gifReach ==false) {
      my.showToast({content:"亲，还未达标"})
      console.log("亲，还未达标")
      my.pageScrollTo({scrollTop:0})
      return
    }
    if(status==1) {
        console.log("已领抽奖")

      return
    }else if(status==0) {
    this.showLoading()
    await this.dispatch('$service:getEntityPrize', { activityId, prizeId }) //实物抽奖 -> 弹框 -> 填写地址 -》 确认地址   this.dispatch('$service:actionAddPrizeAddress',{gameRecordId,address,country,prov,city,area,street,fullname,mobilePhone})  
    this.hideLoading()
    }else {
       console.log("未知状态")
    }
  },

  async onNotTaskTap() 
  {
    /* 
    let {redBag:{redBagId,amount}} = this.data
    if(amount && redBagId) {
       this.showLoading()
       await this.dispatch('$service:preheatRedBagSend', { redBagId })
       this.hideLoading()
    } else {
      console.log("不满足条件")
    }*/
    this.setData({doNextTask:false,"redBag.state":0})
  },

  //////////////////
  onGoTask(e: any) {// 去完成任务
    /*if(!e) {
      console.warn("onGoTask not fond e")
     return
    }  
     
    let { currentTarget:{dataset}  } = e
    let { obj:shop} = dataset*/
    let shop = e
    if (!shop) {
      console.warn("onGoTask not fond obj")
      return
    }
    console.log("onGoTask", shop)
    let globalData = getApp().globalData

    // this.onTaskComple({code:"SUCCESS",type:shop.taskType,...shop})
    // return 
    //
   // let userId = getApp().globalData.alipayId
    let { sellerId, shopAppId: appId, taskUrlType, taskUrl, taskType, taskId } = shop // "688187172" "2019081966289614"
    if (!sellerId) {
      return
    }
     this.$mtr_click("去做任务", shop)
    this.setData({ currentTaskItem: shop })
 
    let obj = tmallshop.goShopTask({
      sellerId: sellerId, appId: appId, taskUrlType, taskUrl,
      exInfo: JSON.stringify({ "autoExit": 1, "notifyParam": {"taskId":taskId,/* "userId": userId,*/ "sellerId": sellerId } }),

    });
    /**
     *  opType: "com.alipay.adexchange.common.trigger", opParam: JSON.stringify({
        "event": "conversion",
        "contentJson": "1.0|JNiq74uMcTUY1FO99CDopGXGfNYf9atnxjB6LIsEr3mIqIUGnFhOsf7xDYoVjFm0RD6I0IynLKpLN9JzpgHRXfPlm19NEZLeJPyqMzdO7x/3B1WN573+XVSibkN9GzpqfqiO/jkD8IgUROfle+dHH/2KttTiGL6+5DMtkUdRZDtzWaBVwz/0VTB7L2riWqD5G4qdfpAl4+JuGBepuxe4wZLTD8vdBcGZRknTl/LsGQTQ2rXvzJfUoW0vLnhFf9IT2T5ttXV9FsWXmGIcEeozmjVYxeeYEHaXdZIHfoReYY8WFjqt4kUMWWvIY94i7FUbRi3kyFvwNCbirSeJT6fLmGUZh+Vf90nsV8WlNdmuOk859Q16EByBKQ4d/GcWruuqWR7E+4MFop2+1BucVnIdOYINq3gyQYQpDmkutU37pyDsK12h3X3U"
      }) 
     */
    if (obj.startApp) {//taskUrlType === 'miniapp'
      if (taskUrlType === 'miniapp') {
        if (!this.notifyListener) {
          this.addNotifyListener()
        }
      }

      my.ap.navigateToAlipayPage({
        path: <string>obj.url,//'alipays://platformapi/startapp?appId=60000155&chInfo=ch_${appid}',
        success: (res) => {
          //if (getApp().globalData.env == 'sit')   my.showToast({content:'成功' + JSON.stringify(res)});
         if (taskType === 'shop') {
           this.onTaskComple({ code: "SUCCESS", sellerId, type: taskType,taskId })         
          } 
        },
        fail: (error) => {
          if (getApp().globalData.env == 'sit') my.showToast({ content: 'navigateToAlipayPage fail' + JSON.stringify(error) });
        }
      })
      return true
      /*
            my.call('startApp', {
              appId: obj.appId,
              param: {
                ...obj.param,
                chInfo: 'ch_' + getApp().globalData.appId
              },
              success: (result: any) => {
                console.log('startApp success ', result, new Date().getTime());
              },
              fail: (result: any) => {
                console.log('startApp fail ', result, new Date().getTime());
                if (getApp().globalData.env == 'sit') my.showToast({ content: "startApp fail " + JSON.stringify(result) })
              }
            });*/
    } else {

      if (obj.url) {
        if (taskUrlType == "alipays") {
          if (taskType === 'shop') {
           this.onTaskComple({ code: "SUCCESS", sellerId, type: taskType,taskId })         
          } 
          my.ap.navigateToAlipayPage({
            path: <string>obj.url,//'alipays://platformapi/startapp?appId=60000155&chInfo=ch_${appid}',
            success: (res) => {
              //if (getApp().globalData.env == 'sit')   my.showToast({content:'成功' + JSON.stringify(res)});
            },
            fail: (error) => {
              if (getApp().globalData.env == 'sit') my.showToast({ content: 'navigateToAlipayPage fail' + JSON.stringify(error) });
            }
          })
        } else {       
             //@ts-ignore
         if(my.isIDE && DEBUG) { //test
         /*  setTimeout(()=>{
         this.onTaskCompleTap()
         },3000)*/
          let testUrl = 'https://images.allcitygo.com/miniapp/bind.html?code=SUCCESS&sellerId={sellerId}'
          obj.url =testUrl 
         }
           let path =  obj.url
          //https://pages.tmall.com/wow/pegasus/test-site/687205/y02468?sellerId=217101303  
          if(path.indexOf("sellerId=")==-1){
               path =path.indexOf("?")==-1? path+"?sellerId={sellerId}" : path+"&sellerId={sellerId}"
          } 
            let secureCode = globalData.secureCode
            let userId = globalData.userId
          if(secureCode) {
              if(userId)  { userId = HMAC256(sellerId+userId+taskId,secureCode) }
          }      
          let url = `/pages/webview/webview?url=${encodeURIComponent(`${path}&taskId=${taskId}&userId=${userId}`)}&sellerId=${sellerId}&taskId=${taskId}&taskType=${taskType}`
           if (taskType === 'shop') {
           //this.onTaskComple({ code: "SUCCESS", sellerId, type: taskType}) webview 返回完成任务
           my.navigateTo({ url })
          } else {
            my.navigateTo({ url })
          }
        }
          return true
      }

    }
  },
  onTaskFail() {
    this.notifyListener && this.removeNotifyListener()
  },
  onTaskCompleTap() {
    if(DEBUG) {
    let {currentTaskItem} = this.data
    this.onTaskComple({ code: "SUCCESS", ...currentTaskItem})
    }
  },
  onTaskComple(data: { code: string, sellerId: string, type: string,taskId:string ,nickname:string,tbid:string, userId:string}) {
    console.log("onTaskComple", data)
    this.notifyListener && this.removeNotifyListener()
    if (!data) {
      return
    }
    let { type, sellerId, code, taskId, userId:userId2, nickname } = data//,type:"member"
    /**
     * {code: "FAIL_DONE", nickname: "louis林新华", sellerId: "628189716", spm: "a225e.13433205.1.d1", taskId: "undefined", tbid: "791977274", type: "member", userId: "undefined"}
     * 
     */
    let globalData = getApp().globalData
    if (code !== "SUCCESS" || !sellerId) {
      console.log("onTaskComple not success", code)
      if(code==='FAIL_DONE') {
        globalData.set(`${sellerId}-${type}`,code)
        this.dispatch('updateTaskList')
        my.showToast({content:"你已经是该品牌会员"})
      }
      return
    }
    let secureCode = globalData.secureCode
   
    if(secureCode && taskId && userId2) {
        let  userIdHmac = HMAC256(sellerId+globalData.userId+taskId,secureCode)  
         
        if(userId2===userIdHmac) {
          console.log("userIdHmac.success",userIdHmac,userId2)   
           my.reportAnalytics("checkhmac.success",{userId2,...data,userId:globalData.userId})  
        } else {
          console.log("userIdHmac.fail",userIdHmac,userId2)   
           my.reportAnalytics("checkhmac.fail",{userId2,...data,userId:globalData.userId}) 
        }     
        
    }


    let {redBag} = this.data
   
    let sharerId = globalData.sharerId
    let playload: any = { sellerId, sharerId, taskType: type,redBagId:redBag.redBagId }
    // 判断 
    //入会，type:"member"
    //到店，
    //关注
    // sellerId, taskType, userType = 2
    if (type === 'member') {
      playload.taskType = 1
    } else if (type === 'follow') {
      playload.taskType = 2
    } else if (type === 'shop') {
      playload.taskType = 3
    } else {
      playload.taskType = type
    }
    //this.setData({ showPopInfo :{isShowPop:false}})

    setTimeout(async () => {
      this.showLoading(500)
      //my.showLoading({ content: "请稍等...", delay: 500 })
      let {redBagDouble,taskList2,currentTask} = this.data    
      playload.userTaskNumber =/*redBagDouble.totalCount || redBagDouble.count ||*/ taskList2?.length
//{sellerId,sharerId,redBagId,userTaskNumber}
      /*if( redBagDouble && redBagDouble.count==1) {
         this.setData({doNextTask:false,"redBag.state":0})//最后一个任务不自动跳
      }*/
      let  {redBagId} = this.data.redBag
      let {limitCount,switchFlag} = this.data.gameZone
      this.$mtr_click("onTaskComple",{...currentTask,... data})
      this.dispatch('$service:sendRedBag',  {sharerId,nickname:encodeURIComponent(nickname),sellerId,limitCount:+limitCount,switchFlag:switchFlag==="ON",redBagId:redBagId||null}).then(async () => { //preheatRedBagDouble =>  sendRedBag  //todo show toast
        this.hideLoading()
        
       
        this.$mtr_click("任务完成",{...currentTask,... data})
        //a56.b23056.c58532.d120956
        let spmId = "a56.b23056.c58532.d120956"
        let { creativeId, sellerId } = currentTask || {}
        let app: any = getApp()
        if (app.Tracert) {
          let traceId = app.Tracker && app.Tracker.Mtr.traceId && app.Tracker.Mtr.traceId()
          let { system, subsystem } = app.Tracert
          let scm = `${system}.${subsystem}.creative.${creativeId||'-'}.${traceId}.${sellerId||'-'}`//todo     
          app.Tracert && app.Tracert.clickContent(spmId, scm || "", "", "");
        }
        
        //await this.dispatch('$service:preheatRedBagShow')//更新获得红包金额
        //let userTaskList = this.data.backClass
        //userTaskList = userTaskList?.map((t:any) => { return t.taskId; });
        //this.dispatch('$service:getTaskState',{userTaskList})//更新完成任务列表
        let taskIndex = taskList2.indexOf(currentTask)
        
        if(taskIndex>-1) {
           taskList2.splice(taskIndex,1)
        }
        
        this.setData({taskList2,currentTaskItem:{},currentTask:{}} ,()=>{
          /*let {doNextTask} = this.data
          if(doNextTask) {            
            let { redBagDouble, redBag, taskList2 } = this.data
            let currentTask  = taskList2.length &&  taskList2[0] || {}
            let amount = redBagDouble.doubleAmount 
            let progressBar = redBagDouble.progressBar
            let count = redBagDouble.count

            let isShowPop = !!(taskList2.length && count)
            let showPopInfo = {
              isShowPop,
              showPop: "taskPop2", 
              brandText:`${currentTask.name}`,
              redEnvelopeAmount: amount,//|| gameZone.money,
              taskTotalCount: progressBar,//backClass.length  ,
              taskCompleteCount: progressBar - count,
              logoUrl:currentTask.icon_img
            }
            this.setData({ showPopInfo },()=>{
               if(isShowPop) {
                 setTimeout(()=>{
               let ret = this.goNextTask()
               if(!ret) {
               console.log("没有任务了")
               this.setData({doNextTask:false,"redBag.state":0})
               //this.onNotTaskTap()
                //preheatRedBagSend
              }
              },500)
            } else {
                 this.setData({doNextTask:false,"redBag.state":0})//没有任务做了，不翻倍
                 //if(taskList2.length==0) this.onNotTaskTap()//没有任务做了，领奖
            }
            }
            )        
           
           
          } else {           
                this.setData({"showPopInfo.isShowPop":false })   
                //if(taskList2.length==0)                   this.onNotTaskTap()         
          }*/
        })
      })


    }, this._isHided ? 500 : 0)


  },
  onShowRule() {
    this.setData({ rule: true });
  },
  onShowResult() {
    // this.setData({ drawResult: true, awardPrizes: { win: true, prizeName: "测试测试", image: "xx" } });
  },

  onResultClick() {
    this.onResultClose()
  },
  onBannerClick() {
    this.onResultClose()
  },
  onBannerTap(e: any) {
    let { currentTarget: { dataset } } = e
    let { obj } = dataset
    common.handleNavigate(obj)
  },
  onGoodsTap(e: any) {
    let { currentTarget: { dataset } } = e
    let { obj } = dataset
    common.handleNavigate(obj)
  },
  
  handleJump(event: any) {
    let { currentTarget: { dataset } } = event
    let { obj } = dataset
    if (obj) {
      common.handleNavigate(obj)
    }
  },
  /*
  onPageScrollTap(obj: any) {
    if (obj) {
      console.log('onPageScrollTap', obj)
      let { type, sellerId } = obj
      if (type == 'live') {
        my.pageScrollTo({
          selector: '.live',//`.box-card.live-${sellerId}`,   //       
          success: () => {
            console.log("success")
          }
        });
      } else if (type == 'topic') {
        my.pageScrollTo({
          selector: ".brandtopics",//,`.topicbox.topic-${sellerId}`,          
          success: () => {
            console.log("success")
          }
        });
      } else {
        common.handleNavigate(obj)
      }
    }
  },*/
  onAppear() {
    console.log("onAppear")
  },
  async onPreheatRedBagList() {
      this.setData({
        recordListShow: true,
      })
    return await this.dispatch('$service:preheatRedBagList');
  },
  closeRecordList(){
    this.setData({
      recordListShow: false,
    })
  },
  // 去入会
  onJoinMember() {
    console.log("去入会")
    let { showPopInfo } = this.data

    if ('taskPop2' != showPopInfo.showPop) {
      this.setData({
        'showPopInfo.isShowPop': false,
      }, () => {
        let res = this.goNextTask()
        if (!res) {
          console.log("没有任务了")
        }
      })
    } else {
      let res = this.goNextTask()
      if (!res) {
        console.log("没有任务了")
      }
    } 
   
   
  },
  // 弹框去翻倍
  onGoDouble() {
    console.log("去翻倍")
    this.setData({
      'showPopInfo.isShowPop': false,
    },()=>{     
       /* let { redBagDouble, redBag, taskList2 } = this.data 没有翻倍了
        let amount = redBagDouble.doubleAmount || redBag.doubleAmount
        let progressBar = redBagDouble.progressBar || redBag.progressBar || redBagDouble.totalCount
        let count = redBagDouble.count || redBag.count
        if (taskList2.length) {
          let currentTask = taskList2[0]
          let showPopInfo = {
            isShowPop: true,
            showPop: "taskPop2",
            brandText:`${currentTask.name}`,
            redEnvelopeAmount: amount,// ||  gameZone.money,
            taskTotalCount: progressBar,//backClass.length  ,
            taskCompleteCount: progressBar - count,
            logoUrl:currentTask.icon_img
          }
        this.setData({showPopInfo,doNextTask:true})
      }else {
        console.log("none task")
      }*/
    })
  
   
  },

  // 弹框 去意已决 
  onGoLeave() {
    console.log("去意已决")
    this.onNotTaskTap()
    this.setData({
      "redBag.state":1,
      'showPopInfo.isShowPop': false,
    })
  },

  // 弹框关闭
  onTaskPopClose() {
    this.setData({
      'showPopInfo.isShowPop': false,
    })
  },
  // 分享赢更多红包
  onGoShare() {
    //@ts-ignore
    //my.showSharePanel();
    this.dispatch("$service:getShareRecordList")
    this.setData({
      'showPopInfo.isShowPop': false,
    })
  },

  // 去分享
  onGoToShare() {
    this.setData({
      'showPopInfo.isShowPop': false,
    },()=>{
     //@ts-ignore
      my.showSharePanel();
    })  
 
  },

  // 去填写收货地址
  onGetAddress(obj:any) {
    //@ts-ignore
    my.getAddress({
      success: (res: any) => {
        /**
         * {
  "resultStatus": "9000",
  "result": {
    "address": "浙江省杭州市西湖区西溪路556号", // 详细地址
    "country": "中国", // 国家名称
    "prov": "浙江省", // 省
    "city": "杭州市", // 市
    "area": "西湖区", // 区
    "street": "", // 街道
    "fullname": "张三", // 名称
    "mobilePhone": "182XXXXXXX" // 手机号
  }
}
         */
        let { address, country, prov, city, area, street, fullname, mobilePhone } = res && res.result || {}

       // let getEntityPrize = this.data.$result.getEntityPrize // state.getIn(['$result', 'getEntityPrize'],{})
        //console.log("getEntityPrize success",getEntityPrize)
        let {showPopInfo,gifZone} =  this.data
        let gameRecordId =showPopInfo.gameRecordId ||  (obj && obj.gameRecordId)
        let prizeName = showPopInfo.prizeName || (obj && obj.prizeName)
        let awardPicUrl

        if (obj) {
          let gifs = gifZone.filter((a: any) => a.title == prizeName)
          if(gifs && gifs.length ) {
          let gif = gifs.pop()
          let { title, image } = gif
          // prizeName=title,
          awardPicUrl = image
          }
        }


        if(!gameRecordId) {       
        let entityPrize = this.data.$result.getEntityPrize // state.getIn(['$result', 'getEntityPrize'],{})
        console.log("getEntityPrize success",res)
        gameRecordId = entityPrize && entityPrize.gameRecordId
         }
        let  isShowPop = !!gameRecordId
        showPopInfo = {
           awardName:prizeName,
           awardPicUrl,
          ...showPopInfo,         
          gameRecordId,
          result: { address, country, prov, city, area, street, fullname, mobilePhone },
          isShowPop,
          showPop: "getAddress",
          //awardName: name,
          addressName: fullname,
          addressMobile: mobilePhone,
          address: country + prov + city + area + street + address,
          // awardPicUrl: "https://images.allcitygo.com/image/double202011/pic_hongbao.png?x-oss-process=image/format,webp", // 奖品图片地址 

        }
        this.setData({ showPopInfo })
        if(!isShowPop) {
          my.showToast({content:"亲，无需填写收货地址"})
        }
      }
    });
    this.setData({
      'showPopInfo.isShowPop': false,
    })
  },
  // 收货地址完成
  async onAddressComplete() {
    let {showPopInfo} = this.data
    let {gameRecordId} =showPopInfo
    if(!gameRecordId) {
    let res = this.data.$result.getEntityPrize // state.getIn(['$result', 'getEntityPrize'],{})
    console.log("getEntityPrize success",res)
     gameRecordId =res && res.gameRecordId
     // let {prizeId,name,picture,winStatus,gameRecordId} = res
     }
    let {result:{address,country,prov,city,area,street,fullname,mobilePhone},} = this.data.showPopInfo
    await this.dispatch('$service:addPrizeAddress',{gameRecordId,address,country,prov,city,area,street,fullname,mobilePhone})
    await this.dispatch('$service:preheatRedBagList');
   /* this.setData({
        'showPopInfo.isShowPop': false,
    })*/
  },
  // 收货地址修改
  onAddressUpdate() {
    this.onGetAddress()
    this.setData({
        'showPopInfo.isShowPop': false,
    })    
  },
  // 神秘礼包 点击领取
  onGetGift() {
    let {jump} = this.data.showPopInfo
    jump && common.handleNavigate(jump)
    this.setData({
        'showPopInfo.isShowPop': false,
    })   
  },
  // 出行券 去乘车
   onGoRiding() {
    //"buttonText":"(结果框按钮标题)立即乘车",
    //	"buttonLink":"(结果框按钮链接)https://",
     this.setData({
      'showPopInfo.isShowPop': false,
    },()=>{
    let jumpObj = this.data.jumpObj || {}
    let {buttonLink} = jumpObj
    if (buttonLink && buttonLink.indexOf("alipays://platformapi/startapp")>-1) {
      my.ap.navigateToAlipayPage({ path: buttonLink })
    } else {
      common.handleNavigate(buttonLink)
    }
   })
  },

  // 其他权益 领取
  onPopReceive(item:any){
    console.log("onPopReceive:",item)
    item && item.url && common.handleNavigate(item.url)
    /*this.setData({
        'showPopInfo.isShowPop': false,
    })  */
  },

  onTapTreasureBox(){
    let { treasureBoxComplete}    = this.data
    if(!treasureBoxComplete) {
      my.showToast({content:"亲，浏览15秒后再点击"})
      return
    }
    this.onDrawTap(null,{userTap:"BOX_TAP"})
  },

  goback(){
       my.pageScrollTo({scrollTop:0})
  },
  onReachBottom() {
    this.onBottomLoad()
  },
  onBottomLoad() {
   this.setData({bottomLoad:true})
  },
  ...basepage
});
