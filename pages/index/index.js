// pages/index/index.js
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
   wx.request({
      url: 'https://api.zbztb.cn/api/public/v1/home/swiperdata',
      success: (result) => {
        // console.log(result)
        this.setData({
          swiperList:result.data.message
        })
      },
    });    
  },
  // 获取导航栏
  getNav(){
    wx.request({
      url: 'https://api.zbztb.cn/api/public/v1/home/catitems',
      success: (result) => {
        // console.log(result)
        this.setData({
          navList:result.data.message
        })
      },
    });  
  },
  // 获取商品楼层
  getGoodsFloor(){
    wx.request({
      url: 'https://api.zbztb.cn/api/public/v1/home/floordata',
      success: (result) => {
        console.log(result)
        this.setData({
          floorList:result.data.message
        })
      },
    });
  }
  
    
})