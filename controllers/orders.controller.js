const stripe = require('stripe')('sk_test_51M1PcQEV5EzKRupHG2boMuHIJWMFHc4uSplVFExqfLfmmGQDSm3rmZ42wwhLIOw3EkUwh7fg1n1aMEwcaoNKHkkx006IFhY0Oi');

const Order = require('../models/order.model');
const User = require('../models/user.model');

async function getOrders(req, res) {
  try {
    const orders = await Order.findAllForUser(res.locals.uid);
    res.render('customer/orders/all-orders', {
      orders: orders,
    });
  } catch (error) {
    next(error);
  }
}

async function addOrder(req, res, next) {
  const cart = res.locals.cart;

  let userDocument;
  try {
    userDocument = await User.findById(res.locals.uid);
  } catch (error) {
    return next(error);
  }

  const order = new Order(cart, userDocument);

  try {
    await order.save();
  } catch (error) {
    next(error);
    return;
  }

  req.session.cart = null;


  const session = await stripe.checkout.sessions.create({
    line_items: cart.items.map(function(item) {
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.title
          },
          unit_amount: +item.product.price.toFixed(2) * 100
        },
        quantity: item.quantity,
      }
    }),
    mode: 'payment',
    success_url: `http://localhost:3000/orders`,
    cancel_url: `http://localhost:3000/`,
  });

  res.redirect(303, session.url);
}

module.exports = {
  addOrder: addOrder,
  getOrders: getOrders,
};
