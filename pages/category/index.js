import {promise} from "../../request/promise.js"
Page({
  data: {
    current:0,
    // 商品分类左侧菜单
    left_menuList:[],
    // 商品分类右侧菜单
    right_menuList:[],
    // 右侧滚动条激活时的距离
    scrolltop:0
  },
  // 新增一个全局变量，用来接收请求的数据
  ovrelist : [],
  onLoad(){
    this.getCategory()
  },
  // 获取商品分类数据
  getCategory(){
    promise({url:'/categories'}).then(result=>{
      // console.log(result)
      this.ovrelist = result.data.message
      // 获取数据后我们分别将左侧右侧需要渲染的数据剥离开来
      const left_menuList = this.ovrelist.map(v=>(
        // 左侧
        {cat_id:v.cat_id,cat_name:v.cat_name} 
      ))
        // 右侧
      const right_menuList = this.ovrelist[0].children
      // this.list = result.data.message[0].children
        this.setData({
          left_menuList,
          right_menuList
        })
    })
  },
  handleChange(e){
    const { index } = e.target.dataset
    const right_menuList = this.ovrelist[index].children
    this.setData({
      current:index,
      right_menuList,
      // 小优化，点击左侧菜单栏是右侧滚动回顶部
      scrolltop:0
     })
  }
})