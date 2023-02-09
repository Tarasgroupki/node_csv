const express = require('express');

const router = express.Router();
const Order = require('../../models/order');
const loader = require('../middleware/file-upload');
const auth = require('../middleware/check-auth');
const readCsv = require('../../lib/readCSV');
const dateReason = require('../../lib/dateReason');

// - method for getting all orders with pagination and all filters
router.get('/', auth.main(), async (req, res) => {
    try {
        const { page, perPage, sortBy, asc } = req.query;
        const orders = await Order.aggregate([
            {
                $match : { "order_date": { $gte: dateReason(60), $lt: new Date()} }
            },
            {
                $group: {
                    _id: "$product_name",
                    totalSaleAmount: {$sum: {$multiply: ["$product_price", "$quantity"]}},
                    averageQuantity: {$avg: "$quantity"},
                }
            },
            {$sort: { [sortBy]: +asc }},
            {$skip: +page * +perPage },
            {$limit: +perPage }
        ]);
        return res.status(200).json(orders);
    } catch (err) {
        throw err;
    }
});

// - method for getting order by id
router.get('/:orderId', auth.main(), async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId);
        return res.status(200).json(order);
    } catch (err) {
        throw err;
    }
});

// - method for getting orders by product name
router.get('/:product_name/byProductName', auth.main(), async (req, res) => {
    try {
        const { product_name } = req.params;
        const order = await Order.find({ product_name });
        return res.status(200).json(order);
    } catch (err) {
        throw err;
    }
});

// - method for getting orders by customer id
router.get('/:customer_id/byCustomer', auth.main(), async (req, res) => {
    try {
        const { customer_id } = req.params;
        const order = await Order.find({ customer_id });
        return res.status(200).json(order);
    } catch (err) {
       throw err;
    }
});

// - method for uploading data from csv file to orders database
router.post('/', loader.file('csv_file_url', 'uploads', /image\.*/i, false), auth.main(), async (req, res) => {
    try {
        const result = [];
        const csv = await readCsv(req.fileUrl);
        csv.forEach((c) => {
            result.push(
                {
                    customer_id: c[0],
                    product_name: c[1],
                    name: c[2],
                    email: c[3],
                    address: c[4],
                    product_price: c[5],
                    order_date: c[6],
                    quantity: c[7]
                });
        });

        await Order.insertMany(result);

        return res.status(200).json({
            message: 'ok',
        });
    } catch (err) {
        throw err;
    }
});

module.exports = router;
