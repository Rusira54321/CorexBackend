const express = require("express")
const router = express.Router()
require("dotenv").config()
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const order = require("../model/Order")
const User = require("../model/User")
const product = require("../model/Product")
const {transporter} = require("../util/nodemailer")
router.post("/",
    express.raw({type:"application/json"}),
    async(req,res)=>{
              const sig = req.headers["stripe-signature"];
              const endpointSecret = process.env.WEB_HOOK_SECRET
              const newitems = []
              let totalPrice = 0
              let event;

                try {
                    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
                } catch (err) {
                    console.log("❌ Webhook signature failed:", err.message);
                    return res.status(400).send(`Webhook Error: ${err.message}`);
                }
                if(event.type==="checkout.session.completed")
                {
                    const session = event.data.object;
                    const email = session.metadata.email
                    const items = JSON.parse(session.metadata.items)
                    try{
                        const user = await User.findOne({email})
                        if(user)
                        {
                            for(const item of items)
                            {
                                newitems.push({
                                    product:item.name,
                                    quantity:Number(item.quantity)
                                })
                                totalPrice = totalPrice + item.price * Number(item.quantity)
                            }
                            const neworder = new order({
                                customer_name:user.name,
                                customer_email:user.email,
                                customer_address:user.address,
                                items:newitems,
                                totalPrice:totalPrice,
                            })
                            try{
                                    await neworder.save()
                                    for(const item of items)
                                    {
                                        const matchproduct = await product.findOne({name:item.name})
                                        if(matchproduct)
                                        {
                                            matchproduct.stock = matchproduct.stock-Number(item.quantity)
                                            try{
                                                await matchproduct.save()
                                            }catch(error)
                                            {
                                                console.log(error)
                                            }
                                        }
                                    }
                                    await transporter.sendMail({
                                        from:process.env.SENDER_EMAIL,
                                        to:user.email,
                                        subject:"Corex watches payment successful",
                                        text:`The corex payment system charged Rs. ${totalPrice} from your credit card`
                                    })
                                    return res.status(200).json({received: true })
                            }catch(error)
                            {
                                    console.log(error)
                            }
                        }
                    }catch(error)
                    {
                            console.log(error)
                    }
                }
    }
)
module.exports = router