// pages/index/index.js
Page({
  data: {
    // 轮播图
    swiperList:[]
  },
  // 页面加载时触发
  onLoad(){
    this.getSwaper()
  },
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
      
  }
})