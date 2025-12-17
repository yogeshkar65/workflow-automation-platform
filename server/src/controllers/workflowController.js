const Workflow = require("../models/workflow");
const Task = require("../models/task");

exports.createWorkflow = async (req,res) =>{
    try{
        const {title , description, tasks} = req.body;
        if(!title){
            return res.status(400).json({message : "Workflow tilte is required"});
        }
        if(!tasks || !Array.isArray(tasks) || tasks.length === 0){
            return res.status(400).json({message : "At least one task is required"});
        }
        const validTasks = await Task.find({_id : {$in : tasks}});
        if(validTasks.length !== tasks.length){
            return res.status(400).json({message : "one or more Tasks are Invalid"});
        }
        const workflow = await Workflow.create({
            title,
            description,
            tasks,
            createdBy : req.user._id
        });
        const populatedWorkflow = await Workflow.findById(workflow._id)
                                  .populate("tasks")
                                  .populate("createdBy", "name email");
        res.status(201).json(populatedWorkflow);

    }
    catch(error){
        res.status(500).json({
            message : "Failed to Create Workflow",
            error : error.message
        });
    
    }};

exports.getWorkflowById = async (req,res) =>{
    try{
        const{id} = req.params;
        const workflow = await Workflow.findById(id)
                         .populate({
                            path : "tasks",
                            populate : {
                                path : "assignedTo",
                                select : "name email"
                            }})
                         .populate("createdBy","name email");
        if(!workflow){
            return res.status(404).json({message : "Workflow not found"});
        }
        if(req.user.role !== "admin"){
            const isAssigned = workflow.tasks.some(task => 
                task.assignedTo && task.assignedTo._id.toString() === req.user._id.toString()
            );
            if(!isAssigned){
                return res.status(403).json({message : "Not authorized to view this workflow"});
            }
        }


        const totalTasks = workflow.tasks.length;
        const completedTasks = workflow.tasks.filter(task => 
            task.status === "completed"
        ).length;

        const currentStep = workflow.tasks.find(task =>
            task.status !== "completed") || null;
        
        res.status(200).json({
            workflow,
            progress : {
                totalTasks,
                completedTasks,
                currentStep
            }
     } );
        
    }
    catch(error){
        res.status(500).json({
            message : "Failed to fetch workflow",
            error : error.message
        });
    }
};
exports.getWorkflows = async (req,res) => {
    try{
    let workflows;
    if(req.user.role === "admin"){
        workflows = await Workflow.find()
                    .populate({
                        path : "tasks",
                        populate : {
                            path : "assignedTo",
                            select : "name email"
                        }
                    })
                    .populate("createdBy","name email");
    } 
    else {
        workflows = await Workflow.find({
            tasks : {$in : await Task.find({assignedTo : req.user._id}).distinct("_id")} 
        }).populate("createdBy","name email")
        .populate({
            path : "tasks",
            populate : {
                path : "assignedTo",
                select : "name email"
            }
        });   
    }
    return res.status(200).json(workflows);
}
catch(error){
   return res.status(500).json(
        {message : "Failed to fetch workflows",
            error : error.message

        });
}
}