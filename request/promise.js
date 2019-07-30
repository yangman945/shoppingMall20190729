export const promise=(params)=>{
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
        });     
    })
}

