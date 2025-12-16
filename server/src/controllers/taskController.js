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
exports.getTasks = async (req,res) =>{
    try{
        let tasks;
        if(req.user.role == "admin"){
            tasks = await Task.find()
                    .populate("createdBy", "name email")
                    .populate("assignedTo", "name email");
        }
        else{
            tasks = await Task.find({assignedTo : req.user._id})
                    .populate("createdBy", "name email")
                    .populate("assignedTo", "name email");
        }
        res.status(200).json(tasks);
    }
    catch(error){
        res.status(500).json({
            message : "Failed to fetch tasks",
            error : error.message
        });
    }
};