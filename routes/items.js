const express = require("express");
const { check } = require("express-validator");
const { handleValidationErrors, asyncHandler } = require("../utils");
const { requireAuth } = require("../auth");
const router = express.Router();
const db = require("../db/models");

const { Op } = require("sequelize");
const { Item, User, Order } = db;

// get all items 
router.get(
    "/",
    asyncHandler(async (req, res) => {
        const items = await Item.findAll({
            include: [{ model: User, as: "owner", attributes: ["username", "id"] }],
            order: [["createdAt", "DESC"]],
            attributes: ["itemname", "description", "id", "price", "photoUrl", "sold"],
        });
        res.json({ items });
    })
);

const itemNotFoundError = (id) => {
    const err = Error("Item not found");
    err.errors = [`Item with id of ${id} could not be found.`];
    err.title = "Item not found.";
    err.status = 404;
    return err;
};

const validateItem = [
    check("itemname")
        .exists({ checkFalsy: true })
        .withMessage("Item can't be empty."),
    //  itemname cannot be longer than 280 characters:
    check("itemname")
        .isLength({ max: 250 })
        .withMessage("item name can't be longer than 250 characters."),
    handleValidationErrors,
];

//get item with id passed on the params from the client side
router.get(
    "/:id",
    asyncHandler(async (req, res, next) => {
        const item = await Item.findOne({
            include: [{ model: User, as: "owner", attributes: ["username", "id"] }],
            where: {
                id: req.params.id,
            },
        });
        if (item) {
            res.json({ item });
        } else {
            next(eventNotFoundError(req.params.id));
        }
    })
);

//create/set new item 
router.post(
    "/",
    validateItem,
    asyncHandler(async (req, res) => {
        const { itemname, price, description, sold, photoUrl, ownerId } = req.body;
        const parsedId = await parseInt(ownerId, 10);
        const item = await Item.create({ itemname, price, description, sold, photoUrl, ownerId: parsedId });

        res.json({ item });
    })
);

//delete item with id passed on the params
//this option is only available for the owner
router.delete(
    "/:id",
    asyncHandler(async (req, res, next) => {
        const item = await Item.findOne({
            where: {
                id: req.params.id,
            },
        });

        if (item) {
            await item.destroy();
            res.json({ message: `Deleted item with id of ${req.params.id}.` });
        } else {
            next(eventNotFoundError(req.params.id));
        }
    })
);