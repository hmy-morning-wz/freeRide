const app = getApp()
Component({
  data: {
    show:true,
    //showPopInfo:{},
    totalTask:5,
    taskProgress:2,
    showTips:false,
    time:0,
    shareList:[{},{},{},{},{},],
    viewData: {
      style: ""
    }
  },
  props: {
    showPopInfo:{},
  },
  async didMount() {
   /*
    this.setData({
      showPopInfo:this.props.showPopInfo,
    })
*/

  },
  didUpdate() {

  },
  methods: {
    
    
    onHandleStart() {
      my.showTabBar({
        animation: false
      })
      this.setData({
        show: false
      })
      var onStartExperience = this.props.onStartExperience

      if (onStartExperience) {
        onStartExperience()
      }
    },
    onJoinMember() {
      this.props.onJoinMember()
    },

    onGoDouble() {
      this.props.onGoDouble()
    },

    onGoLeave() {
      this.props.onGoLeave()
    },

    onTaskPopClose() {
      this.props.onTaskPopClose()
    },

    onGoShare() {
      this.props.onGoShare()
    },

    onGetAddress() {
      this.props.onGetAddress()
    },
    onAddressComplete() {
      this.props.onAddressComplete()
    },
 

    onAddressUpdate() {
      this.props.onAddressUpdate()
    },

    onShowTips() {
      this.setData({
        showTips:true,
        time:5000,
      })
    },

    onTimeOut() {
      this.setData({
        showTips:false,
      })
    },
    onTipsClose() {
      this.setData({
        showTips:false,
      })
    },
    onGoToShare() {
      this.props.onGoToShare()
    },

    onGetGift() {
      this.props.onGetGift()
    },

    onGoRiding() {
      this.props.onGoRiding()
    },

    onPopReceive(event){
      console.log("pop obj:",event.currentTarget.dataset.obj)
      this.props.onPopReceive(event.currentTarget.dataset.obj)
    },
    
    
  }
});