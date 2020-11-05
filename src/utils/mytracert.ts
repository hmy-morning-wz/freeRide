export interface TracertOption {
  spmAPos: string, // spma位，必填 
  spmBPos: string, // spmb位，必填
  system: string,
  subsystem: string,
  bizType: string, // 业务类型，必填
  logLevel: number, // 默认是2
  chInfo: string, // 渠道
  debug: boolean,
  mdata: any // 通⽤的数据，可不传，传了所有的埋点均会带该额外参数 
}
export class MyTracert implements TracertOption {
  option: TracertOption = {
    spmAPos: '',  
    spmBPos: '',  
    system: "",
    subsystem: "",
    bizType: 'common', 
    logLevel: 2,  
    chInfo: '', 
    debug: false,
    mdata: {  
    }
  }
  spmAPos='' 
  spmBPos='' 
  system='' 
  subsystem='' 
  bizType='' 
  logLevel=2 
  chInfo='' 
  debug=false 
  mdata={}
  constructor(option: TracertOption) {
    this.option = { ... this.option, ...option }
    Object.assign(this,this.option)
  }
  
  clickContent(spmId:string,scm:string,newChinfo:string,params:string){//spmId, scm || "", newChinfo || "", params || ""
     my.reportAnalytics("c."+spmId,{...this.mdata,scm,newChinfo,params,chInfo:this.chInfo})
     if(this.debug) {
       console.log('[MyTracert]clickContent',spmId,scm,newChinfo,params)
     }
  }
  expoContent(spmId:string,scm:string,newChinfo:string,params:string){//spmId, scm || "", newChinfo || "", params || ""
     my.reportAnalytics("e."+spmId,{...this.mdata,scm,newChinfo,params,chInfo:this.chInfo})
      if(this.debug) {
       console.log('[MyTracert]expoContent',spmId,scm,newChinfo,params)
     }
  }
  logPv(params:string|any){
    params =params || ""
     my.reportAnalytics('logpv',{...this.mdata, chInfo:this.chInfo})
       if(this.debug) {
       console.log('[MyTracert]logPv',params)
     }
  }
}