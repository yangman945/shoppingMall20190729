import {promise} from "../../request/promise.js"
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
  data: {
    goodsDetailList:[]
  },
  onLoad(e){
    console.log(e.goods_id)
    this.getCateDetail(e.goods_id)
  },
  // 获取商品详情内容
 async getCateDetail(goods_id){
    const { data } = await promise({url:'/goods/detail',data:{goods_id}})
    // console.log(data.message)
    // 返回的数据太多 我们只提取我们需要使用的
    const goodsDetailList = {
      goods_name:data.message.goods_name,
      goods_price:data.message.goods_price,
      goods_introduce:data.message.goods_introduce,
      pics:data.message.pics
    }
    this.setData({
      goodsDetailList
    })
  }
})