const user = require("../model/User")
const addAdmin = async(req,res) =>{
    const existadmin = await user.findOne({role:"admin"})
    if(existadmin)
    {
        console.log("Admin already exists")
        return
    }else{
        const newadmin = new user({
            name:"Rusira dinujaya",
            email:"rusiradinujaya57@gmail.com",
            password:await bcrypt.hash("rusira123",10),
            role:"admin"
        })
        await newadmin.save().then(()=>{
                console.log("Admin created successfully")
        }).catch((error)=>{
            console.log("Error creating admin:", error.message)
        })
    }
}
module.exports = {addAdmin}