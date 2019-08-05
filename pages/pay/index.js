import { promise } from "../../request/promise.js";
import regeneratorRuntime from "../../lib/runtime/runtime.js";
import { reqPay,Message } from "../../utils/wx-async.js";
Page({
  data: {
    // 地址信息
    address: {},
    totalPrice: 0,
    totalNum: 0,
    cart: {}
  },
  onLoad() {
    // 本地获取渲染于页面的信息
    // 获取地址
    let address = wx.getStorageSync("address") || {};
    // 获取购物车
    let cart = wx.getStorageSync("cart") || {};
    // 遍历对象 将checked为false的属性删除
    for (const key in cart) {
      if (!cart[key].checked) {
        delete cart[key];
      }
    }
    let cartArr = Object.values(cart);
    // 总价格
    let totalPrice = 0;
    // 总数量
    let totalNum = 0;
    // 将没有勾选的商品从购物车中过滤掉
    cartArr.filter(v => {
      if (v.checked) {
        totalNum += v.num;
        totalPrice += v.goods_price * v.num;
      }
    });
    this.setData({
      address,
      totalPrice,
      totalNum,
      cart
    });
  },
  async handleOrderPay() {
    try {
      // 对token进行获取判断 如果没有token进入授权页面获取
      let token = wx.getStorageSync("token");
      let { cart } = this.data;
      // console.log(token)
      if (!token) {
        // 没有token去授权页面获取
        wx.navigateTo({
          url: "/pages/auth/index"
        });
      } else {
        // 有的话执行下一步
        // 1准备获取创建订单需要的参数
        let header = { Authorization: token };
        let order_price = this.data.totalPrice;
        let consignee_addr = this.data.address.all;
        let goods = [];
        for (const key in cart) {
          goods.push({
            goods_id: cart[key].goods_id,
            goods_number: cart[key].num,
            goods_price: cart[key].goods_price
          });
        }
        let paramsList = { order_price, consignee_addr, goods };
        // 2根据参数创建订单
        const res = await promise({
          url: "/my/orders/create",
          header: header,
          data: paramsList,
          method: "POST"
        });
        // console.log(res)
        const { order_number } = res.data.message;
        // 3获取支付参数的pay
        const res1 = await promise({
          url: "/my/orders/req_unifiedorder",
          header: header,
          data: { order_number },
          method: "POST"
        });
        // console.log(res1);
        const { pay } = res1.data.message;
        // console.log(pay);
        // 4调用微信支付 微信内置的api
        const res2 = await reqPay(pay);
        // console.log(res2)
        // 5查询订单
        const res3 = await promise({
          url:"/my/orders/chkOrder",
          header:header,
          data:{order_number},
          method:"POST"
        })
        // console.log(res3, 'res3')
        await Message({title:'支付成功'}) 
        // 支付成功后跳转到订单页面
        wx.navigateTo({
          url: '/pages/order/index'
        });
          
      }
    } catch (err) {
      await Message({title:'支付失败'})
    }
  }
});
