import express from "express";
import todosController from "../controllers/todosController";
import authController from "../controllers/authController";
import usersController from "../controllers/usersController";

const routes = express.Router()

// TODOS CONTROLLER
routes.route("/todos").post(todosController.create)
                      .put(todosController.update)
                      .delete(todosController.remove)
                      .get(todosController.getAll)

routes.route("/todos/:id").get(todosController.show)
                          .put(todosController.complete)

// AUTH CONTROLLER
routes.route("/auth").post(authController.create)

// USERS CONTROLLER
routes.route("/users").post(usersController.create)


export default routes