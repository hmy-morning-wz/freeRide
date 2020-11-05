
import common from '../../utils/common'
Component(connect({
  mapStateToProps: ['taskTitle','taskList2' ,'taskCountList','taskList']
})({
  mixins: [],
  data: {
    currentItemId:0,
    currentItem:{}
    },
  props: {

  },
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  deriveDataFromProps() {
    let {taskCountList} = this.data
    if(taskCountList){
    let len = Object.keys(taskCountList).length
    if(this.taskLength!=len){
        this.setData({currentItemId:0})
        this.taskLength = len
    }
    }
  },
  methods: {
     onAppear(){},
     onNoneTap(e) {
     },
     onModalClose(e) {
      console.log('onModalClose',e)     
      let onModalClose = this.props.onModalClose;
      if (onModalClose) {
        onModalClose(e);
      }else {
       
      }
    },
    async onTaskTap(e) {
      if( this.goTimestamp1 &&  (+Date.now()-this.goTimestamp1<2000 )) {
        console.warn('onTaskTap 点击太快了') 
        return
      }
      this.goTimestamp1 = +Date.now()   

      let { currentTarget:{dataset}  } = e
      let { index,obj} = dataset
      if(obj){
       /*if(obj.count == obj.complete) {
          console.log('onTaskTap complete',obj)  
         return
       }*/
      console.log('onTaskTap',index)  
    
      let onGoTask = this.props.onGoTask;
      let taskType = obj.taskType
      if(taskType=='member'){
          let res = await common.isMember(obj,true)
          console.log('onGoTask isMember',res) 
          if(res.isMember) {  
                   
            return
          }
      }
      else if(taskType=='follow'){
          let res = await common.isFollow(obj,true)
          console.log('onGoTask isFollow',res) 
          if(res.isFollow) {      
          
            return
          }
      }
      
      onGoTask && onGoTask(obj);
      this.setData({currentItemId:index,currentItem:obj})
      }
    },
   async onGoTask(e) {
      //console.log('onGoTask',e)     
      if( this.goTimestamp &&  (+Date.now()-this.goTimestamp<2000 )) {
        console.warn('onGoTask 点击太快了') 
        return
      }
      let onGoTask = this.props.onGoTask;
      if (onGoTask) {
         console.time('onGoTask')
        let {currentItemId,taskList,taskCountList} = this.data
        if(taskCountList && taskList) {         
        let {taskType} =taskCountList[currentItemId||0]
        let objs = taskList[taskType]
        if(objs){
          let key 
          let list = Object.keys(objs).filter((t)=>{  return !(objs[t].complete||objs[t].isMember)   })
          do{
          key =list.shift()
          if(taskType=='member'){
          let res = await common.isMember(objs[key],true)
          console.log('onGoTask isMember',res) 
          if(res.isMember) {
            continue
          }
          }else if(taskType=='follow'){
          let res = await common.isFollow(objs[key],true)
          console.log('onGoTask isFollow',res) 
          if(res.isFollow) {
            continue
          }
          }
          break
          }while(list.length)
          console.log('onGoTask',key)  
          //taskList[currentItem.sellerId]   
          this.goTimestamp = +Date.now()       
          onGoTask(objs[key]);
         }
        }
       console.timeEnd('onGoTask')
      }else {
       
      } 
    }
  },
}))
