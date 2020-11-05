
import parse from 'mini-html-parser2';
Component({
  mixins: [],
  data: {},
  props: {
    showClose: true,
    hiddenButton:false,
    closeType: '0'
  },
  didMount() {
    let rule = this.props.ruleText
    var pattern = /<\/?[a-zA-Z]+(\s+[a-zA-Z]+=".*")*>/g;
    if (pattern.test(rule)) {
      parse(rule, (err, nodes) => {
        if (!err) {
          this.setData({ ruleText1: nodes })
        }
      })
    } else {
      this.setData({
        ruleText1: [{
          name: 'div',
          attrs: {
            class: 'text-item',
            style: 'color: #7696bb;',
          },
          children: [{
            type: 'text',
            text: rule,
          }],
        }]
      })
    }

      
  },
  didUpdate() {},
  didUnmount() {},
  methods: {
     onModalClose(e) {
      console.log('onModalClose',e)     
      let onModalClose = this.props.onModalClose;
      if (onModalClose) {
        onModalClose(e);
      }else {
       
      }
    },
  },
})
