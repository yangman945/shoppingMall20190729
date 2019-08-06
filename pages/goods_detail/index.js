import {promise} from "../../request/promise.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
import { addCart } from "../../utils/storage";
import { Message } from "../../utils/wx-async.js";

Page({
  data: {
    goodsDetailList:[],
    // 收藏激活颜色 默认没有收藏
    isCollect:false
  },
  // 图片预览
  handleImagePreview(e){
    const {index} = e.currentTarget.dataset
    // console.log(index)
    wx.previewImage({
      current: [index], // 当前显示图片的http链接
      urls: this.data.goodsDetailList.pics.map(v=>v.pics_big),// 需要预览的图片http链接列表
    })
  },
  // 商品详情
  goodsData:{},
  onLoad(e){
    this.getCateDetail(e.goods_id)
  },
  // 获取商品详情内容
 async getCateDetail(goods_id){
    const { data } = await promise({url:'/goods/detail',data:{goods_id}})
    // console.log(data.message)
    this.goodsData = data.message
    // 返回的数据太多 我们只提取我们需要在页面渲染使用的
    const goodsDetailList = {
      goods_name:data.message.goods_name,
      goods_price:data.message.goods_price,
      pics:data.message.pics,
      goods_introduce:data.message.goods_introduce
    }
    // 判断当前商品是否收藏 
    let collectGoods = wx.getStorageSync("collectGoods")||[];
    let isCollect = collectGoods.some(v=>v.goods_id === data.message.goods_id)
    this.setData({
      goodsDetailList,
      isCollect
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
      cart[this.goodsData.goods_id].checked = true    
    }
    // 添加商品到购物车的方法
    addCart(cart)
    wx.showToast({
      title: '添加成功',
      icon: 'success',
      mask: true,
    });
      

  },
  // 商品添加逻辑
handleCollectGoods(){
    // 1、我们将收藏的商品对象以数组的形式缓存在本地
    // 2、获取本地收藏的数组，但可能为空字符串，所以给默认值
    // 3、对本地数组进行判断 如果在收藏数组中就将其删除，没有加添加 
    let collectGoods = wx.getStorageSync("collectGoods")||[];
    // 返回符合测试条件的元素的索引，不存在则返回-1
    // console.log(this.goodsData.goods_id)
    // console.log(collectGoods)
    let index = collectGoods.findIndex(v=>
      v.goods_id === this.goodsData.goods_id,
    )
    // console.log(index)
    if(index === -1){
      // 在收藏数组中没有这个对象，将其收藏
      collectGoods.push(this.goodsData)
      this.setData({isCollect:true})
      Message({title:'收藏成功'})
    }else{
      // 存在这个商品对象，将其取消收藏
      collectGoods.splice(index,1)
      this.setData({isCollect:false})
      Message({title:'取消收藏'})
    }
    wx.setStorageSync('collectGoods', collectGoods);    
  }
})