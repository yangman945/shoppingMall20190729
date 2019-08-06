import { promise } from "../../request/promise.js";
import regeneratorRuntime from "../../lib/runtime/runtime.js";
import { Message } from "../../utils/wx-async.js"
Page({
  data: {
    // 搜索商品
    goodsList: [],
    // 取消键隐藏状态
    isshow:true,
       // 搜索关键字
    searchKey:''
  },
  // 定义全局参数
 
    // 商品的页码数
  pagenum:1,
    // 每页显示的条数
  pagesize:20,
    // 商品总条数
  goodsTotal:0,
  timerOut:1,
  // 输入框搜索
  handleSearchInput(e) {
    // 当输入框为空时 也触发清除事件
    // console.log(Boolean(this.data.searchKey))
    // if(this.data.searchKey === ''){
    //   this.handleColor()
    //   console.log(this.data.searchKey)
    // }
    // 1获取输入框内容 进行去空校验后
    const { value } = e.detail;
    if (!value.trim()) {
      return;
    }
    this.setData({isshow:false,searchKey : value})
    // 2调用根据关键字获取商品函数
    clearTimeout(this.timerOut)
    this.timerOut = setTimeout(() => {
      this.getGoods({query: this.data.searchKey , pagenum:this.pagenum})
    }, 1000);
    
  },
  // 根据关键字获取商品
  getGoods(data) {
    // 3将获取商品需要的参数我封装在一个对象中
    promise({ url: "/goods/search", data}).then(res => {
      // 将原有的商品数据加上新增的数据 组成长列表
      this.setData({
        goodsList: [...this.data.goodsList,...res.data.message.goods]
      });
      this.goodsTotal = res.data.message.total
    });
  },
  // 触底加载下一页数据事件
  onReachBottom(){
    // 每次触发事件商品的页码数+1
    this.pagenum ++
    // console.log(this.pagenum)
    // console.log(this.goodsTotal)
    // console.log(this.data.searchKey)
    //  商品总条数/每页显示的条数 = 商品的最大页码数  
    // 当this.pagenum到达商品的最大页码数时为最后一页 显示提示
    if(this.pagenum === Math.ceil(this.goodsTotal/this.pagesize)){
      Message({title:'已经没有更多数据'})
    }else{
      this.getGoods({query:this.data.searchKey,pagenum:this.pagenum})
    }
  },
  // 点击取消 清理数据事件
  handleColor(){
    this.setData({
      isshow:true,
      searchKey:'',
      goodsList:[]
    })
  }
});
