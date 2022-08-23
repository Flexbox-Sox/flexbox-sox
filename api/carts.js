const express = require("express");
const cartsRouter = express.Router();
const { getAllCarts, createCart, updateCart, deleteCart, getCartById, createCartItem, getAllCartItemsInCart, getCartByUser, getCartBySessionId, deleteCartItems, getCartItemByProductId, updateCartItem, deleteCartItemInCart } = require("../db");
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
    const sessionCartArray = await getCartBySessionId(sessionId)
    const sessionCart = sessionCartArray.find(sessionCart => sessionCart.orderStatus === "active")
    const { userId, orderStatus } = req.body;
    const updateFields = {}
    let userCart = null;

    if (req.user) {
        const userCartArray = await getCartByUser(req.user.id)
        userCart = userCartArray.find(userCart => userCart.orderStatus === "active")
    }

    if (orderStatus) {
        updateFields.orderStatus = orderStatus;
    }

    if (userId) {
        updateFields.userId = userId;
    }

    try {
        if (userCart) {
            const updatedCart = await updateCart(userCart.id, updateFields);
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

cartsRouter.patch("/singleCart/item/", async (req, res,  next) => {
    const { productId } = req.body;
    const sessionId = req.sessionID;
    const sessionCartArray = await getCartBySessionId(sessionId)
    const sessionCart = sessionCartArray.find(sessionCart => sessionCart.orderStatus === "active")
    let userCart = undefined

    if (req.user) {
        const userCartArray = await getCartByUser(req.user.id)
        userCart = userCartArray.find(userCart => userCart.orderStatus === "active")
    }

    if (!userCart) {
        const cartItem = await getCartItemByProductId(productId, sessionCart.id)
        if (cartItem.quantity > 1) {
            const newQuantity = cartItem.quantity - 1;
            await updateCartItem(cartItem.id, {quantity: newQuantity})
        } else {
            await deleteCartItemInCart(productId, sessionCart.id)
        }
    } else if (userCart) {
        const cartItem = await getCartItemByProductId(productId, userCart.id)
        if (cartItem.quantity > 1) {
            const newQuantity = cartItem.quantity - 1;
            await updateCartItem(cartItem.id, {quantity: newQuantity})
        } else {
            await deleteCartItemInCart(productId, userCart.id)
        } 
    }
})

// GET a cart by its id including all of its items
cartsRouter.get("/singleCart", async (req, res, next) => {
    const sessionId = req.sessionID
    const sessionCartArray = await getCartBySessionId(sessionId)
    const sessionCart = sessionCartArray.find(sessionCart => sessionCart.orderStatus === "active")
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
    } else if (sessionCart && sessionCart.userId === null && userCart) {
        await deleteCart(sessionCart.id)
        const cart = await getAllCartItemsInCart(Number(userCart.id))
        res.send(cart)
    } else if (sessionCart && req.user && !userCart) {
        await updateCart(sessionCart.id, {userId: req.user.id});
        const updatedCartWithItems = await getAllCartItemsInCart(Number(sessionCart.id))
        res.send(updatedCartWithItems)
    } else if (req.user && userCart) {
        const newCart = await getAllCartItemsInCart(Number(userCart.id))
        res.send(newCart)
    } else {
        const cart = await getAllCartItemsInCart(Number(sessionCart.id))
        if (sessionCart.orderStatus === "active") {
            res.send(cart)
        } else {
            const newCart = await createCart({userId: null, sessionId})
            res.send(newCart)
        }
    }
})

// POST new item into cart and if no cart exists creates a new cart
cartsRouter.post("/singleCart", async (req, res, next) => {
    const { productId, priceAtPurchase } = req.body;
    const cartItem = { productId, priceAtPurchase };
    const sessionId = req.sessionID
    let userId = null
    const sessionCartArray = await getCartBySessionId(sessionId)
    const sessionCart = sessionCartArray.find(sessionCart => sessionCart.orderStatus === "active")

    if (sessionCart && !req.user) {
        const potentialItem = await getCartItemByProductId(productId, sessionCart.id)
        if (potentialItem) {
            const newQuantity = potentialItem.quantity + 1;
            await updateCartItem(potentialItem.id, {quantity: newQuantity} )
        } else {
            await createCartItem({ productId, priceAtPurchase, cartId: sessionCart.id})
        }
    } else if (req.user) { 
        const userCartArray = await getCartByUser(req.user.id)
        if (userCartArray.length) {
            const userCart = userCartArray.find(userCart => userCart.orderStatus === "active")
            if (!userCart) {
                const newCart = await createCart({userId: req.user.id, sessionId});
                await createCartItem({ productId, priceAtPurchase, cartId: newCart.id });
            } else {
                const potentialItem = await getCartItemByProductId(productId, userCart.id)
                if (potentialItem) {
                    const newQuantity = potentialItem.quantity + 1;
                    await updateCartItem(potentialItem.id, {quantity: newQuantity} )
                } else {
                    await createCartItem({ productId, priceAtPurchase, cartId: userCart.id})
                }
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
