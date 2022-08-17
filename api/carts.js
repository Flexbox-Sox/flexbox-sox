const express = require("express");
const cartsRouter = express.Router();
const { getAllCarts, createCart, updateCart, deleteCart, getCartById, createCartItem, attachCartItemstoCarts, getAllCartItemsInCart } = require("../db");
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

// GET all items in a particular session cart
cartsRouter.get("/items", async (req, res) => {
    const { cart } = req.session;
    if (!cart) {
        res.send("Cart is empty!")
    } else {
        res.send(cart)
    }
})

// GET a cart by its id including all of its items
cartsRouter.get("/singleCart/:cartId", async (req, res, next) => {
    const { cartId } = req.params;
    const cart = await getCartById(cartId)
    if (!cart) {
        next({
            name: "CartNotFound",
            message: "That cart does not exist"
        })
    } else {
        const newCart = await getAllCartItemsInCart(Number(cartId))
        res.send(newCart)
    }

})

// POST new item into cart
cartsRouter.post("/items", async (req, res, next) => {
    const { productId, priceAtPurchase } = req.body;
    const cartItem = { productId, priceAtPurchase };
    const { cart } = req.session
    const sessionId = req.sessionID
    let userId = null

    if (cart) {
        const { items } = cart;
        items.push(cartItem)
        await createCartItem({ productId, priceAtPurchase, cartId: cart.id})
    } else {
        
        if (req.user) {
            userId = req.user.id
        }
        
        const newCart = await createCart({userId, sessionId});
        req.session.cart = {
            id: newCart.id,
            items: [cartItem]
        };
        await createCartItem({ productId, priceAtPurchase, cartId: newCart.id });
    }

    res.send(cartItem);
})

module.exports = cartsRouter;
