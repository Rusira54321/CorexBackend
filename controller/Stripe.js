require("dotenv").config()
const Stripesecret = process.env.STRIPE_SECRET_KEY
const stripe=require("stripe")(Stripesecret)
const stripePayment = async(req,res) =>{
    const {items,email} = req.body
    const lineItems = items.map((item)=>(
        {
            price_data:{
                currency:"usd",
                product_data:{
                    name:item.name,
                },
                unit_amount:Math.round(item.priceUSD*100),
            },
            quantity:item.quantity
        }
    ))
    try{
        const session = await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            line_items:lineItems,
            mode:"payment",
            success_url:"https://core-x-frontend-8mf3.vercel.app/successfulPayment",
            cancel_url:"https://core-x-frontend-8mf3.vercel.app/cancel",
            metadata:{
                items:JSON.stringify(items),
                email:email
            }      
        })
        res.status(200).json({id:session.id})
    }catch(error)
    {
        return res.status(404).json({message:"Session is not created"})
    }
} 
module.exports = {stripePayment}