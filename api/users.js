const express = require("express");
const usersRouter = express.Router();
const { getUserById, getUserByUsername, createUser, deleteUser, getAllUsers, getUserByEmail } = require("../db/models/user");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { requireUser } = require('./utils');
const bcrypt = require('bcrypt')


usersRouter.get("/", async(req, res, next) => {
  try {
      const AllUsers = await getAllUsers();
      res.send(AllUsers);

  } catch (error) {
      next(error)
  }
  
});

usersRouter.get("/logout", async (req, res, next) => {
  try {
    req.session.destroy()
    req.user = null
    res.send("You have logged out")
  } catch (error) {
    next(error)
  }
})

//POST/api/users/register
usersRouter.post("/register", async (req, res, next) => {
  const { username, password, email } = req.body;
  try {
    const userGetUser = await getUserByUsername(username);
    if (userGetUser) {
      next({
        error: "Error",
        name: "UserExistsError",
        message: `User ${username} is already taken.`,
      });
    }

    const userGetEmail = await getUserByEmail(email);
    if (userGetEmail) {
      next({
        error: "Error",
        name: "EmailExistsError",
        message: `A user with ${email} already exists`
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userObj = { username, password:hashedPassword, email}
    const token = jwt.sign(userObj, JWT_SECRET);
    const finalUser = await createUser(userObj) 
    res.send({
      message: "You are now registered. Now please log in!",
      token: token,
      user: finalUser,
      
    });
  } catch ({ error, message }) {
    next({ error, message });
  }
});

// POST /api/users/login

usersRouter.post("/login", async (req, res, next) => {
  const { username, hashedPassword } = req.body;
  try {
    const userLogin = await getUserByUsername(username);
      
    if (userLogin && hashedPassword === userLogin.hashedPassword) {
      const token = jwt.sign(userLogin, JWT_SECRET);
      req.user = await getUserById(userLogin.id);

      res.send({
        message: "you're logged in!",
        token: token,
        user: userLogin,
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

usersRouter.get("/me", requireUser, async (req, res, next) => {
  try {
    res.send(req.user)
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// GET /api/users/:username

usersRouter.get("/:username", requireUser, async (req, res, next) => {
  const { username } = req.params;
  try {
    const singleUser = await getUserByUsername(username);

    if (req.user.username === username || req.user.isAdmin) {
      res.send(singleUser);
    } else {
      next({
        name: "UnauthorizedUserError",
        message: "You cannot find user information for someone that is not you"
      })
    }
  } catch (error) {
    next({
      name: "Error",
      message: `Error getting username for user ${username}`,
    });
  }
});

usersRouter.delete('/:userId', requireUser, async (req, res, next) => {
  const { userId } = req.params;
  try {
    const singleUser = await getUserById(userId);
    if (!singleUser) {
      next({
        name: "UserNotFoundError",
        message: "There is no user by that id"
      })
    }

    if (req.user.id === userId || req.user.isAdmin) {
      const deletedUser = await deleteUser(userId);
      res.send(deletedUser);
    } else {
      next({
        name: "UnauthorizedUserError",
        message: "You cannot delete a user that is not you"
      })
    }
  } catch ({name, message}) {
    next({name, message})
  }
})

module.exports = usersRouter;
