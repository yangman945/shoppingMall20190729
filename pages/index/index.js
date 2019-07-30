import {promise} from "../../request/promise.js"
Page({
  data: {
    // 轮播图
    swiperList:[],
    // 导航栏
    navList:[],
    // 商品楼层数据
    floorList:[]
  },
  // 页面加载时触发
  onLoad(){
    this.getSwaper()
    this.getNav()
    this.getGoodsFloor()
  },
  // 获取轮播图
  getSwaper(){
    promise({
      url:'/home/swiperdata'
    }).then(result=>{
      this.setData({
        swiperList:result.data.message
      })
    })         
  },
  // 获取导航栏
  getNav(){
    promise({
      url:'/home/catitems'
    }).then(result=>{
      this.setData({
        navList:result.data.message
      })
    })
  },
  // 获取商品楼层
  getGoodsFloor(){
    promise({
      url:'/home/floordata'
    }).then(result=>{
      this.setData({
        floorList:result.data.message
      })
    })
  }
  
    
})