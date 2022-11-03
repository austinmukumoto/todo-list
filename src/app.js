import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dbInit from "./libs/init.js"
import routes from "./routes/routes.js"
import AuthMiddleware from "./middleware/AuthMiddleware.js"

dbInit()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors())
app.use("/v1/api/todos", AuthMiddleware); 
app.use("/v1/api", routes)

export default app