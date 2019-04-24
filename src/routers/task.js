const express = require('express');
const route = new express.Router();


const Task = require('../models/task');
const auth = require('../middleware/auth');


route.post('/tasks', auth , async (req, res)=>{
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });

    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(500).send(err);
    }
});


route.get('/tasks', auth,  async (req, res)=>{
    try {
//        const tasks = await Task.find({ owner : req.user._id });
        const match = {}
        const sort = {}

        if (req.query.completed) {
            match.completed = req.query.completed === 'true'
        }

        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }

        await req.user.populate({
            path : 'tasks', 
            match,
            options : {
                limit : parseInt(req.query.limit) || 10,
                skip  : parseInt(req.query.skip) || 0
            }
        }).execPopulate();
        

        if(!req.user.tasks){
            return res.status(404).send();
        }
        res.status(200).send(req.user.tasks);
    } catch (error) {
        res.status(500).send();
    }
});

route.get('/task/:id', auth, async (req, res)=>{
    let _id = req.params.id;

    try {
        const task = await Task.findOne({_id , owner: req.user._id});
        if(!task){
           return res.status(404).send();
        }
        res.status(200).send(task);
    } catch (error) {
        res.status(500).send();
    }   
});

// update


route.patch('/task/:id', auth,  async (req, res)=>{
    let  _id = req.params.id;
    const updateKeys = Object.keys(req.body);

    const allowedKeys = ['description', 'completed'];

    let isValidOperation = updateKeys.every((key)=>allowedKeys.includes(key));

    if(!isValidOperation){
        return res.status(400).send({error : "Invalid updates!"});
    }

    try {
        //const task = await Task.findByIdAndUpdate(_id, req.body, {new : true, runValidators : true});

        const task = await Task.findOne({_id, owner : req.user._id});

        updateKeys.forEach(update => {
            task[update] = req.body[update];
        });

        await task.save();

        if(!task){
            return res.status(404).send();
        }
        res.send(task);

    } catch (error) {
        res.status(500).send();
    }
});


route.delete('/task/:id', auth, async (req, res)=>{
    let _id = req.params.id;
    let owner = req.user._id;
    try {
        const task = await Task.findOneAndDelete({_id, owner});
        if(!task){  
            return res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(500).send();
    }
});

module.exports = route;