import { CALL_AJAX, CALL_RPC } from './symbols';
import { getUserId } from '../utils/TinyAppHttp'
import * as _ from "./utils"
const modeMap:{[x:string]:Symbol} = {
  ajax: CALL_AJAX,
  rpc: CALL_RPC
};
const MAX_ENCRYPT_BLOCK = 117;

async function encryptRSA(pubkey:string,data:any){ 
  if(!data || !pubkey) {
    console.log("rsa no input")
    return ""
  }
  return new Promise((r,v)=>{
   let text =data //JSON.stringify(data)
   console.log("rsa encryptRSA text",text)    
   my.rsa({
     action: 'encrypt',
     text: text,
     // 设置公钥，需替换你自己的公钥
     key: pubkey, 
     success: (result:any) => {
       
       if(result.text) { 
         let bytes = _.base64ToArrayBuffer(result.text)
         // console.log("rsa",text,result,bytes)         
         r(bytes)
         return 
       }
       v(result)
     },
     fail(e) {
       v(e)
     },
   });
  })
  
}

export default function servicesCreactor(obj:any, mode = 'ajax') {
  return Object.keys(obj)
  .reduce((p:any, v:any) => {
    const func = obj[v];
    p[v] =async function({ dispatch ,commit}:{dispatch:Function,commit:Function}, payload:any) {
      //let userId = await getUserId()
      let globalData = getApp().globalData
      const value:ServiceRequestData = func(payload,globalData);   
      if(value.data && 'userId' in value.data && (!value.data.userId)) {
         let userId = await getUserId()
         value.data.userId= userId
      }
      
      if(value.data && (value.encrypt) &&  globalData.pubkey) {
      
        try{
        let text = JSON.stringify(value.data)
        // console.log("rsa",text)
        const inputLen = text.length;
        let offSet = 0;
        let cache;
        let i = 0;
        let encrypt:any
          while (inputLen - offSet > 0) {
            if (inputLen - offSet > MAX_ENCRYPT_BLOCK) {
                cache = await encryptRSA( globalData.pubkey,text.slice(offSet,offSet+ MAX_ENCRYPT_BLOCK));
            } else {
                cache =  await encryptRSA( globalData.pubkey,text.slice(offSet, offSet+ inputLen - offSet));
            }
            
            encrypt = encrypt && cache &&  _.arrayBufferConcat(encrypt,cache) || cache
            // console.log("rsa encrypt",encrypt,cache)
            i++;
            offSet = i * MAX_ENCRYPT_BLOCK;
        }
        
        //let encrypt = await encryptRSA( globalData.pubkey,text)
        value.data = {data:_.arrayBufferToBase64(encrypt)}
        }catch(e){
          console.warn("encryptRSA fail",e)
        }
      }
      value.type = value.type || v;
      console.log("services dispatch start",value.type)
      await dispatch(modeMap[mode], value);
      if(value.nextAction) {
        console.log("services nextAction dispatch",value.nextAction)
        if(typeof value.nextAction === 'string') {
          await dispatch(value.nextAction) 
        }else if(value.nextAction.length){
         await Promise.all(value.nextAction.map((name,index)=>{   
            console.log("services nextAction dispatch",index,name)
            return dispatch(name)}))         
        }
        
      }
      console.log("services dispatch end",value.type)
    };
    return p;
  }, {});
}