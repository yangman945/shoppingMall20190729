import { getSetting, openSetting, chooseAddress ,Message} from "../../utils/wx-async";
import regeneratorRuntime from "../../lib/runtime/runtime";
// 1、计算购物车内容的信息
// 1.1在函数里面计算购物车商品的信息
// 1.2在页面打开的时候调用这个函数，并将本地购物车的对象传递给函数进行计算
// 1.3在data里面定义将渲染在页面上的商品信息
// 2修改商品复选框事件
// 2.1获取该唯一商品信息
// 2.2注册change事件，获取该商品的checked状态 取反
// 2.3将商品修改后的转台重新调用计算函数进行计算
//3.修改商品数量
// 3.1 修改商品的数量我们直接我增或减绑定一个 +1 -1的自定义属性
// 3.2绑定自定义属性的好处是执行同一个事件，但进行计算的自定义属性值却不同
// 3.3当商品的数量为1时，还触发-1的操作时，我们要询问用户是否进行删除操作
// 3.4计算完后记得要把修改后的商品数量进行计算
// 4 全选框事件
// 4.1 给全选框绑定一个默认值 每次触发取反
// 4.2 当我们对全选框进行操作时 复选框的状态应该跟随着改变
// 5 商品结算逻辑
// 5.1商品结算前要判断有没有收获地址 且有没有选中购买的商品，才能进行结算
Page({
  data: {
    // 地址信息
    address: {},
    // 购物车信息
    cartList: {},
    // 商品总价
    cartTotalPrice: 0,
    // 商品总数
    cartTotalNum: 0,
    // 全选框默认值
    allchecked: false,
    // 提醒页面的显示状态
    isShow: false
  },
  async handlechooseAddress() {
    try {
      const res1 = await getSetting();
      const msg = res1.authSetting["scope.address"];
      // 当用户未授权收货地址信息时，打开设置
      if (msg === false) {
        await openSetting();
      }
      const res2 = await chooseAddress();
      console.log(res2),
        // 将需要显示的地址信息拼接出来
        (res2.all =
          res2.provinceName +
          res2.cityName +
          res2.countyName +
          res2.detailInfo);
      wx.setStorageSync("address", res2);
    } catch (err) {}
  },
  // 在页面打开的时候将地址展示
  onShow() {
    // 获取存储在本地购物车的信息
    const cart = wx.getStorageSync("cart") || {};
    // const cartList = this.data
    this.setData({
      // 本地获取收货信息
      address: wx.getStorageSync("address") || {},
      // 本地获取购物车信息
      cartList: cart
    });
    this.cartCount(cart);
  },
  // 进行商品计算的函数
  cartCount(cart) {
    // 总价格
    let price = 0;
    // 总数量
    let num = 0;
    // 将对象转换属性值为数组方便操作
    let cartArr = Object.values(cart);
    // 如果v.checked的everyone都为true返回true 否则返回false
    let allchecked = cartArr.every(v => v.checked);
    cartArr.forEach(v => {
      // 只有勾选上的商品才可以计算
      if (v.checked) {
        price += v.goods_price * v.num;
        num += v.num;
      }
    });
    // 判断购物车中有没有商品 没有的话全选√去掉 否则等同状态
    allchecked = cartArr.length === 0 ? false : allchecked;
    // 当购物车里没有商品时 我们在页面显示提醒
    let isShow = cartArr.length === 0 ? true : false;
    this.setData({
      cartTotalPrice: price,
      cartTotalNum: num,
      cartList: cart,
      allchecked,
      isShow
    });
    wx.setStorageSync("cart", cart);
  },
  // 修改商品复选框状态
  handleChangeisActive(e) {
    let { goodsid } = e.currentTarget.dataset;
    let { cartList } = this.data;
    // 我们在构造购物车对象的时候使用商品的goods_id作为值，所以现在用它来找到他所对应的属性值对象
    cartList[goodsid].checked = !cartList[goodsid].checked;
    // 重新计算修改后的商品信息
    this.cartCount(cartList);
  },
  // 修改全选框状态
  handleChangeAll() {
    let { allchecked, cartList } = this.data;
    allchecked = !allchecked;
    this.setData({
      allchecked
    });
    // 当我们对全选框进行操作时 复选框的状态会跟全选框一致
    for (const key in cartList) {
      if (cartList.hasOwnProperty(key)) {
        cartList[key].checked = allchecked;
      }
    }
    this.cartCount(cartList);
  },
  // 修改购物车商品的的增减删
  handleChangeGoodsNum(e) {
    let { addandsub, goodsid } = e.currentTarget.dataset;
    let { cartList } = this.data;
    // 定义微信模态框的this
    let _this = this;
    // 当商品数量为1，并且点击-号时，询问用户是否要删除该商品
    if (addandsub === -1 && cartList[goodsid].num === 1) {
      wx.showModal({
        title: "提示",
        content: "是否删除该商品",
        success(res) {
          if (res.confirm) {
            // 删除购物车对象的属性值
            delete cartList[goodsid];
            _this.cartCount(cartList);
          }
        }
      });
    } else {
      cartList[goodsid].num += addandsub;
      this.cartCount(cartList);
    }
  },
  // 商品结算逻辑
  handlePay() {
    // 判断有没有收货地址 和 结算的商品 空对象返回true，所有不能直接拿address判断
    let { address, cartTotalNum } = this.data;
    if (!address.all) {
      Message({title:'请添加收货地址'})
    } else if (!cartTotalNum) {
      Message({title:'请加入商品购买'})
    } else {
      // 进入结算页面
      wx.navigateTo({
        url: "/pages/pay/index"
      });
    }
  }
});
