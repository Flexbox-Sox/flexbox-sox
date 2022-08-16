const express = require("express");
const cartsRouter = express.Router();
const { getAllCarts, createCart, updateCart, deleteCart, getCartById, createCartItem } = require("../db");
const {requireAdmin} = require('./utils');

// GET all carts (admin only)
cartsRouter.get("/", requireAdmin, async (req, res, next) => {
    try {
        const allCarts = await getAllCarts();
        res.send(allCarts);
    } catch (error) {
        next(error);
    }
})

//GET a single cart by its id
cartsRouter.get("/singleCart/:cartId", async (req, res, next) => {
    const { cartId } = req.params;

    try {
        const cart = await getCartById(cartId);
        res.send(cart);
    } catch ({name, message}) {
        next({name, message})
    }
})

// POST create a new cart
cartsRouter.post("/", async (req, res, next) => {
    try {
        const { userId, sessionId } = req.body;
        const cartObj = { 
            userId,
            sessionId
        }

        const createdCart = await createCart(cartObj);
        if (createdCart) {
            res.send(createdCart)
        } else {
            next({
                name: 'FailureToCreate',
                message: 'There was an error starting a new cart'
            })
        }
    } catch ({name, message}) {
        next({name, message})
    }
})

// PATCH single cart by its id
cartsRouter.patch("/singleCart/:cartId", async (req, res, next) => {
    const { cartId } = req.params;
    const { orderStatus, sessionId } = req.body;
    const updateFields = {}

    if (orderStatus) {
        updateFields.orderStatus = orderStatus;
    }

    if (sessionId) {
        updateFields.sessionId = sessionId;
    }

    try {
        const originalCart = await getCartById(cartId);
        if (originalCart.userId === req.user.id) {
            const updatedCart = await updateCart(cartId, updateFields);
            res.send({cart: updatedCart})
        } else {
            next(originalCart ? {
                name: "UnauthorizedUserError",
                message: "You can only edit your own cart!"
            } : {
                name: "CartNotFoundError",
                message: "No such cart exists!"
            })
        }
        
    } catch ({name, message}) {
        next({name, message})
    }
})

// DELETE single cart by its id
cartsRouter.delete("/singleCart/:cartId", async (req, res, next) => {
    const { cartId } = req.params;
    try {
        const cart = await getCartById(cartId);
        if (cart && cart.userId === req.user.id) {
            const deletedCart = await deleteCart(cartId)
            res.send({ cart: deletedCart });
        } else {
            next(cart ? {
                name: "UnauthorizedUserError",
                message: "You cannot delete a cart that is not yours!"
            } : {
                name: "CartNotFoundError",
                message: "No such cart exists!"
            })
        }

    } catch ({name, message}) {
        next({name, message})
    }
})

// GET all items in a session cart (not done... doesn't interact with tables at all)
cartsRouter.get("/items", (req, res) => {
    const { cart } = req.session;
    if (!cart) {
        res.send("no items to display")
    } else {
        res.send(cart)
    }
})

// POST new item into cart (not done... doesn't interact with tables at all)
cartsRouter.post("/items", async (req, res, next) => {
    const { item, quantity } = req.body;
    const cartItem = { item, quantity };
    const { cart } = req.session
    const sessionId = req.sessionId
    console.log(sessionId)
    if (cart) {
        const { items } = cart;
        items.push(cartItem)
    } else {
        req.session.cart = {
            items: [cartItem]
        };
        await createCart({userId: null, sessionId})
    }
    res.send(cartItem);
})

module.exports = cartsRouter;
