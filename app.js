 //app.js
App({
  cart: wx.getStorageSync('manZhanPiao') || [],
  addToCart(item) {
    const isInCart = this.cart.some(cartItem => cartItem.id === item.id);
    if (isInCart) {
      this.cart = this.cart.map(ci => {
        if (ci.id === item.id) {
          ci.piaoCount += item.piaoCount;
        }
        return ci;
      })
    } else {
      this.cart.push(item);
    }
    wx.setStorageSync('manZhanPiao', this.cart)
  }
})