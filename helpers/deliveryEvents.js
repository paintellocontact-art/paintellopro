// helpers/deliveryEvents.js
const sendMetaCAPIEvent = require('../services/metaCapi'); // ✅ uses your existing Meta CAPI sender

// UUID v4 generator (same as in your routes)
function generateEventId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Send a "Purchase" event for a delivered COD order.
 * Works with both ProductOrder (new) and legacy Order models.
 *
 * @param {Object} order - The order document (must have paymentMethod, metaUserData, cart, totalWithShipping)
 */
async function sendPurchaseForDeliveredCOD(order) {
  // Only for COD orders with stored user data
  if (order.paymentMethod !== 'cod' || !order.metaUserData || Object.keys(order.metaUserData).length === 0) {
    console.log('⚠️ Skip Purchase – not a valid COD order or missing user data');
    return;
  }

  // ---- Extract cart items safely ----
  let itemsArray = [];
  if (order.cart && order.cart.items) {
    if (Array.isArray(order.cart.items)) {
      itemsArray = order.cart.items;
    } else if (typeof order.cart.items === 'object') {
      itemsArray = Object.values(order.cart.items);
    }
  }

  // ---- Build contents for Meta CAPI ----
  const contents = itemsArray.map(item => {
    // ProductOrder stores: { product, name, price, image, qty }
    // Legacy Order may have: { item: { _id, price }, qty }
    const id = (item.product || (item.item && item.item._id) || '').toString();
    const itemPrice = item.price || (item.item && item.item.price) || 0;
    const quantity = item.qty || 1;
    return { id, quantity, item_price: itemPrice };
  }).filter(c => c.id);   // remove entries without an ID

  const content_ids = contents.map(c => c.id);

  if (content_ids.length === 0) {
    console.log('⚠️ No valid product IDs – skipping Purchase event');
    return;
  }

  const eventId = generateEventId();
  const userData = order.metaUserData;

  try {
    await sendMetaCAPIEvent({
      eventName: 'Purchase',
      eventId,
      userData,
      customData: {
        value: order.totalWithShipping || (order.cart && order.cart.totalPrice) || 0,
        currency: 'DZD',
        content_type: 'product',
        content_ids,
        contents,
      },
      eventSourceUrl: `https://${process.env.DOMAIN || 'paintellopro.onrender.com'}/order/${order._id}`,
      testEventCode: process.env.FB_TEST_EVENT_CODE,
    });
    console.log(`✅ Purchase event sent for delivered COD order ${order._id}, eventID: ${eventId}`);
  } catch (err) {
    console.error(`❌ Failed to send Purchase for order ${order._id}:`, err);
  }
}

module.exports = { sendPurchaseForDeliveredCOD };
