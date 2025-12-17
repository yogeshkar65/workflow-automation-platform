const Task = require("../models/task");
const User = require("../models/user");
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
        if(req.user.role === "admin"){
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
exports.assignTask = async(req,res) =>{
    try{
        const {userId} = req.body;
        const {id} = req.params;
        if(!userId){
            return res.status(400).json({message : "User ID is required"});
        }
        const task = await Task.findById(id);
        if(!task){
            return res.status(404).json({message : "Task not found"});
        }
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message : "User not found"});
        }
        task.assignedTo = userId;
        await task.save();
        const populatedTask = await Task.findById(task._id)
                              .populate("createdBy", "name email")
                              .populate("assignedTo", "name email");
        res.status(200).json(populatedTask);
    }
    catch(error){
        res.status(500).json({message : "Failed to assign task" , error : error.message});
    }
};
exports.updateTaskStatus = async(req,res) =>{
    try{
        const { status } = req.body;
        const {id} = req.params;
        if(!status){
           return res.status(400).json({message: "Status is required"});
        }
        const task = await Task.findById(id);
        if(!task){
           return res.status(404).json({message: "Task not found"});
        }
        if(req.user.role !== "admin" && task.assignedTo?.toString() !== req.user._id.toString()){
            return res.status(403).json({ message: "Not authorized to update this task"});
        }
        task.status = status;
        await task.save();
        const populatedTask = await Task.findById(task._id)
                              .populate("createdBy","name email")
                              .populate("assignedTo","name email");
        res.status(200).json(populatedTask);                       
    }
    catch(error){
        res.status(500).json({
            message : "Failed to update task status",
            error : error.message
        });
    }
};
exports.getTaskById = async(req,res) =>{
    try{
        const { id } =req.params;
        const task = await Task.findById(id)
                    .populate("createdBy", "name email")
                    .populate("assignedTo", "name email");
        if(!task){
            return res.status(404).json({ message : "Task not found"});
        }
        if(req.user.role !== "admin" && task.assignedTo?._id.toString() !== req.user._id.toString()){
            return res.status(403).json({message : "Not authorized to View task"});
        }
        res.status(200).json(task);
    }
    catch(error){
        res.status(500).json({
            message : "Failed to fetch task",
            error : error.message
        });
    }
};