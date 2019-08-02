// pages/cart/index.js
Page({
  data: {},
  handlechooseAddress() {
    wx.getSetting({
      // 当用户 没有点击授权信息undefined 或是 点击同意后true，调取收货地址的api
      // 当用户点击取消后 下次再点击 我们需要弹出设置界面 让用户同意授权
      success: result1 => {
        const msg = result1.authSetting["scope.address"];

        if (msg === true || msg === undefined) {
          wx.chooseAddress({
            success: result2 => {
              console.log(result2);
            }
          });
        }else{
          wx.openSetting({
            success: (result3) => {
              wx.chooseAddress({
                success: result4 => {
                  console.log(result4);
                }
              })
            },
          });  
        }
      }
    });
  }
});
