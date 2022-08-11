const express = require('express');
const productsRouter = express.Router();


const { requireUser } = require("./utils");
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../db")

productsRouter.get("/", async(req, res, next) => {
    try {
        const allProducts = await getAllProducts();
        res.send(allProducts);

    } catch (error) {
        next(error)
    }
    
});

productsRouter.get("/:productId", async(req, res, next) => {
  try {
    const product = await getProductById();
    res.send(product)
    
  } catch (error) {
    next(error)
  }
})

productsRouter.post("/", requireUser ({requiredParams: ['name', 'price', 'inStock', 'description', 'photo', 'reviews']}), async(req, res, next) => {

    try {
        const { name, price, inStock, description, photo, reviews } = req.body;
        const existingProduct = await getProductById(id);
        if(existingProduct) {
          next({
            name: 'NotFound',
            message: `A Sock with that name ${name} already exists`
          });
        } else {
          const createdProduct = await createProduct({name, price, inStock, description, photo, reviews});
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


    productsRouter.patch('/:productId', requireUser, async (req, res, next) => {
      const { productId } = req.params;
      const { name, price, inStock, description, photo, reviews } = req.body;
    
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
        const originalProduct = await getProductById(productId);
    
        if (originalProduct.user.id === req.user.id) {
          const updatedProduct = await updateProduct(productId, updateFields);
          res.send({ product: updatedProduct })
        } else {
          next({
            name: 'UnauthorizedUserError',
            message: 'You cannot update the products. You are Not an Admin!'
          })
        }
      } catch ({ name, message }) {
        next({ name, message });
      }
    });

    productsRouter.delete('/:productId', requireUser, async (req, res, next) => {
        const { productId } = req.params;
        try {
            const product = await getProductById(productId);
      
            if (product && product.id === req.user.id) {
                const deletedProduct = await deleteProduct(product.id)
      
                res.send({ product: deletedProduct });
            } else {
                next(product ? {
                    name: 'UnauthorizedUserError',
                    message: 'You cannot delete Socks! You are Not an Admin!'
                } : {
                    name: 'ProductNotFoundError',
                    message: "Those Socks do not exist"
                });
            }
      
        } catch ({ name, message }) {
            next({ name, message });
        }
      })


module.exports = productsRouter