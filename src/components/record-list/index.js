Component({
  mixins: [],
  data: {
  
  },
  props: {
    recordList:[],
  },
  didMount() {
 
  },
  didUpdate() { },
  didUnmount() { },
  methods: {
    handleClose(){
      this.props.onHandleClose()
    },
    handleAddress(event){
      const obj = event.currentTarget.dataset.obj
      this.props.onAddress(obj)
    },
  },
});
