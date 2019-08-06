// pages/user/index.js
Page({
  data:{
    userinfo:{}
  },
  onLoad(){
    // 页面激活后判断有没有userInfo用户信息，没有的话跳到登录授权页面获取,有的话存储起来
    const userinfo = wx.getStorageSync('userinfo');
    if(!userinfo){
      wx.navigateTo({
        url: '/pages/login/index',
      });   
    }else{
      this.setData({
        userinfo
      })
    }
      
  }
})