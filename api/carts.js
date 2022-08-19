const express = require("express");
const cartsRouter = express.Router();
const { getAllCarts, createCart, updateCart, deleteCart, getCartById, createCartItem, getAllCartItemsInCart, getCartByUser, getCartBySessionId } = require("../db");
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

// PATCH edit a single cart by its id.. would only need this to update order status or add a user id
cartsRouter.patch("/singleCart", async (req, res, next) => {
    const sessionId = req.sessionID
    const sessionCart = await getCartBySessionId(sessionId)
    const { userId, orderStatus } = req.body;
    const updateFields = {}
    const userCart = null;
    if (req.user) {
        userCart = await getCartByUser(req.user.id)
    }

    if (orderStatus) {
        updateFields.orderStatus = orderStatus;
    }

    if (userId) {
        updateFields.userId = userId;
    }

    try {
        if (userCart) {
            const updatedCart = await updateCart(userCart[0].id, updateFields);
            res.send({cart: updatedCart})
        } else  if (sessionCart) {
            const updatedCart = await updateCart(sessionCart.id, updateFields);
            res.send({cart: updatedCart})
        } else {
            next({
                name: "CartNotFound",
                message: "You must have items in your cart in order to checkout!"
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
cartsRouter.get("/singleCart", async (req, res, next) => {
    const sessionId = req.sessionID
    const sessionCart = await getCartBySessionId(sessionId)
    let userCart = undefined

    if (req.user) {
        const userCartArray = await getCartByUser(req.user.id)
        userCart = userCartArray.find(userCart => userCart.orderStatus === "active")
    }

    if (!sessionCart && !req.user) {
        const newCart = await createCart({userId: null, sessionId})
        res.send(newCart)
    } else if (!sessionCart && req.user && !userCart) {
        const newCart = await createCart({userId: req.user.id, sessionId})
        res.send(newCart)
    } else if (!sessionCart && req.user && userCart) {
        const newCart = await getAllCartItemsInCart(Number(userCart.id))
        res.send(newCart)
    } else {
        const newCart = await getAllCartItemsInCart(Number(sessionCart.id))
        res.send(newCart)
    }
})

// POST new item into cart and if no cart exists creates a new cart
cartsRouter.post("/singleCart", async (req, res, next) => {
    const { productId, priceAtPurchase } = req.body;
    const cartItem = { productId, priceAtPurchase };
    const sessionId = req.sessionID
    const sessionCart = await getCartBySessionId(sessionId)
    let userId = null

    if (sessionCart) {
        if (sessionCart.items) {
            items.push(cartItem)
        } else {
            sessionCart.items = cartItem
        }
        await createCartItem({ productId, priceAtPurchase, cartId: sessionCart.id})
    } else if (req.user) { 
        const userCartArray = await getCartByUser(req.user.id)
        if (userCartArray.length) {
            const userCart = userCartArray.find(userCart => userCart.orderStatus === "active")
            if (userCart.items) {
                userCart.items.push(cartItem)
                await createCartItem({ productId, priceAtPurchase, cartId: userCart.id})
            } else {
                userCart.items = cartItem
                await createCartItem({ productId, priceAtPurchase, cartId: userCart.id})
            }
        } else {
            userId = req.user.id
            const newCart = await createCart({userId, sessionId});
            await createCartItem({ productId, priceAtPurchase, cartId: newCart.id });
        }
    } else {
        const newCart = await createCart({userId: null, sessionId});
        await createCartItem({ productId, priceAtPurchase, cartId: newCart.id})
    }

    res.send(cartItem);
})

module.exports = cartsRouter;
