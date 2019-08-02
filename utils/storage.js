// 封装本地存储的代码

/**
 * @param {object} obj 要设置进本地存储的购物车数据
 * 
 * 添加商品到购物车
 */
export const addCart = (obj) =>{
    wx.setStorageSync("cart", obj);
}

/**
 * 
 * 获取商品分类
 */
export const getstorageCategory = () =>{
    return wx.getStorageSync("cacheList");
}

/**
 * @param {object} obj 要设置进商品分类的信息
 * 设置商品分类
 */

export const setstorageCategory = (obj) =>{
    wx.setStorageSync("cacheList",obj);
}
