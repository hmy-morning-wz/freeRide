import { App } from 'herbjs';
import { IAppStore } from './store';
/*
App<IAppStore>({
  onLaunch(options) {
    console.log('app onShow', options);
  },
  onShow(options) {
    console.log('app onShow', options);
  },
  onHide() {
    console.log('app onHide');
  },
  onError(msg) {
    console.log('app onError: ', msg);
  },
  globalData: {
  },
});
*/
import '@tklc/miniapp-tracker-sdk'

import { getUserId, config ,request} from './utils/TinyAppHttp'


import serviceplugin from "./utils/serviceplugin"
import servicesCreactor from "./utils/serviceCreator"
// import Store from './store'
// @ts-ignore
import { MyTracert}  from './utils/mytracert'

import GlobalData from './utils/globalData'
import common from './utils/common'
import ext from "./ext"
import pageJson from './services/pageJson'
/*
import aes from "./utils/aes"
import sm4 from "./utils/sm4"

let ret1 =  sm4.encrypt("2088232317811628,2088232317811628,2088232317811628,2088232317811628,2088232317811628,2088232317811628,2088232317811628,2088232317811628,2088232317811628,2088232317811628,2088232317811628-END","41ded573014071341627e7251a4ac221",{ keyIsHex:true,msgIsHex:false})
console.log("encrypt sm4",ret1.length,ret1)
let msg1 =  sm4.decrypt(ret1,"41ded573014071341627e7251a4ac221",{ keyIsHex:true,msgIsHex:true,asString:true})
console.log("encrypt sm4",msg1.length,msg1)

let ret2 =  aes.encrypt("2088232317811628,2088232317811628,2088232317811628,2088232317811628,2088232317811628,2088232317811628,2088232317811628,2088232317811628,2088232317811628,2088232317811628,2088232317811628-END","41ded573014071341627e7251a4ac221",{ keyIsHex:true,msgIsHex:false})
console.log("encrypt aes",ret2.length,ret2)
let msg2 =  aes.decrypt(ret2,"41ded573014071341627e7251a4ac221",{ keyIsHex:true,msgIsHex:true,asString:true})
console.log("encrypt aes",msg2.length,msg2)*/
const extJson = ext.ext
/*
if (!my.canIUse('plugin') && !my.isIDE) {
       my.ap && my.ap.updateAlipayClient && my.ap.updateAlipayClient();
}*/
// @ts-ignore
//const extJson = my.getExtConfigSync()
const env = extJson.env
//a56.b23056

const Tracert = new MyTracert({
spmAPos: 'a56', // spma位，必填 
spmBPos: 'b23056', // spmb位，必填
system:"a1001",
subsystem:"b1001",
bizType: 'common', // 业务类型，必填
logLevel: 2, // 默认是2
chInfo: '', // 渠道
debug:env=='sit',
mdata: { // 通⽤的数据，可不传，传了所有的埋点均会带该额外参数
 },
})
const appVersion = {
  version:"1.0",
  date:"-"
}

//setEnv(env)
/*const pubkey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDKmi0dUSVQ04hL6GZGPMFK8+d6\n' +
     'GzulagP27qSUBYxIJfE04KT+OHVeFFb6K+8nWDea5mkmZrIgp022zZVDgdWPNM62\n' +
     '3ouBwHlsfm2ekey8PpQxfXaj8lhM9t8rJlC4FEc0s8Qp7Q5/uYrowQbT9m6t7BFK\n' +
     '3egOO2xOKzLpYSqfbQIDAQAB'*/
App<IAppStore>({
  Tracert,
  request, 
  serviceplugin,
  servicesCreactor,
  extJson,
  appId:extJson.appId,
  cityCode:{},
  globalData: new GlobalData({ 
    secureCode:Date.now()+"41ded573014071341627e7251a4ac22126209ac62dde483e2cd645af567e21e2"+Math.random(),
    env: extJson.env,
    url: extJson.url,
    title:extJson.title,
    version: appVersion.version
  }),
  mtrConfig: {
    server: ['https://webtrack.allcitygo.com:8088/event/upload'],
    version: appVersion.version + '@' + appVersion.date,
    stat_auto_expo: true,
    stat_reach_bottom: true,
    stat_batch_send: true,
    appName: extJson.title,
    appId: extJson.appId,
    stat_app_launch: false,
    stat_app_show: false,
    //bizScenario: (query && query.bizScenario) || scene || (referrerInfo && referrerInfo.appId) || "",
    mtrDebug: env=='sit'
  },
  async onLaunch(options: any) {
    this.time = +Date.now() 
    const { query, scene, referrerInfo } = options
    let globalData = this.globalData
    let extraBz = referrerInfo && referrerInfo.extraData && referrerInfo.extraData.bizScenario;
    let bizScenario = extraBz || (query && query.bizScenario) //|| scene || (referrerInfo && referrerInfo.appId) || ""
    globalData.bizScenario = bizScenario
    if(this.Tracert) { this.Tracert.chInfo = bizScenario || scene || (referrerInfo && referrerInfo.appId)  }
    globalData.appId = extJson.appId,
    globalData.query = query
    globalData.scene = scene
    globalData.env = extJson.env
    //'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCe1HcHiKzaJdziPwrtmlW72gaDx+0DlhaGphVUwWkmlvWHd6mteVrr7Gs5CHaf8Y9XJbfkoHH8aEWpnhk9hYHy+JuQPYjYAgkK6IVpY69tnRrdrV42+DRPJSwDqfKrqBbYNYo9ddNSyO/uixYJPLIVwdrRTMUu19oeSSIVAvATWQIDAQAB' //
    globalData.pubkey =extJson.pubkey
    this.replaceConfig = globalData.replaceConfig = { appName: extJson.title, appId: extJson.appId, bizScenario: bizScenario, ...extJson.cityInfo }
    console.info('App onLaunch', options, globalData);
    //getUserId()  
    config({
      env,
      appscrete:extJson.appscrete, //    "appscrete":"CuT9cpTUmIl/LrUVPdq7MLTmLouetevsk2F16/2+sQw=",
      appId: extJson.appId,
      autoLogin: false,
      hostBaseUrl: env === 'sit' ? 'https://sit-basic-ug.allcitygo.com' : 'https://ztmanage.allcitygo.com:8192'
    })
    this.systemInfo = {env:extJson.env  }   
    updateSystemInfo().then((res)=>{
      Object.assign(this.systemInfo,res)  
    }) 
    this.loadUserId()
    my.reportAnalytics("v" + this.mtrConfig.version,
      { version: this.mtrConfig.version });
 
  },
  taobaoResult(param: any) {
    //console.log("taobaoResult", JSON.stringify(param));
    this.globalData.taobaoResult = param
    //https://h5.m.taobao.com/smart-interaction/follow.html?_wvUseWKWebView=YES&type=tb&id=424353450&r=false&img=&back=http%3a%2f%2ftest.tamll.com%3a6501%3ffollowedId%3d92686194&pts=1564979196718&hash=A9674CCC6694A869FCC522F2B1941FBD

    //&from=follow&tbResult=0 
    let { followedId, from, tbResult } = param
    if (followedId && from && tbResult == 0 && from == 'follow') {
      param = { ...param, code: 'SUCCESS', sellerId: followedId, type: 'follow' }
      this.globalData.taobaoResult = param
    }
    //
    this.$emitter && this.$emitter.emitEvent('taobaoResult', param)
    //my.showToast({ content: JSON.stringify(param) });
    //my.navigateTo({ url: common.makeUrl("/pages/result/result", param) });
  },
  onShow(options: any) {
    const { query, scene, referrerInfo } = options
    let globalData = this.globalData
    let extraBz = referrerInfo && referrerInfo.extraData && referrerInfo.extraData.bizScenario;
    let bizScenario = extraBz || (query && query.bizScenario) //|| scene || (referrerInfo && referrerInfo.appId) || ""
    globalData.bizScenario = bizScenario
    this.type = (query && query.type) || 'normal'
    if (query) {
     /**免费乘车 */ 
      this.msg = query
      this.navigate = options.query
      if (options.referrerInfo && options.referrerInfo.extraData) {
        this.cityCode = (options.referrerInfo && options.referrerInfo.extraData) || ''      
      }
     /**免费乘车 */      
      if (query._preview) {
        let reg = new RegExp('\{.*\}')
        if (reg.test(query._preview)) {
          try {
            let preview = JSON.parse(query._preview)
            if (preview && preview.exp) {
              if (+Date.now() > preview.exp) {
                console.warn("预览码过期")
                preview = null
                my.showToast({ content: "亲，你扫的预览码已过期" })
              }else {
                  let {locationId , templateId,key} = preview
                  pageJson.queryPageJson({appId: this.appId , locationId, templateId,key }).then((res)=>{
                   if (res && res.success && res.data) { 
                       globalData.set(`PAGE_JSON_${locationId}_${templateId}`, res.data, { expire: 30 * 60000 })
                    }
                  })

              }
            }
            this.preview = preview
       
             
          } catch (err) {

          }
          console.log("_preview", query, this.preview)
        }

      }
      if (query.clear) {
        my.clearStorageSync()
        setTimeout(async() => {
          await this.globalData.clear()
          my.clearStorageSync()
          my.confirm({
            title: '缓存清除提示',
            content: '缓存已经清除，是否重启应用？',
            success: function (res) {
              if (res.confirm) {               
                my.clearStorageSync()                
                my.reLaunch({ url: '/pages/index/index' })
              }
            }
          })
        }, 3000);
      }

    }

    globalData.query = query
    globalData.scene = scene
    if (query) {
      let { notifyParam } = query
      if (notifyParam) {
        let result = common.qs.parse(notifyParam)
        this.taobaoResult(result)
      }
    }
  
  let time = +Date.now() - this.time
  my.reportAnalytics("app_show",{time})
  
  },

  onHide(){
    let time = +Date.now() - this.time
    my.reportAnalytics("app_hide",{time,route:this.route})
  },
     async loadUserId() {      
      if (!this.alipayId) {
        let userId = await getUserId()
        this.alipayId = userId
        this.globalData.userId =userId
        this.replaceConfig.userId = userId
        return { success: userId || false }
      }
      return { success: this.alipayId }
    },
     handleIconClick(e: { currentTarget: { dataset: { obj: any; seedName: any } }; detail: { formId: any } }) {
      console.log('handleClick', e.currentTarget.dataset) 
      if (e.detail && e.detail.formId) {
        console.log("formId", e.detail.formId)
        this.formId =   this.globalData.formId = e.detail.formId
      }
      let obj = e.currentTarget.dataset.obj
      if (!obj) {
        console.warn('handleClick dataset obj is undefine')
        return
      }    
     
      common.handleNavigate(obj, this)
    },
})

async function updateSystemInfo() {
  let res = await common.getSystemInfoSync()
  let versionCodes = res.version.split(".").map((t: string) => parseInt(t))
  let version = versionCodes[0] * 10000 + versionCodes[1] * 100 + versionCodes[2]
  if (version < 100170) {//10.1.70
    my.showToast({
      type: 'success',
      content: '您当前支付宝版本过低，须更新'
    })
    //@ts-ignore
    my.canIUse('ap.updateAlipayClient') && my.ap.updateAlipayClient()

  } else {
    let sdkVersionCodes = my.SDKVersion.split(".").map((t: string) => parseInt(t))
    let sdkVersion = sdkVersionCodes[0] * 10000 + sdkVersionCodes[1] * 100 + sdkVersionCodes[2] // my.SDKVersion.replace('.', '').replace('.', '')
    if (sdkVersion < 11100) {// 1.11.0
      my.showToast({
        type: 'success',
        content: '您当前支付宝版本过低，须更新'
      })
      //@ts-ignore
      my.canIUse('ap.updateAlipayClient') && my.ap.updateAlipayClient()
    }
  }



  try {
    if (my.canIUse('getUpdateManager')) {
      // @ts-ignore
      const updateManager = my.getUpdateManager()
      updateManager.onCheckForUpdate(function (res: { hasUpdate: any }) {

        console.log(res.hasUpdate)
      })
      updateManager.onUpdateReady(function () {
        my.confirm({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function (res) {
            if (res.confirm) {

              updateManager.applyUpdate()
            }
          }
        })
      })

      updateManager.onUpdateFailed(function () {

      })
    }
  } catch (err) {
    console.error(err)
  }
  return res
}




