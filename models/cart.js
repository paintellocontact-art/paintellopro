


module.exports = function Cart(oldCart){
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;
    this.shippingPrice =  function updateShipping() {
      const wilaya = document.getElementById('wilaya').value;
      const costDisplay = document.getElementById('shipping-cost');
      const shippingPrices = {
        'Algiers': 400,
        'Oran': 600,
        'Constantine': 700,
        'Blida': 500,
        'Annaba': 650
      };

      shippingPrice = shippingPrices[wilaya] || 0;

      if (shippingPrice > 0) {
        costDisplay.textContent = `Shipping Cost: ${shippingPrice} DA`;
      } else {
        costDisplay.textContent = '';
      }

      updateTotal();
    }
  
  
    this.add = function(item, id){
        var storedItem = this.items[id];
        if(!storedItem){
            storedItem = this.items[id] = {item: item, qty: 0, price: 0};
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.price;
    };

    this.reduceByOne = function (id) {
        this.items[id].qty--;
        this.items[id].price -= this.items[id].item.price;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.price;

        if(this.items[id].qty <= 0) {
            delete this.items[id];
        }
    };

    this.removeItem = function (id) {
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    };

    
    this.generateArray = function(){
        var arr = [];
        for(var id in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    };
  
  Cart.prototype.update = function(id, qty) {
  let storedItem = this.items[id];
  if (!storedItem) return;
  this.totalQty -= storedItem.qty;
  this.totalPrice -= storedItem.price;

  storedItem.qty = qty;
  storedItem.price = storedItem.item.price * qty;

  this.totalQty += qty;
  this.totalPrice += storedItem.price;
  this.items[id] = storedItem;
};
  this.increaseQty = function(id) {
  var storedItem = this.items[id];
  if (storedItem) {
    storedItem.qty++;
    storedItem.price = storedItem.item.price * storedItem.qty;
    this.totalQty++;
    this.totalPrice += storedItem.item.price;
  }
};

this.decreaseQty = function(id) {
  var storedItem = this.items[id];
  if (storedItem) {
    storedItem.qty--;
    storedItem.price = storedItem.item.price * storedItem.qty;
    this.totalQty--;
    this.totalPrice -= storedItem.item.price;

    if (storedItem.qty <= 0) {
      delete this.items[id];
    }
  }
};

};
