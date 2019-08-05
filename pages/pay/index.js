// pages/pay/index.js
Page({
  data:{
    // 地址信息
    address:{},
    totalPrice:0,
    totalNum:0,
    cart:{}
  },
  onLoad(){
    // 本地获取渲染于页面的信息
    // 获取地址
    let address = wx.getStorageSync("address") || {};
    // 获取购物车
    let cart = wx.getStorageSync("cart") || {};
    // 遍历对象 将checked为false的属性删除
    for (const key in cart) {
        if(!(cart[key].checked)){
          delete cart[key]
        }  
    }
    let cartArr = Object.values(cart)
    // 总价格
    let totalPrice = 0
    // 总数量
    let totalNum = 0
    // 将没有勾选的商品从购物车中过滤掉
    cartArr.filter(v=>{
       if(v.checked){
        totalNum += v.num;
        totalPrice += v.goods_price * v.num;
      }
    })
    this.setData({
      address,
      totalPrice,
      totalNum,
      cart
    })
  },
  handleOrderPay(){
    // 对token进行获取判断 如果没有token进入授权页面获取
    let token = wx.getStorageSync("token");
    // console.log(token)
    if(!token){
      // 没有token去授权页面获取
      wx.navigateTo({
        url: '/pages/auth/index',
      });
        
    }else{
      // 有的话执行下一步
      console.log('执行订单')
    }
      
  }
})