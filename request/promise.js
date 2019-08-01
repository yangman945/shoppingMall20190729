// 定义一个全局变量 每次要发送请求前都会触发
let ajaxnum = 0;
export const promise=(params)=>{   
    ajaxnum++;
    // 请求前显示正在加载的图标
    wx.showLoading({title: "加载中" });
    return new Promise((resolve,reject)=>{       
        wx.request({
            // 我们在函数的时候会以对象的形似传递数据
            ...params,
            url: 'https://api.zbztb.cn/api/public/v1'+params.url,
            success: (result) => {
                // .then()的时候就就是成功的回调
                resolve(result)
            },
            fail: (err) => {
                //.catch
                reject(err)
            },
            complete:()=>{
                // 每次请求回来-- 当为0是说明最后一个请求也回来了
                ajaxnum--
                // 请求发送后关闭加载图标
                if(ajaxnum === 0){
                    wx.hideLoading()
                };   
            }
        });     
    })
}

