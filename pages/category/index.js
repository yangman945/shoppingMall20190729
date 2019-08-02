import {promise} from "../../request/promise.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
import { getstorageCategory,setstorageCategory } from '../../utils/storage'
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
    // 2在发送请求之前先判断有没有缓存数据，没有再发送，本地存储的默认值为空字符串
    // const cacheList = addCart()
    // 调用封装的方法
    const cacheList = getstorageCategory()
    // 3如果本地存储有数据就使用缓存，否则就是空字符串，就要发送请求
    if(cacheList){
    // 4在使用之前我们要判断本地缓存的数据有没有过期，过期的话还是要请求新数据
      if(Date.now() - cacheList.time > 1000 * 10){
        this.getCategory()
      }else{
        this.ovrelist = cacheList.data
        const left_menuList = this.ovrelist.map(v=>(
          // 左侧
          {cat_id:v.cat_id,cat_name:v.cat_name} 
        ))
          // 右侧
        const right_menuList = this.ovrelist[0].children
          this.setData({
            left_menuList,
            right_menuList
          })
      }
    }else{
      this.getCategory() 
    }
        
  },
  // 获取商品分类数据
 async getCategory(){
     const {data} = await promise({url:'/categories'})
    //  调用封装的方法
     setstorageCategory({time:Date.now(),data:data.message})
       this.ovrelist =data.message
       const left_menuList = this.ovrelist.map(v=>(
         {cat_id:v.cat_id,cat_name:v.cat_name} 
       ))
       const right_menuList = this.ovrelist[0].children
         this.setData({
           left_menuList,
           right_menuList
         })

    // .then(result=>{
    //   // console.log(result)
    //   // 1在接收到数据后，我们就数据缓存起来，存储在本地,存储当前时间是为了给缓存设置有效期
    //   wx.setStorageSync("cacheList", {time:Date.now(),data:result.data.message});
    //   //  全局变量接收接口的数据 
    //   this.ovrelist = result.data.message
    //   // 获取数据后我们分别将左侧右侧需要渲染的数据剥离开来
    //   const left_menuList = this.ovrelist.map(v=>(
    //     // 左侧
    //     {cat_id:v.cat_id,cat_name:v.cat_name} 
    //   ))
    //     // 右侧
    //   const right_menuList = this.ovrelist[0].children
    //     this.setData({
    //       left_menuList,
    //       right_menuList
    //     })
    // })
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