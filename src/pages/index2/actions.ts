import common from "../../utils/common"

export default {
  //actionPereheatRedBagPopup
   actionPereheatRedBagPopup({ state, dispatch, commit, getters }: any) {
      let result = state.getIn(['$loading', 'pereheatRedBagPopup'], {})
      if ((!result.isLoading) && result.type === 'SUCCESS' && result.code == '20000') {
         let res = state.getIn(['$result', 'pereheatRedBagPopup'], {})
         console.log("pereheatRedBagPopup success", res)
           let redBagDouble = state.getIn(['redBagDouble'],{})
           let currentTask = state.getIn(['currentTask'],{})
         //let {amount,count} = res //
         //let globalData = getApp().globalData
         redBagDouble = {...redBagDouble,...res}
         //let redBagDouble = res
        let amount = redBagDouble.doubleAmount 
        let progressBar =  redBagDouble.progressBar 
        let count =  redBagDouble.count 
        if(count && progressBar && amount) {
        let showPopInfo= {
            isShowPop: true,
            showPop: "taskPop2",
            redEnvelopeAmount:amount,
            taskTotalCount: progressBar,//backClass.length/*count   || taskList2.length  */   ,
            taskCompleteCount:progressBar-(count||0), //backClass.length - taskList2.length 
            logoUrl:currentTask.icon_img
         }
         commit("redBagDouble",{showPopInfo,redBagDouble})
      }
   }else {
        my.showToast({content:"亲，系统开小差了，请稍后再试"})
   }
   },

   actionGetStoreTaskState({ state, dispatch, commit, getters }: any) {
      let result = state.getIn(['$loading', 'getStoreTaskState'], {})
      if ((!result.isLoading) && result.type === 'SUCCESS' && result.code == '20000') {
         let res = state.getIn(['$result', 'getStoreTaskState'], {})
         console.log("getStoreTaskState success", res)
         let globalData = getApp().globalData
         //request  data sellerId
         res && res.length && res.forEach((element:any) => {
            let { sellerId ,state} = element
            if (sellerId && state==1) {
               globalData.set(`goshop-${sellerId}`, 2)
            }
         });
         dispatch("updateGoShopList")
      }
   },

   actionGetShareRecordList( { state, dispatch, commit, getters }: any)  {
      let result = state.getIn(['$loading', 'getShareRecordList'],{})
      if ((!result.isLoading) && result.type === 'SUCCESS'  && result.code == '20000') 
      {
        let res = state.getIn(['$result', 'getShareRecordList'],{})
        console.log("getShareRecordList success",res)
  /*amountMoney: 100, 
                  list: [{
                     id: 1, userId: 0, sharedUserId: "2088", shareMoney: 9.99, state: 1,//状态 0.待 1.显示金额	
                     gmtCreate: '20200901',
                     gmtModified: '20200901',
                  }]*/
         let showPopInfo= {
            isShowPop: true,
            showPop: "share",
            redEnvelopeAmount:res.amountMoney||0,
            shareList:res.list &&res.list.length?( res.list.map((t:any)=>{ 
               let {sharedUserId:userName,nickname,shareMoney:amount,state:completetStatus} = t  
               if(nickname) {
                 nickname = decodeURIComponent(nickname)
               }
               return {userName:nickname||userName,amount,  completetStatus } 
            }
               )) :[]// userName: "13895069039", // 用户名          completetStatus: 1,  // 分享的状态           amount: 2,  // 金额
        }
        commit("SHOW_POP_INFO",showPopInfo)
      }
   },

   actionPreheatRedBagShow( { state, dispatch, commit, getters }: any) {
       let result = state.getIn(['$loading', 'preheatRedBagShow'],{})
      if ((!result.isLoading) && result.type === 'SUCCESS'  && result.code == '20000') 
      {
         let res = state.getIn(['$result', 'preheatRedBagShow'],{})
        
        console.log("preheatRedBagShow success",res)

        let reachDrawTime =  state.getIn(['reachDrawTime'])
       // let gameZone =  state.getIn(['gameZone'])
        res.amount =  res.amount  || 0 // 已领红包金额
        res.sumAmount =  res.sumAmount  || 0 
        let count = state.getIn(['completeCount'])
        let gifReach = (reachDrawTime && ( (+count) >= +reachDrawTime )) || false // 改成完成任务次数
        let app:any = getApp()
        if(app.Tracker) {
            app.Tracker.setData("redBagAmount",res.amount)
            app.Tracker.setData("gifReach",gifReach) 
        }         
     
        commit("redBag",{redBag:res,gifReach})
        /* let redBagDouble =  state.getIn(['redBagDouble'],{})
        if(count && !redBagDouble.count) {
           redBagDouble.count = count
            commit("redBagDouble",{redBagDouble})
        }*/
        // 更新实物抽奖区
        dispatch("actionGetEntityPrizeList")
      }
   },


   actionPreheatRedBagDouble({ state, dispatch, commit, getters }: any) {
       let result = state.getIn(['$loading', 'preheatRedBagDouble'],{})
      if ((!result.isLoading) && result.type === 'SUCCESS'  && result.code == '20000') 
      {
         let res = state.getIn(['$result', 'preheatRedBagDouble'],{})
        console.log("preheatRedBagDouble success",res)
        let redBagDouble = state.getIn(['redBagDouble'],{})
         //let {amount,count} = res //
         //let globalData = getApp().globalData
         redBagDouble = {...redBagDouble,...res}
         commit("preheatRedBagDouble",{ redBagDouble })
         //globalData.set("redBagDouble",redBagDouble)
        /*let showPopInfo= {
            isShowPop: true,
            showPop: "taskPop2"            
        }
        commit("SHOW_POP_INFO",showPopInfo)*/
        
      }
   },

   actionPreheatRedBagSend({ state, dispatch, commit, getters }: any)   {
      let result = state.getIn(['$loading', 'preheatRedBagSend'],{})
      if ((!result.isLoading) && result.type === 'SUCCESS'  && result.code == '20000') 
      {
         let res = state.getIn(['$result', 'preheatRedBagSend'],{})
         let mysticalGif = state.getIn(['mysticalGif'],{})
         let {amount} = res
        console.log("preheatRedBagSend success",res)
          let showPopInfo= {
            jump:mysticalGif,
            isShowPop: true,
            showPop: amount?"redPacket3":"notWinning" , 
            redEnvelopeAmount:amount,
            giftTitle:mysticalGif.title,//"26元神秘礼包",            
        }
        commit("SHOW_POP_INFO",showPopInfo)
      }else {
         my.showToast({content:"亲，系统开小差了，请稍后再试"})
      }
   },
   /*
   actionGetInitiationLimitList({ state, dispatch, commit, getters }: any) {
      let result = state.getIn(['$loading', 'getInitiationLimitList'],{})
      if ((!result.isLoading) && result.type === 'SUCCESS'  && result.code == '20000') 
      {
         let res = state.getIn(['$result', 'getInitiationLimitList'],{})

        console.log("getInitiationLimitList success",res)
      }
   },
   */
  
   actionGetStoreLimitList({ state, dispatch, commit, getters }: any)  {
       let result = state.getIn(['$loading', 'getStoreLimitList'],{})
      if ((!result.isLoading) && result.type === 'SUCCESS'  && result.code == '20000') 
      {
         let res = state.getIn(['$result', 'getStoreLimitList'],{})
        console.log("getStoreLimitList success",res)
      }
   },

   actionPreheatRedBagRandom({ state, dispatch, commit, getters }: any)  {
       let result = state.getIn(['$loading', 'preheatRedBagRandom'],{})
      if ((!result.isLoading) && result.type === 'SUCCESS'  && result.code == '20000') 
      {
         let res = state.getIn(['$result', 'preheatRedBagRandom',],{})
          
        console.log("preheatRedBagRandom success",res)
       // my.showToast({content:"到店红包领取成功"}) // for test
        let showPopInfo= {
            isShowPop: true,
            showPop: res.amount?"award2":"notWinning",
            awardName:res.amount
        }
        commit("SHOW_POP_INFO",showPopInfo)
        let globalData = getApp().globalData
         //request  data sellerId
        let sellerId =  state.getIn(['$loading', 'preheatRedBagRandom','request','data','sellerId'],{})
        if(sellerId) 
        {
           globalData.set(`goshop-${sellerId}`,2)
           dispatch("updateGoShopList")
        }
        
      }
   },

   actionPreheatRedBagList({ state, dispatch, commit, getters }: any)  {
     let result = state.getIn(['$loading', 'preheatRedBagList'],{})     
      if ((!result.isLoading) && result.type === 'SUCCESS'  && result.code == '20000') 
      {
        let res = state.getIn(['$result', 'preheatRedBagList'],[])
        let recordList = res
        commit("recordList",{recordList})
        console.log("preheatRedBagList success",res)
      }else {
         console.log("preheatRedBagList fail")
      }
   },

   actionGetEntityPrizeList({ state, dispatch, commit, getters }: any)  {
       let result = state.getIn(['$loading', 'getEntityPrizeList'],{})
      if ((!result.isLoading) && result.type === 'SUCCESS'  /*&& result.code == '20000'*/) //todo
      {
        let res = state.getIn(['$result', 'getEntityPrizeList'],[])
        if(!res.length) {
          res = []
        }
        //let redBag = state.getIn(['redBag'],{})
        console.log("getEntityPrizeList success",res)      
        let gifReach = state.getIn(['gifReach'])  
        let gifZone = state.getIn(['gifZone'],[])        
         if (gifZone && /*gifZone.length &&*/ res /*&& res.length*/) {
            gifZone = gifZone.map((item: any, index: any) => {
               item.index = index
               return item
            })            
            if(res.length) {// todo
               gifZone = common.mergeArray(gifZone, res, { byKey: 'prizeId' }) 
               let gifZoneA =  gifZone.filter((a:any)=>a.status!=1)
               let gifZoneB =  gifZone.filter((a:any)=>a.status==1)
               gifZone =gifZoneA.concat(gifZoneB)
              }
           // let gifZone10 =  gifZone.filter((a:any)=>a.type==1)
            //let gifZone20 =  gifZone.filter((a:any)=>a.type!=1)
       
           /* if (redBag && redBag.amount) {
               gifZone = gifZone.map((t: any) => {
                  t.reach = (+redBag.amount) > +t.reachMoney
                  return t
               })  //reachMoney
            }*/
            let gifZone2: any[] = []
            gifZone && gifZone.length && gifZone.forEach((element: any, index: number) => {
               let g: any[]
               let key = parseInt("" + (index / 3))
               if (index % 3 == 0) {
                  g = []
                  gifZone2.push(g)
               } else {
                  g = gifZone2[key]
               }
               g.push(element)
               gifZone2[key] = g

            });
            let sellerIdList = state.getIn(['sellerIdList'],[])
         
            let goodsCoupon = state.getIn(['goodsCoupon'],[])
            let flashsaleZone = state.getIn(['flashsaleZone'],[])
            //sellerIdList {   }
            let gifZone3: any[] = []
            //gifZone
            //goodsCoupon
            //flashsaleZone
            if(sellerIdList && sellerIdList.length) {
               gifZone3 = sellerIdList.map((item:any)=>{
                  let {sellerId} = item
                 return {
                   ...item,
                   gifZone: gifZone.filter((t: any) => t.sellerId == sellerId).map((t: any, index: number) => {
                     //商品名称-立即领取	a56.b23056.c58534.d120958_N 
                     //商品名称-立即解锁	a56.b23056.c58534.d120957_N
                     let { creativeId, sellerId, status } = t
                     if (status != 1) {
                       let d = (gifReach ? 'd120958' : 'd120957')
                       t.spmId = `\${spmAPos}.\${spmBPos}.c58534.${d}_${index + 1}`
                       t.scm = `\${system}.\${subsystem}.creative.${creativeId||'-'}.\${traceId}.${sellerId||'-'}`
                     }else {
                       delete t.spmId
                       delete t.scm
                     }
                     return t
                   }),
                   goodsCoupon: goodsCoupon.filter((t: any) => t.sellerId == sellerId).map((t: any, index: number) => {
                     //商品抢购	a56.b23056.c58534.d120959_N                    
                     t.spmId = `\${spmAPos}.\${spmBPos}.c58534.d120959_${index + 1}`
                     let { creativeId, sellerId } = t
                     t.scm = `\${system}.\${subsystem}.creative.${creativeId||'-'}.\${traceId}.${sellerId||'-'}`
                     return t
                   }),
                   flashsaleZone: flashsaleZone.filter((t: any) => t.sellerId == sellerId).map((t: any, index: number) => {
                      //优惠券抢购 a56.b23056.c58534.d120960_N
                     t.spmId = `\${spmAPos}.\${spmBPos}.c58534.d120960_${index + 1}`
                     let { creativeId, sellerId } = t
                     t.scm = `\${system}.\${subsystem}.creative.${creativeId||'-'}.\${traceId}.${sellerId||'-'}`
                     return t
                   }),
                 }
               })
            }

            commit("gifZone", { gifZone, gifZone2 ,gifZone3});
         }
     
      }
   },

   actionGetEntityPrize({ state, dispatch, commit, getters }: any)   {// 实物抽奖接口
  let result = state.getIn(['$loading', 'getEntityPrize'],{})
      if ((!result.isLoading) && result.type === 'SUCCESS'  && result.code == '20000') 
      {
         let res = state.getIn(['$result', 'getEntityPrize'],{})
        console.log("getEntityPrize success",res)
         // my.showToast({content:"奖品领取成功"}) //for test
         let {prizeId,picture,winStatus,gameRecordId,sendLastVoucherList} = res
         let gifZone = state.getIn(['gifZone'],[])
         if(winStatus==1) { //中实物
          let gifs =   gifZone.filter((a:any)=>a.prizeId==prizeId)
           let gif = gifs.pop()
           let {title,image} =gif
           let showPopInfo= {            
           isShowPop: true,
           showPop: "award1",
           awardName:title,
           awardPicUrl:image
        }
        commit("SHOW_POP_INFO",showPopInfo)
      }else  if(winStatus==2) { // sendLastVoucherList //一期没行业券         
           let showPopInfo= {            
           isShowPop: true,
           showPop: sendLastVoucherList && sendLastVoucherList.length ? "inviolableRights":"notWinning",  
             inviolableRightsList: sendLastVoucherList && sendLastVoucherList.length && sendLastVoucherList.map((t: any) => {
               let { prizeName, prizeAmount, url } = t
               return {
                 itemId: "",
                 itemTitle: prizeName || prizeAmount,
                 itemIcon: "https://images.allcitygo.com/image/double202011/icon_gift.png?x-oss-process=image/format,webp",
                 isShowBtn: !!url,
                 url,
                 itemDesc: "",
               }
             })        
        }
        commit("SHOW_POP_INFO",showPopInfo)
      }else {         
           let showPopInfo= {            
            isShowPop: true,
            showPop: "notWinning",          
        }
        commit("SHOW_POP_INFO",showPopInfo)
      }
      }
   },

   actionAddPrizeAddress({ state, dispatch, commit, getters }: any) {
     let result = state.getIn(['$loading', 'addPrizeAddress'],{})
      if ((!result.isLoading) && result.type === 'SUCCESS'  && result.code == '20000') 
      {
         let res = state.getIn(['$result', 'addPrizeAddress'],{})
        console.log("addPrizeAddress success",res)
        my.showToast({content:"提交成功"})
          let showPopInfo= {            
            isShowPop: false,          
        }
         commit("SHOW_POP_INFO",showPopInfo)
      }
   },
      actionGetIndustryVoucher({ state, dispatch, commit, getters }: any) {
     let result = state.getIn(['$loading', 'getIndustryVoucher'],{})
      if ((!result.isLoading) && result.type === 'SUCCESS'  && result.code == '20000') 
      {
         let res = state.getIn(['$result', 'getIndustryVoucher'],{})
         let travelButtonText = state.getIn(['jumpObj', 'buttonText'],'')
        console.log("getIndustryVoucher success",res)
         let {prizeName,prizeAmount} = res
         let showPopInfo= {            
           isShowPop: true,
           showPop:(prizeName ||prizeAmount )?"travelVoucher": "notWinning",  
           travelVoucher:prizeName,  
           travelButtonText,
           prizeAmount       
        }
         commit("SHOW_POP_INFO",showPopInfo)
      }
   },
   actionSendVoucher({ state, dispatch, commit, getters }: any) { // 行业兜底券
     let result = state.getIn(['$loading', 'sendVoucher'],{})
      if ((!result.isLoading) && result.type === 'SUCCESS'  && result.code == '20000') 
      {
         let res = state.getIn(['$result', 'sendVoucher'],{})
        //let travelButtonText = state.getIn(['jumpObj', 'buttonText'],'')
        console.log("sendVoucher success", res)
        let inviolableRightsList =  res && res.list || []
        if(inviolableRightsList && inviolableRightsList.length){
       // let { prizeName, prizeAmount,url } = res && res.list.pop()
        let showPopInfo = {
          isShowPop: true,
          showPop: (inviolableRightsList && inviolableRightsList.length) ? "inviolableRights" : "notWinning",
          inviolableRightsList:inviolableRightsList.map((item:any)=>{
            let { prizeName, prizeAmount,url } = item
          return  {
              itemId: "",
              itemTitle: prizeName || prizeAmount,//"0.5现金红包",
              itemIcon: "https://images.allcitygo.com/image/double202011/icon_redbag.png?x-oss-process=image/format,webp",
              isShowBtn: !!url,
              url,
              itemDesc:"",// "可在支付宝-卡包 中查看",
            }
         }) 
        }
        commit("SHOW_POP_INFO", showPopInfo)
      }else {
        my.showToast({content:"任务已做完"})
      }
      }else if( result.code == '500'){
             my.showToast({content:"亲，活动太火爆了，请稍后再来"})
      }
   },
    actionSendRedBag({ state, dispatch, commit, getters }: any) { // actionSendRedBag
     let result = state.getIn(['$loading', 'sendRedBag'],{})
      if ((!result.isLoading) && result.type === 'SUCCESS'  && result.code == '20000') 
      {
         let res = state.getIn(['$result', 'sendRedBag'],{})
   
        console.log("sendRedBag success", res)
             let {flag, amount } = res

       
        if(flag){ 
         let myhealthyMoney = state.getIn(['myhealthyMoney2'],[])

         let {amount,healthyMoney,prizeId} = res      
         myhealthyMoney = myhealthyMoney.filter((t:any)=>t.prizeId==prizeId).pop() || {}
         console.log("preheatRedBagSend success",res)
          let showPopInfo= {
            jump:myhealthyMoney,
            isShowPop: true,
            showPop: (amount||healthyMoney)?"redPacket3":"notWinning" , 
            redEnvelopeAmount:amount,
            giftTitle:healthyMoney && myhealthyMoney.title ?`${healthyMoney}元${myhealthyMoney.title}`:myhealthyMoney.title,          
        }
        commit("SHOW_POP_INFO",showPopInfo)
       
      }else {
        if(amount) {
          my.showToast({content:`恭喜获得${amount}元现金红包`})
        }else {//兜底券
         let inviolableRightsList =  res &&res.preheatRedBagVoucherResponse&& res.preheatRedBagVoucherResponse.list || []
        // if(inviolableRightsList && inviolableRightsList.length)
        //{
       // let { prizeName, prizeAmount,url } = res && res.list.pop()
        let showPopInfo = {
          isShowPop: true,
          showPop: (inviolableRightsList && inviolableRightsList.length) ? "inviolableRights" : "notWinning",
          inviolableRightsList:inviolableRightsList.map((item:any)=>{
            let { prizeName, prizeAmount,url } = item
          return  {
              itemId: "",
              itemTitle: prizeName || prizeAmount,//"0.5现金红包",
              itemIcon: "https://images.allcitygo.com/image/double202011/icon_redbag.png?x-oss-process=image/format,webp",
              isShowBtn: !!url,
              url,
              itemDesc:"",// "可在支付宝-卡包 中查看",
            }
         }) 
        }
        commit("SHOW_POP_INFO", showPopInfo)
       // }
      }
      }
      }else if( result.code == '500'){
             //my.showToast({content:"亲，活动太火爆了，请稍后再来"})
      }
   },
    actionBabycareCheck({ state, dispatch, commit, getters }: any) { // 
     let result = state.getIn(['$loading', 'babycareCheck'],{})
     //  //{"errMsg":null,"requestId":"10f2f201-9aac-4be4-8f9a-a86044feca81","errCode":null,"version":"1.0","data":[{"flag":0}]}
      if ((!result.isLoading) && result.type === 'SUCCESS' ) 
      {
         let res = state.getIn(['$result', 'babycareCheck'],[])
         console.log("babycareCheck success", res)
         if(res && res.length) {           
           let checkMatch = res[0].flag == 1
           let backClass = state.getIn('backClass', [])
           if(checkMatch) {
                  backClass =  backClass.map((t:any)=>{                
                  if(t.bizScenario && !t.match ) 
                  {
                     t.match  =   t.bizScenario.indexOf("CHECK_TAG") >-1                     
                  } 
               return t
            })
            commit("checkMatch",{backClass,checkMatch})
            dispatch("updateTaskList")
            return
           }
            commit("checkMatch",{checkMatch})
         }
      
      }
   },
   
   
   
}