const express = require("express");
const cartsRouter = express.Router();
const { getAllCarts, createCart, updateCart, deleteCart, getCartById, createCartItem, getAllCartItemsInCart, getCartByUser } = require("../db");
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
cartsRouter.patch("/singleCart/:cartId", async (req, res, next) => {
    const { cartId } = req.params;
    const { userId, orderStatus } = req.body;
    const updateFields = {}

    if (orderStatus) {
        updateFields.orderStatus = orderStatus;
    }

    if (userId) {
        updateFields.userId = userId;
    }

    try {
        const originalCart = await getCartById(cartId);
        if (originalCart.sessionId === req.sessionID) {
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
cartsRouter.get("/singleCart", async (req, res, next) => {
    const { sessionCart } = req.session
    let userCart = undefined
    if (req.user) {
        const userCartArray = await getCartByUser(req.user.id)
        userCart = userCartArray.find(userCart => userCart.orderStatus === "active")
    }

    if (!sessionCart && !userCart) {
        const newCart = await createCart({userId: null, sessionId: req.sessionID})
        res.send(newCart)
    } else if (!sessionCart) {
        console.log(userCart.id)
        const newCart = await getAllCartItemsInCart(Number(userCart.id))
        res.send(newCart)
    } else {
        const newCart = await getAllCartItemsInCart(Number(sessionCart.id))
        res.send(newCart)
    }
})

// POST new item into cart and if no cart exists creates a new cart
cartsRouter.post("/items", async (req, res, next) => {
    const { productId, priceAtPurchase } = req.body;
    const cartItem = { productId, priceAtPurchase };
    const { sessionCart } = req.session
    const sessionId = req.sessionID
    let userId = null

    if (sessionCart) {
        const { items } = cart;
        items.push(cartItem)
        await createCartItem({ productId, priceAtPurchase, cartId: cart.id})
    } else if (req.user) {        
        const userCartArray = await getCartByUser(req.user.id)
        if (userCartArray) {
            const userCart = userCartArray.filter(userCart =>
                userCart.orderStatus === "active")
            if (userCart) {
                userCart.items.push(cartItem)
                await createCartItem({ productId, priceAtPurchase, cartId: userCart.id})
            } else {
                userId = req.user.id
                const newCart = await createCart({userId, sessionId});
                req.session.cart = {
                    id: newCart.id,
                    items: [cartItem]
                };
                await createCartItem({ productId, priceAtPurchase, cartId: newCart.id });
            }
        }
    } else {

    }
    res.send(cartItem);
})

module.exports = cartsRouter;
