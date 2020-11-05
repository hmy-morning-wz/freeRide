import common from '/utils/common';
Component({
  mixins: [],
  data: {
    statusBarHeight:24,
    titleBarHeight:48
  },
  props: {},
  async  didMount() { 
    let {statusBarHeight,titleBarHeight,pixelRatio}  = await common.getSystemInfoSync()
    this.setData({statusBarHeight:statusBarHeight*pixelRatio,titleBarHeight:titleBarHeight*pixelRatio})
  },
  didUpdate() { },
  didUnmount() { },
  methods: {
    async onDraw(e) {
      if (this.onTaped) {
        return
      }
      this.onTaped = true
      await this.props.onDraw && this.props.onDraw(e)
      this.onTaped = false
    },
    onBanner(e) {
      this.props.onBanner && this.props.onBanner(e)
    },
    onRule(e){
        this.props.onRule && this.props.onRule(e)
    }
  },
});
