const express = require('express');
const productsRouter = express.Router();
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../db")

productsRouter.get("/", async(request, response, next) => {
    try {
        const allProducts = await getAllProducts();
        response.send(allProducts);

    } catch (error) {
        next(error)
    }
    
});










module.exports = productsRouter