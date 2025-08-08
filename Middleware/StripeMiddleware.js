require("dotenv").config()
const user = require("../model/User")
const jwt = require("jsonwebtoken")
const secretkey = process.env.JWT_SECRET
const authenticateToken = (req,res,next) =>{
    const authHeader = req.header("Authorization")
    const {items,email} = req.body
    if(!authHeader)
    {
        return res.status(401).json({message:"Unauthorized:missing token"})
    }
    const [bearer,token] = authHeader.split(" ")
    if(bearer!=="Bearer" || !token)
    {
        return res.status(401).json({message:"unauthorized:Invalid token format"})
    }
    jwt.verify(token,secretkey,(err,payload)=>{
        if(err)
        {
            return res.status(403).json({message:"Forbidden: Invalid token"})
        }
        const id = payload.id
        const finduser = async() =>{
              const matcheduser =   await user.findById(id)
              if(matcheduser.role=="admin")
              {
                    return res.status(400).json({message:"You are not a user"})
              }
        }
        finduser()
        req.body = {
            items:items,
            email:email
        }
        next()
    })
}
const authenticateToken1 = (req,res,next) =>{
    const {password,address} = req.body
    const authHeader = req.header("Authorization")
    if(!authHeader)
    {
        return res.status(401).json({message:"Unauthorized:missing token"})
    }
    const [bearer,token] = authHeader.split(" ")
    if(bearer!=="Bearer" || !token)
    {
        return res.status(401).json({message:"unauthorized:Invalid token format"})
    }
    jwt.verify(token,secretkey,(err,payload)=>{
        if(err)
        {
            return res.status(403).json({message:"Forbidden: Invalid token"})
        }
        const id = payload.id
        const finduser = async() =>{
              const matcheduser =   await user.findById(id)
              if(matcheduser.role=="admin")
              {
                    return res.status(400).json({message:"You are not a user"})
              }
        }
        finduser()
        req.body = {
            password:password,
            address:address,
            id:id
        }
        next()
    })
}
const authenticateToken2 = (req,res,next) =>{
    const authHeader = req.header("Authorization")
    if(!authHeader)
    {
        return res.status(401).json({message:"Unauthorized:missing token"})
    }
    const [bearer,token] = authHeader.split(" ")
    if(bearer!=="Bearer" || !token)
    {
        return res.status(401).json({message:"unauthorized:Invalid token format"})
    }
    jwt.verify(token,secretkey,(err,payload)=>{
        if(err)
        {
            return res.status(403).json({message:"Forbidden: Invalid token"})
        }
        const id = payload.id
        const finduser = async() =>{
              const matcheduser =   await user.findById(id)
              if(matcheduser.role=="admin")
              {
                    return res.status(400).json({message:"You are not a user"})
              }
        }
        finduser()
        next()
    })
}
module.exports = {authenticateToken,authenticateToken1,authenticateToken2}