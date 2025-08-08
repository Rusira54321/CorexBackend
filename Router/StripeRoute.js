const express = require("express")
const router = express.Router()
const {stripePayment} = require("../controller/Stripe")
const stripemiddleware = require("../Middleware/StripeMiddleware")
router.post("/checkout",stripemiddleware.authenticateToken,stripePayment)
module.exports = router