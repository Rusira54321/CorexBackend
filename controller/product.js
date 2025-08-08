const Product = require("../model/Product")
const addproduct = async(req,res) =>{
        const image = req.file.filename
        const {name,price,description,brand,gender,stock} = req.body
        var matchbrand = brand
        if(!name || !price || !description || !image || !brand || !gender || !stock)
        {
            return res.status(400).json({message:"Missing fields"})
        }
        try{
            const existingProduct = await Product.findOne({name:{$regex: new RegExp("^" + name + "$", "i")}})
            if(existingProduct)
            {
                return res.status(400).json({message:"The product already exists in the inventory"})
            }
            const existingbrand = await Product.findOne({brand:{$regex: new RegExp("^" + brand + "$", "i")}})
            if(existingbrand)
            {
                matchbrand = existingbrand.brand
            }
            const newProduct = new Product({
                name:name,
                price:price,
                description:description,
                image:image,
                brand:matchbrand,
                Gender:gender,
                stock:stock
            })
            await newProduct.save()
            return res.status(200).json({ message: "Product created successfully" })
        }catch(error)
        {
            return res.status(400).json({error:error.message})
        }
}
const getlatestproducts = async(req,res) =>{
    const products = await Product.find().sort({ CreatedAt: -1 }).limit(4)
    if(products.length!=0)
    {
        return res.status(200).json({product:products})
    }
}
const getbestsellingproducts = async(req,res) =>{
    const products = await Product.find().sort({ noOfSales: -1 }).limit(4)
    if(products.length!=0)
    {
        return res.status(200).json({product:products})
    }
}
const getallwatches = async(req,res) =>{
    const watches = await Product.find()
    if(watches)
    {
        return res.status(200).json({watches:watches})
    }
}
const getProductById = async(req,res) =>{
    const {id} = req.params
    if(id)
    {
        const matchProduct = await Product.findById(id)
        if(matchProduct)
        {
            return res.status(200).json({product:matchProduct})
        }
    }
}
const updateProductById = async(req,res) =>{
    const {id} = req.params
    const {stock,price} = req.body
    if(!stock || !price)
    {
        return res.status(400).json({message:"Missing Fields"})
    }
    try{
    const matchProduct = await Product.findById(id)
    if(matchProduct)
    {
        matchProduct.price = price
        matchProduct.stock = stock
        await matchProduct.save()
        return res.status(200).json({message:"Product updated successfully"})
    }
}catch(error)
{
    return res.status(400).json({message:error.message})
}
}
const deleteProduct = async(req,res) =>{
    const {id} = req.params
    try{
    const deletedProduct = await Product.findByIdAndDelete(id)
    if(!deletedProduct)
    {
        return res.status(400).json({message:"Product Not found"})
    }
    else{
        return res.status(200).json({message:"Product deleted successfully"})
    }}
    catch(error)
    {
        return res.status(400).json({message:error.message})
    }
}
const outofstockproductcount = async(req,res) =>{
    try{
    const outofstocks = await Product.find({stock:0})
    if(outofstocks)
        {
            const pcount = outofstocks.length
            return res.status(200).json({count:pcount})
        }
    }catch(error)
    {
        return res.status(400).json({message:error.message})
    } 
}
module.exports = {addproduct,getlatestproducts,getbestsellingproducts,getallwatches,getProductById,updateProductById,deleteProduct,outofstockproductcount}