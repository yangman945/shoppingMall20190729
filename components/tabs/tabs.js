// components/tabs/tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabsList:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleChange(e){
      // console.log(e)
      const {index} = e.currentTarget.dataset
      // 将点击的索引通过 this.triggerEvent("父组件绑定在标签上的自定义事件",数据);
      this.triggerEvent('getIndex',{index})
    }
  }
})
