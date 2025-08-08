const user = require("../model/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Order = require("../model/Order")
require("dotenv").config()
const registerUser = async(req,res) =>{
        const {name,email,password,address} = req.body
        if(!name || !email || !password || !address){
            return res.status(400).json({message:"Please fill all the fields"})
        }
        const existinguser = await user.findOne({email})
        if(existinguser)
        {
            return res.status(400).json({message:"User already exists"})
        }else{
            newuser = new user({
                name,
                email,
                password: await bcrypt.hash(password, 10),
                address:address
            })
            try{
            await newuser.save()
            const token = jwt.sign({id:newuser._id},process.env.JWT_SECRET,{expiresIn:"3h"})
            return res.status(201).json({role:"user",email:email,token:token,message:"User registered successfully"})
            }catch(error){
                return res.status(500).json({message:"Error registering user",error:error.message})
            }
        }
}
const loginuser = async(req,res) =>{
        const {email,password} = req.body
        if(!email || !password){
            return res.status(400).json({message:"Please fill all the fields"})
        }
        const existinguser = await user.findOne({email})
        if(!existinguser)
        {
            return res.status(400).json({message:"User does not exist"})
        }
        const isMatch = await bcrypt.compare(password,existinguser.password)
        if(!isMatch)
        {
            return res.status(400).json({message:"Invalid credentials"})
        }
        const token = jwt.sign({id:existinguser._id},process.env.JWT_SECRET,{expiresIn:"3h"})
        return res.status(200).json({role:existinguser.role,email:email,token:token,message:"User logged in successfully"})
}
const getallusers = async(req,res) =>{
    try{
        const users = await user.find({role:"user"})
        if(!users)
        {
            return res.status(400).json({message:"No users"})
        }
        else
        {
            return res.status(200).json({users:users})
        }
    }catch(error)
    {
        return res.status(400).json({message:error.message})
    }
    
}
const getexistAdmin = async(req,res) =>{
    try{
        const admins = await user.findOne({role:"admin"})
        if(!admins)
        {
            return res.status(400).json({message:"Admin is not existed"})
        }else
        {
            return res.status(200).json({admindata:admins})
        }
    }catch(error)
    {
        return res.status(400).json({message:error.message})
    }
}
const updateadmindetails = async(req,res) =>{
    const {name,email,password} = req.body
    if(!name || !email || !password)
    {
        return res.status(400).json({message:"Fields are missing"})
    }else
    {
        try{
        const existadmin = await user.findOne({role:"admin"})
        if(existadmin)
        {

            existadmin.name = name
            existadmin.email = email
            if(password==existadmin.password)
            {
                existadmin.password = password
            }
            else 
            {
                existadmin.password = await bcrypt.hash(password, 10)
            }
            await existadmin.save()
            return res.status(200).json({message:"Admin profile is updated"})
        }
    }catch(error)
    {
        return res.status(400).json({message:error.message})
    }
    }
}
const updateUserDetails = async(req,res) =>{
    const {password,address,id} = req.body
    if(!password || !address || !id)
    {
        return res.status(400).json({message:"Fields are missing"})
    }else{
            const matchuser = await user.findById(id)
            if(!matchuser)
            {
                return res.status(400).json({message:"You are not registered user"})
            }
            else
            {
                try{
                const email = matchuser.email
                const existOrders = await Order.find({customer_email:email})
                if(existOrders)
                {
                    await Promise.all(
                        existOrders.map(order=>{
                                order.customer_address = address
                                return order.save()
                })
                    )
                }
                if(matchuser.password==password)
                {
                    matchuser.password = password
                }
                else{
                    matchuser.password = await bcrypt.hash(password,10)
                }
                matchuser.address = address
                await matchuser.save()
                return res.status(200).json({message:"User data updated successfully"})
            }catch(error)
            {
                return res.status(400).json({message:error.message})
            }
            }
    }
}
const getuserdetails = async(req,res) =>{
    const {email} = req.body
    if(email)
    {
        const matchUser = await user.findOne({email:email})
        if(matchUser)
        {
            return res.status(200).json({user:matchUser})
        }
    }
}
const NoOfUsers = async(req,res) =>{
    try{
        const users = await user.find({role:"user"})
        const userCount = users.length
        return res.status(200).json({count:userCount})
    }catch(error)
    {
        return res.status(400).json({message:error.message})
    }
}
const monthlyNewUsers = async(req,res) =>{
    try{
        const year = parseInt(req.query.year) || new Date().getFullYear()
        const result = await user.aggregate([
            {
                $match:{
                    role:"user",
                    createdAt:{
                        $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                        $lte: new Date(`${year}-12-31T23:59:59.999Z`)
                    }
                }
            },
            {
                $group:{
                    _id:{$month:"$createdAt"},
                    count:{$sum:1}
                }
            },{
                $sort:{_id:1}
            }
        ])
        const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
        const monthlyData = months.map((month,index)=>({
            month,
            count:0
        }))
        result.forEach(item=>{
            monthlyData[item._id-1].count = item.count
        })
        return res.status(200).json(monthlyData)
    }catch(error)
    {
        return res.status(500).json({error:error.message})
    }
}
module.exports = { registerUser,loginuser,getallusers,getallusers,updateadmindetails,getexistAdmin,updateUserDetails,getuserdetails,NoOfUsers,monthlyNewUsers}