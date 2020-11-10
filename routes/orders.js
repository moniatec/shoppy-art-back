const express = require("express");
const { check } = require("express-validator");
const { handleValidationErrors, asyncHandler } = require("../utils");
const { requireAuth } = require("../auth0");
const router = express.Router();
const db = require("../db/models");

const { Op } = require("sequelize");
const { Item, User, Order } = db;

const orderNotFoundError = (id) => {
    const err = Error("Order not found");
    err.errors = [`Order with id of ${id} could not be found.`];
    err.title = "Order not found.";
    err.status = 404;
    return err;
};

// get all orders 
router.get(
    "/",
    asyncHandler(async (req, res) => {
        const orders = await Order.findAll({
            include: [{ model: User, as: "user", attributes: ["username", "id"] }],
            order: [["createdAt", "DESC"]],
            attributes: ["total"],
        });
        res.json({ orders });
    })
);

//get all items for a specific order 
router.get(
    "/:id/items",
    asyncHandler(async (req, res, next) => {
        const orderId = parseInt(req.params.id, 10);
        const items = await Order.findOne({
            where: { id: orderId },
            include: [{
                model: Item,
                as: "items",
                order: [["time", "DESC"]],
            }],

        });
        res.json({ items });
    })
);

const orderNotFoundError = (id) => {
    const err = Error("order not found");
    err.errors = [`Order with id of ${id} could not be found.`];
    err.title = "Order not found.";
    err.status = 404;
    return err;
};

//get order with id passed on the params from the client side
router.get(
    "/:id",
    asyncHandler(async (req, res, next) => {
        const order = await Order.findOne({
            include: [{ model: User, as: "user", attributes: ["username", "id"] }],
            where: {
                id: req.params.id,
            },
        });
        if (order) {
            res.json({ order });
        } else {
            next(orderNotFoundError(req.params.id));
        }
    })
);

//create/set new order 
router.post(
    "/",
    asyncHandler(async (req, res) => {
        const { userId, itemId, total } = req.body;
        const parsedUserId = await parseInt(userId, 10);
        const parsedItemId = await parseInt(itemId, 10);
        const parsedTotal = await parseInt(total, 10);
        const order = await Order.create({ userId: parsedUserId, total: parsedTotal });

        const item = await Item.findOne({
            where: {
                id: parsedItemId,
            },
        });
        await item.update({ sold: true, orderId: order.id });

        res.json({ order });
    })
);

//edit order(add item) 
router.put(
    "/:id",

    asyncHandler(async (req, res, next) => {
        const { itemId, newTotal } = req.body;
        const parsedItemId = await parseInt(itemId, 10);
        const parsedTotal = await parseInt(newTotal, 10);
        const order = await Order.findOne({
            where: {
                id: req.params.id,
            },
        });

        if (order) {
            const item = await Item.findOne({
                where: {
                    id: parsedItemId,
                },
            });
            if (item.sold === true) {
                await item.update({ sold: false, orderId: null });
            } else {
                await item.update({ sold: true, orderId: req.params.id });

            }
            await order.update({ total: parsedTotal });
            res.json({ order });
        } else {
            next(orderNotFoundError(req.params.id));
        }
    })
);

//delete/cancel order with id passed on the params
//this option is only available for the owner/user
router.delete(
    "/:id",
    asyncHandler(async (req, res, next) => {
        const order = await Order.findOne({
            where: {
                id: req.params.id,
            },
        });

        if (order) {
            const items = await Item.findAll({
                where: {
                    orderId: req.params.id,
                },
            });
            await items.update({ sold: false, orderId: null });
            await order.destroy();
            res.json({ message: `Deleted order with id of ${req.params.id}.` });
        } else {
            next(orderNotFoundError(req.params.id));
        }
    })
);

module.exports = router;