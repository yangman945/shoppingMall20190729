import { promise } from "../../request/promise"
Page({
  data: {

  },
  handleUserInfo(e){
    // console.log(e.detail)
    // 获取生成token值的用户信息
    const {encryptedData,rawData,iv,signature } = e.detail;
    let code = '';
    wx.login({
      success: (result) => {
        code = result.code
        const data = {encryptedData,rawData,iv,signature,code:code}
        promise({url:'/users/wxlogin',method:'post',data:data}).then(res=>{
          const {token} = res.data.message
          // 将获取到的token存入本地
          wx.setStorageSync("token", token);
          // 返回上一个页面
          wx.navigateBack({
            delta: 1
          });
        })
      },
    });
  }
})