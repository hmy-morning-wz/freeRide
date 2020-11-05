Component({
  mixins: [],
  data: {
    show:true,
    opacity:0,
  },
  props: {
    opacity:0,
  },
  didMount() {
    console.log("opacity:",this.props.opacity);
    
    this.setData({
      opacity:this.props.opacity
    })
  },
  didUpdate() {},
  didUnmount() {},
  methods: {},
});
