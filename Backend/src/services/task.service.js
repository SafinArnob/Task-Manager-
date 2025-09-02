import TaskModel from "../model/task.model.js";

export const createTaskService = async(body, userId) => {
    const newTask = new TaskModel({
        ...body,
        owner: userId
    });
    await newTask.save();
    return {data: newTask, message: "Task Created Successfully"};
};

export const getTasksService = async(userId, query = {} ) => {
    const { 
        search,
        category,
        completed,
        priority,
        sortBy = "createdAt",
        order = "desc",
        page = 1, 
        limit = 10, 
    } = query;

    let filter = { owner: userId };

    //search function
    if(search){
        filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { tags: { $regex: search, $options: "i" } }
        ];
    }

    //filter by category
    if(category){
        filter.category = category;
    }

    //filter by completion status
    if(completed !== undefined){
        filter.completed = completed;
    }

    //filter by priority
    if(priority){
        filter.priority = priority;
    }

    //sort options
    const sortOptions = {};
    if(sortBy){
        sortOptions[sortBy] = order === "desc" ? -1 : 1;
    }

    //pagination
    const skip = (page - 1) * limit;

    const tasks = await TaskModel.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('comments.author', 'name email');

    const total = await TaskModel.countDocuments(filter);

    return {
        data: tasks,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
        },
        message: "Successfully fetched Data"
    };
};

export const getTaskService = async (taskId, userId) => {
  const taskById = await TaskModel.findOne({ owner: userId, _id: taskId })
    .populate('comments.author', 'name email')
    .populate('dependencies', 'title completed');
  return { data: taskById, message: "Successfully fetched data!" };
};

export const updateTaskService = async (taskId, userId, body) => {
  const allowedUpdate = [
    "title", 
    "description", 
    "completed", 
    "priority", 
    "category", 
    "tags", 
    "deadline", 
    "progress", 
    "estimatedTime", 
    "actualTime"
  ];

  const isValidOperation = Object.keys(body).every((item) =>
    allowedUpdate.includes(item)
  );

  if (!isValidOperation) {
    const error = new Error("Invalid Update Request!");
    error.statusCode = 400;
    throw error;
  }

  const task = await TaskModel.findOne({ _id: taskId, owner: userId });

  if (!task) {
    const error = new Error("Task Not Found!");
    error.statusCode = 400;
    throw error;
  }

  Object.keys(body).forEach((item) => {
    task[item] = body[item];
  });

  await task.save();

  return { data: task, message: "Updated Task Successfully!" };
};

export const deleteTaskService = async (taskId, userId) => {
  const taskById = await TaskModel.findOneAndDelete({ owner: userId, _id: taskId });

  if (!taskById) {
    const error = new Error("Task Not Found!");
    error.statusCode = 400;
    throw error;
  }

  return { message: "Task deleted successfully!" };
};

