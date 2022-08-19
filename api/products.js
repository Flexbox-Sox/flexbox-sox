const express = require('express');
const productsRouter = express.Router();
const { requireUser, requireAdmin } = require("./utils");
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, getProductByName, deleteCartItems } = require("../db")

productsRouter.get("/", async(req, res, next) => {
    try {
        const allProducts = await getAllProducts();
        res.send(allProducts);

    } catch (error) {
        next(error)
    }
    
});

productsRouter.get("/:productId", async(req, res, next) => {
  const { productId } = req.params;

  try {
    const product = await getProductById(productId);
    res.send(product)
    
  } catch (error) {
    next(error)
  }
})

productsRouter.post("/", requireAdmin, async(req, res, next) => {
    try {
        const { name, price, description, photo } = req.body;
        const existingProduct = await getProductByName(name);
        if(existingProduct) {
          next({
            name: 'NotFound',
            message: `A Sock with that name ${name} already exists`
          });
        } else {
          const createdProduct = await createProduct({ name, price, description, photo });
          if(createdProduct) {
            res.send(createdProduct);
          } else {
            next({
              name: 'FailedToCreate',
              message: 'There was an error creating your Socks'
            })
          }
        }
      } catch (error) {
        next(error);
      }
    });

    // ({requiredParams: ['name', 'price', 'inStock', 'description', 'photo', 'reviews']})


productsRouter.patch('/:productId', requireUser, async (req, res, next) => {
  const { productId } = req.params;
  const { name, price, inStock, description, photo } = req.body;

  const updateFields = {};
  
  if (name) {
    updateFields.name = name;
  }

  if (price) {
    updateFields.price = price;
  }

  if (inStock) {
    updateFields.inStock = inStock;
  }

  if (description) {
    updateFields.description = description;
  }

  if (photo) {
    updateFields.photo = photo;
  }

  try {
    
    const updatedProduct = await updateProduct(productId, updateFields);
      res.send({ product: updatedProduct })

  } catch ({ name, message }) {
    next({ name, message });
  }
});

productsRouter.delete('/:productId', requireAdmin, async (req, res, next) => {
    const { productId } = req.params;
    try {
            const deletedItems = await deleteCartItems(productId)
            const deletedProduct = await deleteProduct(productId)
            res.send({ product: deletedProduct });
  
    } catch ({ name, message }) {
        next({ name, message });
    }
  })


module.exports = productsRouter