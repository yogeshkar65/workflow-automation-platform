const Task = require("../models/task");
exports.createTask = async(req,res) =>{
    try{
        const { title, description, assignedTo} = req.body;
        if(!title){
            return res.status(400).json({message :"Title is required"});
        }
        const task = await Task.create({
            title,
            description,
            assignedTo,
            createdBy : req.user._id
        })
        res.status(201).json(task);
    }
    catch(error){
        res.status(500).json({message : "Task creation failed", error : error.message})
    }
};