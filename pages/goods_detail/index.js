import {promise} from "../../request/promise.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
import { addCart } from "../../utils/storage";

Page({
  data: {
    goodsDetailList:[]
  },
  goodsData:{},
  onLoad(e){
    console.log(e.goods_id)
    this.getCateDetail(e.goods_id)
  },
  // 获取商品详情内容
 async getCateDetail(goods_id){
    const { data } = await promise({url:'/goods/detail',data:{goods_id}})

    console.log(data.message)
    this.goodsData = data.message
    // 返回的数据太多 我们只提取我们需要在页面渲染使用的
    const goodsDetailList = {
      goods_name:data.message.goods_name,
      goods_price:data.message.goods_price,
      goods_introduce:data.message.goods_introduce,
      pics:data.message.pics
    }
    this.setData({
      goodsDetailList
    })
  },
  // 添加购物车逻辑
  handleAddCart(){
    // 将购物车从本地获取出来 但可能没有就给个默认值
    const cart = wx.getStorageSync("cart") || {};
    // 判断购物车里有没有该商品
    if(cart[this.goodsData.goods_id]){
      // 有商品的处理逻辑
      // 已经存在商品了，继续添加只是添加数量
      cart[this.goodsData.goods_id].num++
    }else{
      // 没有商品时的处理逻辑 
      // 为购物车添加新属性 属性名是 商品的唯一值 ；属性值是 商品的信息
      cart[this.goodsData.goods_id] = this.goodsData
      // 在商品的信息里面添加新属性 商品数量
      cart[this.goodsData.goods_id].num = 1    
    }
    // 添加商品到购物车的方法
    addCart(cart)
    wx.showToast({
      title: '添加成功',
      icon: 'success',
      mask: true,
    });
      

  }
})