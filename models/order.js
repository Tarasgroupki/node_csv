const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    customer_id: String,
    name: String,
    email: String,
    address: String,
    product_name: String,
    product_price: Number,
    order_date: Date,
    quantity: Number
});

module.exports = mongoose.model('Order', orderSchema);
