/**
 * 以Promise形式改造代码
 */

 /**
  * 获取用户当前设置
  */
 export const getSetting = () => {
    return new Promise((resolve,reject)=>{
        wx.getSetting({
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
                console.log(err)
            },
        });     
    })
 }

  /**
  * 修改用户当前设置
  */
 export const openSetting = () => {
    return new Promise((resolve,reject)=>{
        wx.openSetting({
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
            },
        });     
    })
 }

  /**
  * 获取用户收货地址
  */
 export const chooseAddress = () => {
    return new Promise((resolve,reject)=>{
        wx.chooseAddress({
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
            },
        });     
    })
 }

 /**
  * 提示框信息
  * {object} data
  */
 export const Message = (data) => {
    return new Promise(( resolve , reject ) =>{
        wx.showToast( {
            title: data.title,
            success: (result) => {
              resolve(result)
            },
            fail: (err) => {
                reject(err)
            },
          });
    })
 }