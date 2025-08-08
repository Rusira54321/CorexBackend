const mongoose = require("mongoose")
const ProductSchema = new mongoose.Schema({
        name:{
            type:String,
            unique:true,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        description:{
            type:String
        },
        image:{
            type:String,
            required:true
        },
        brand:{
            type:String,
            required:true
        },
        Gender:{
            type: String, 
            enum: ['Men', 'Women', 'Unisex'],
            required:true
        },
        stock:{
            type:Number,
            default:0,
            required:true 
        },
        noOfSales:{
            type:Number,
            default:0
        },
        CreatedAt:{
            type:Date,
            default:Date.now
        }
})
module.exports = mongoose.model("Product", ProductSchema)