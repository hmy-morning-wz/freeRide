
let interval
Component(connect({ mapStateToProps: ['ruleText'] })({
  mixins: [],
  data: {
    recordShow: false,
    isOpen: false,
    isFirstClick: true,
    isfirstEnter: true,
  },
  props: {
    recordList: [],
    redBag: {}
  },
  didMount() {
    // interval = setInterval(() => {
    //   if (this.data.isfirstEnter)
    //     this.setData({
    //       isFirstClick: !this.data.isFirstClick,
    //     })
    // }, 500);
  },
  didUpdate() { },
  didUnmount() { },
  methods: {
    async handleRecord() {
      await this.props.onPreheatRedBagList();
      this.setData({
        recordShow: true,
      })
    },
    address(obj) {
      this.props.onGetAddress(obj)
    },
    handleRule() {
      this.props.onShowRule();
    },
    hanldeGiveup() {
      this.props.onGiveupDouble();
    },
    onGetAddress(obj) {
      this.props.onGetAddress(obj)
    },
    onHandleJump(obj){
       this.props.onHandleJump && this.props.onHandleJump(obj)
    },
    handleClose() {
      this.setData({
        recordShow: false,
      })
      this.props.onCloseRecordList()
    },
    handleReceive() {
      this.props.onDrawTap();
      this.setData({
        isFirstClick: false,
        isfirstEnter: false
      })
    },
    handleShop(event) {
      this.props.onBallTap(event.currentTarget.dataset.obj)
    },
    handleTravel(event) {
      this.props.onTopTaskTap(event.currentTarget.dataset.obj)
    },

    handleShare() {      
       this.props.onGoShare && this.props.onGoShare()     
    },
    //跳转到卡包
    handlePrize() {
      if (this.props.myPrizeType == 'h5') {
        //
        my.navigateTo({
          url: `../../pages/webview/webview?url=https://www.tmall.com/wow/coupon/act/tbcouponhome`
        })
      } else {
        my.openVoucherList()
      }
    },
  },
}));
