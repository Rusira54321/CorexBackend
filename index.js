const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const bcrypt = require("bcryptjs")
const userRouter = require("./Router/UserRouter")
dotenv.config()
const {addAdmin} = require("./controller/Admin")
const orderRoute = require("./Router/OrderRoute")
const productRoute = require("./Router/productRoute")
const app = express()
const striperoute = require("./Router/StripeRoute")
app.use("/webhook",require("./webhook/stripewebhook"))
app.use(cors())
app.use(express.json())
const user = require("./model/User")
const getserver  = async()=>{
    await app.listen(process.env.PORT,()=>{
        console.log(`Server is running on port ${process.env.PORT}`)
    })
}
getserver().then(async()=>{
    await mongoose.connect(process.env.MONGODBURL).then(()=>{
        console.log("Connected to MongoDB")
    }).catch((error)=>{
        console.error("Error connecting to MongoDB:", error)
    })
    }
)
addAdmin()
app.use(express.static("./public"))
app.use("/user",userRouter)
app.use("/stripe",striperoute)
app.use("/product",productRoute)
app.use("/order",orderRoute)