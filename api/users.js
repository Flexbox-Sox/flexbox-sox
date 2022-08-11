const express = require("express");
const usersRouter = express.Router();
const {
  getUserById,
  getUserByUsername
 
} = require("../db/models/user");
const { JWT_SECRET = "flexboxHotBox" } = process.env;

require("dotenv").config();

//POST/api/users/register
router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const userGetUser = await getUserByUsername(username);
    if (userGetUser) {
      next({
        error: "Error",
        name: "UserExistsError",
        message: `User ${username} is already taken.`,
      });
    }

    if (password.length < 8) {
      next({
        error: "Error",
        name: "ErrorCreatingUser",
        message: `Password Too Short!`,
      });
    }

    const user = await getUserByUsername({ username, password });
    const token = jwt.sign({ user }, JWT_SECRET);
    res.send({
      message: "You are now registered.",
      token: token,
      user: user,
    });
  } catch ({ error, message }) {
    next({ error, message });
  }
});

// POST /api/users/login

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await getUser({ username, password });

    const token = jwt.sign(user, JWT_SECRET);

    if (user) {
      res.send({
        message: "you're logged in!",
        token,
        user,
      });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (error) {
    throw error;
  }
});

// GET /api/users/me

router.get("/me", async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");

  if (!auth) {
    res.status(401).send({
      error: "UnauthorizedUserError",
      message: "You must be logged in to perform this action",
      name: "SomeError",
    });
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, JWT_SECRET);
      if (id) {
        req.user = await getUserById(id);
        res.send(req.user);
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: "AuthorizationHeaderError",
      message: `authorization token must start with ${prefix}`,
    });
  }
});

// GET /api/users/:username

router.get("/:username", async (req, res, next) => {
  const { username } = req.params;
  try {
    const singleUser = await getUserByUsername(username);

    if (req.user.username === username) {
      res.send(singleUser);
    }
  } catch (error) {
    next({
      name: "Error",
      message: `Error getting username for user ${username}`,
    });
  }
});

module.exports = usersRouter;
