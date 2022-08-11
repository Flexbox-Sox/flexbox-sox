const apiRouter = require("express").Router();
const usersRouter = require("./users");
const productsRouter = require("./products");
const cartsRouter = require("./carts");
const { getUserById } = require("../db");
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = process.env


apiRouter.get("/", (req, res, next) => {
  res.send({
    message: "API is under construction!",
  });
});

apiRouter.get("/health", (req, res, next) => {
  res.send({
    healthy: true,
  });
});

apiRouter.use(async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");

  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, JWT_SECRET);
      if (id) {
        req.user = await getUserById(id);
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: "AuthorizationHeaderError",
      message: `Authorization token must start with ${prefix}`,
    });
  }
});
// place your routers here
apiRouter.use("/users", usersRouter);
apiRouter.use("/products", productsRouter);
apiRouter.use("/carts", cartsRouter);

apiRouter.use((error, req, res, next) => {
  res.send({
      name: error.name,
      message: error.message
  });
});

module.exports = apiRouter;
