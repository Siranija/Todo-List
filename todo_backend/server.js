//express using
const express = require('express'); //get express module in the const
const mongoose = require('mongoose');
const cors = require('cors');
//create an instance express
const app = express();
app.use(express.json())
app.use(cors());

//sample in memory storage for todo items
//let todos = [];


//conect mongoDB
mongoose.connect('mongodb://localhost:27017/mern-app')
.then(() => {
    console.log('DB Connected!')
})
.catch((err) => {
    console.log(err)
})

//creating schema
const todoSchema = new mongoose.Schema({
    title:String,
    description:String
})

//creating model
const todoModel = mongoose.model('ToDo',todoSchema);

//create a neww todo item
app.post('/todos', async (req,res) => {
    const {title, description} = req.body;
     // const newToDo = {
     //    id:todos.length + 1,
     //   title,
    //    description
    //};
    //todos.push(newToDo);
    //console.log(todos);

try{
    const newToDo = new todoModel({title,description});
    await newToDo.save();
     res.status(201).json(newToDo);
}catch (error){
    console.log(error)
    res.status(500);

}
})

//get all items
app.get('/todos', async (req, res) => {
    try{
        const todos = await todoModel.find();
        res.json(todos);
    }catch(error){
        console.log(error)
        res.status(500).json({message: error.message});

    }
})

//update a todo item
app.put("/todos/:id", async(req,res) => {
try{
    const {title, description} = req.body;
    const id = req.params.id;
    const updatedtodo = await todoModel.findByIdAndUpdate(
        id,
        {title, description}
    )
    if(!updatedtodo){
        return res.status(404).json({message: "todo not found"})
    }
    res.json(updatedtodo)
    }catch (error){
        console.log(error)
        res.status(500).json({message: error.message});

    }
} )

//delete a todo item
app.delete('/todos/:id', async (req,res) => {
try{
    const id = req.params.id;
    await todoModel.findByIdAndDelete(id);
    res.status(204).end();
}catch (error){
    console.log(error)
    res.status(500).json({message: error.message});

}
})

//start the server(application will run this port)
const port = 8000;
app.listen(port, () => {
    console.log("server is listening to port "+port)
})