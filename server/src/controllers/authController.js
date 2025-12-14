const User = require("../models/user");
const bcrypt = require("bcryptjs");
const generateToken  =require("../utils/generateToken")
const registerUser = async (req,res) =>{
    try{
        const {name, email, password} = req.body;
        if(!name || !email || !password){
         return res.status(400).json({message : "Please provide all requied feilds"});
        }
        const userExists = await User.findOne({email});
        if(userExists){
           return res.status(400).json(({message : "User already exists"}));
        }
        //res.status(201).json({message : "User registered successfully"})
        const user = await User.create({
            name,
            email,
            password
        });
        if (!user) {
            return res.status(400).json({ message: "User creation failed" });
            }

        res.status(201).json({
            _id : user._id,
            name : user.name,
            email : user.email,
            role : user.role,
            token : generateToken(user._id)

        });
    }
   catch (error) {
  console.error("REGISTER ERROR FULL:", error);
  res.status(500).json({
    message: error.message,
    stack: error.stack
  });
}

};
const loginUser = async (req,res) =>{
    try{
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({message : "Email and Password are required"});
        }
        const user = await User.findOne({email}).select("+password");
        if(!user){
            return res.status(401).json({message :"Invalid email or password"});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(401).json({message :"Invalid email or password"});
        }
        res.status(200).json({
                _id : user._id,
                name  : user.name,
                email : user.email,
                role : user.role,
                token : generateToken(user._id)
        
        });
    }
    catch(error){
        console.error("LOGIN ERROR FULL:", error);
        res.status(500).json({message : error.message});
    }
}
const getProfile = async (req,res) => {
    res.status(200).json(req.user);
};
module.exports = { registerUser, loginUser, getProfile};
