import { promise } from "../../request/promise.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    tabs: [
      { name: "综合", isActive: true, id: 0 },
      { name: "销量", isActive: false, id: 1 },
      { name: "价格", isActive: false, id: 2 }
    ],
    // 商品列表
    goodsList: []
  },
  // 定义一个全局变量 用来存放接口需要的参数
  paramsList: {
    // 搜索关键字
    query: "",
    // 接口id
    cid: "",
    // 页码
    pagenum: 1,
    // 页容量
    pagesize: 10
  },
  // 总页数(total/pagesize)
  totalPages: 1,
  onLoad(options) {
    // 点击商品分类传递的参数
    this.paramsList.cid = options.cid;
    this.getgoodsList();
  },
  handlegetIndex(e) {
    // console.log(e)
    const { index } = e.detail;
    const { tabs } = this.data;
    tabs.forEach((v, i) =>
      index === i ? (v.isActive = true) : (v.isActive = false)
    );
    this.setData({
      tabs
    });
  },
  async getgoodsList() {
     const { data } = await promise({ url: "/goods/search", data: this.paramsList })
    //  console.log(data)
      this.totalPages = Math.ceil(
        data.message.total / this.paramsList.pagesize
      );
      this.setData({
        goodsList: [...data.message.goods, ...this.data.goodsList]
      });
      wx.stopPullDownRefresh();

    // .then(result => {
    //   console.log(result);
    //   // 计算返回来的数据可以分成几页
    //   this.totalPages = Math.ceil(
    //     result.data.message.total / this.paramsList.pagesize
    //   );
    //   this.setData({
    //     // goodsList:result.data.message.goods
    //     // 每次加载下一页，新一页的内容不应该将旧一页的内容覆盖，而是一起显示
    //     goodsList: [...result.data.message.goods, ...this.data.goodsList]
    //   });
    //   // 数据请求回来手动关闭刷新
    //   wx.stopPullDownRefresh();
    // });
  },
  // 上拉触底事件 加载下一页
  // 但在下拉时应该判断现在是否是最后一页
  onReachBottom() {
    if (this.paramsList.pagenum >= this.totalPages) {
      wx.showToast({
        title: "没有更多数据了",
        icon: "none"
      });
    } else {
      this.paramsList.pagenum++;
      this.getgoodsList();
      // console.log(this.paramsList.pagenum, this.totalPages);
    }
  },
  // 下拉刷新页面 重置页面 => 重置goodsList的数据 => 重新发送请求 =>数据回来的时候关闭刷新
  onPullDownRefresh() {
    this.paramsList.pagenum = 1
    this.setData({
      goodsList:[]
    })
    this.getgoodsList()
  }
});
