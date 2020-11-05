

Component(connect({
   mapStateToProps: ['awardPrizes',"showClose","resultBgImage"]
})({
  mixins: [],
  data: { 
     showClose: true,
  },
  props: {       
    buttonText1:"继续玩",
    buttonText2:"收下奖励",   
    },
  didMount() {

      
  },
  didUpdate() {},
  didUnmount() {},

  methods: {
   onAppear(e){console.log("onAppear",e)},
   //awardPrizes.openButton
    onButtonClick(e) {
       console.log('onModalClick',e)
       let {awardPrizes} = this.data
       if(awardPrizes  && awardPrizes.openButton) {
         setTimeout(() => {
              awardPrizes.openButton()
         }, 0);      
       }
       let onModalClick = this.props.onModalClick;
       if (onModalClick) {
          onModalClick(e);
       }
    },
   onModalClick(e) {
       console.log('onModalClick',e)
       let onModalClick = this.props.onModalClick;

      if (onModalClick) {
        onModalClick(e);
      }
   
    
    },
   onModalClose(e) {
      console.log('onModalClose',e)     
      let onModalClose = this.props.onModalClose;
      if (onModalClose) {
        onModalClose(e);
      }else {
       
      }
    }
   
  },
}));
