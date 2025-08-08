const order = require("../model/Order")
const getorders = async(req,res) =>{
    const orders = await order.find()
    if(orders)
    {
        return res.status(200).json({Orders:orders})
    }
}
const updateOrders = async(req,res) =>{
    const {id,value} = req.body
    if(!id || !value)
    {
        return res.status(400).json({message:"Missing fields"})
    }else{
        const matchOrder = await order.findById(id)
        if(matchOrder)
        {
            matchOrder.status = value
            try{
            await matchOrder.save()
            return res.status(200).json({message:"Updated successfuly"})
            }catch(error)
            {
                return res.status(400).json({message:error.message})
            }
        }
    }
}
const pendingOrders = async(req,res) =>{
    try{
    const POrders = await order.find({status:"Pending"})
    if(POrders)
    {
        const POrdersCount = POrders.length
        return res.status(200).json({count:POrdersCount})
    }
}catch(error)
{
    return res.status(400).json({message:error.message})
}
}
const getMonthlyRevenue = async(req,res) =>{
    try{
        const year = parseInt(req.query.year) || new Date().getFullYear()
        const result = await order.aggregate([
            {
                $match:{
                    createdAt:{
                        $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                        $lte: new Date(`${year}-12-31T23:59:59.999Z`)
                    }
                }
            },
            {
                $group:{
                    _id:{$month:"$createdAt"},
                    totalRevenue:{$sum:"$totalPrice"}
                }
            },{
                $sort:{_id:1}
            }
        ])
        const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
        const monthlyData = months.map((month,index)=>({
            month,
            revenue:0
        }))
        result.forEach(item=>{
            monthlyData[item._id-1].revenue = item.totalRevenue
        })
        return res.status(200).json(monthlyData)
    }catch(error)
    {
        res.status(500).json({error:error.message})
    }
}
const getOrdersbyUsers = async(req,res) =>{
    const {email} = req.body
    if(email!=null)
    {
        try {
            const orders = await order.find({customer_email:email})
            if(orders)
                {
                    return res.status(200).json({orders})
                }            
        }catch(error)
        {
            return res.status(400).json({message:error.message})
        }
    }
}
module.exports = {getorders,updateOrders,pendingOrders,pendingOrders,getMonthlyRevenue,getOrdersbyUsers}