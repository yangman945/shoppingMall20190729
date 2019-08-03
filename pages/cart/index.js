import { getSetting, openSetting, chooseAddress } from "../../utils/wx-async";
import regeneratorRuntime from "../../lib/runtime/runtime";
Page({
  data: {
    address: {}
  },

  async handlechooseAddress() {
   try{
    const res1 = await getSetting()
    const msg = res1.authSetting["scope.address"];
    console.log(msg)
    
    if(msg === false){
      await openSetting()
    }
    const res2 = await chooseAddress()
    console.log(res2),
      // 将需要显示的地址信息拼接出来
    res2.all = res2.provinceName + res2.cityName + res2.countyName + res2.detailInfo
    wx.setStorageSync("address", res2);
   } catch(err){}
  },
  // 在页面打开的时候将地址展示
  onShow() {
    this.setData({
      address: wx.getStorageSync("address") || {}
    });
  }
});
