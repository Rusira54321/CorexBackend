const mongoose = require("mongoose")
const OrderSchema = new mongoose.Schema({
    customer_name:{
        type:String,
        required:true
    },
    customer_email:{
        type:String,
        required:true
    },
    customer_address:{
        type:String,
        required:true
    },
    items:[{
        product:{
            type:String,
            required:true
        },
        quantity:{
            type:Number,
            required:true
        }
    }],
    totalPrice:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:["Pending", "Shipped", "Delivered", "Cancelled"],
        default:"Pending"
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})
module.exports = mongoose.model("Order", OrderSchema)