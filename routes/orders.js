const express = require("express");
const { check } = require("express-validator");
const { handleValidationErrors, asyncHandler } = require("../utils");
const { requireAuth } = require("../auth");
const router = express.Router();
const db = require("../db/models");

const { Op } = require("sequelize");
const { Item, User, Order } = db;

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
        const { userId } = req.body;
        const parsedId = await parseInt(userId, 10);
        const order = await Order.create({ userId: parsedId });

        // const item = await Event.findOne({
        //     where: {
        //         id: req.params.id,
        //     },
        // });
        // await item.update({ sold: true, orderId: order.id });

        res.json({ order });
    })
);