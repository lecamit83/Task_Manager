const express = require('express');

require('./db/mongoose');

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.use( userRouter);
app.use( taskRouter);

app.listen(PORT, ()=>{
    console.log(`Server is running on PORT = ${PORT}`);
})

// const Task = require('./models/task')
// const User = require('./models/user')

// const main = async () => {

//     // const task = await Task.findById('5cba0182aa2b1a0830247edf');
//     // await task.populate('owner').execPopulate();
//     // console.log(task.owner.toJSON());

//     const user = await User.findById('5cba0125fee93d1ef8ab214b')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }

// main()