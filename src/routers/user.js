const express = require('express');
const route = express.Router();

const User = require('../models/user');
const auth = require('../middleware/auth');

route.post('/user', async (req, res)=>{
    const user = new User(req.body);
    //console.log(user);

    try {
        await user.save();

        const token = await user.generateAuthenticationToken();

        res.status(201).send({user, token});
    } catch (error) {
        res.status(400).send(error);
    }
});


route.get('/me', auth ,async (req, res)=>{

    try {
        res.status(200).send(req.user);
    } catch (error) {
        res.status(500).send();
    }
});

route.post('/user/logout', auth , async (req, res) => {
    try {
        const user = req.user;

        user.tokens = user.tokens.filter((e) => {
            return e.token !== req.token
        });
        
        await user.save();

        res.send();

    } catch (error) {
         res.status(500).send({error : 'ERROR'});
    }
});

route.post('/user/logout_all', auth , async (req, res) => {
    try {
        const user = req.user;

        user.tokens = [];
        
        await user.save();

        res.send();

    } catch (error) {
         res.status(500).send({error : 'ERROR'});
    }
});

route.get('/users', auth ,async (req, res)=>{

    try {
        const users = await User.find({});
        if(!users){
           return res.status(404).send();
        }
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send();
    }
});

route.get('/user/:id', async (req, res)=>{
    let _id = req.params.id;

    try {
        const user = await User.findById(_id);
        if(!user){
           return res.status(404).send();
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send();
    }
});


route.patch('/user/me', auth,  async (req, res)=>{
  
    const updateKeys = Object.keys(req.body);

    const allowedKeys = ['name', 'email', 'password'];

    let isValidOperation = updateKeys.every((key)=>allowedKeys.includes(key));

    if(!isValidOperation){
        return res.status(404).send({error : "Invalid updates!"});
    }

    try {
        updateKeys.forEach((update) => req.user[update] = req.body[update])

        await req.user.save();

        res.send(req.user);

    } catch (error) {
        res.status(500).send();
    }
});


route.delete('/user/me',auth,  async (req, res)=>{

    try {
        await req.user.remove()

        res.send(req.user);
    } catch (error) {
        res.status(500).send();
    }
});

route.post('/user/login', async (req, res) => {
    try {
        const {email , password} = req.body;
        
        const user = await User.findByCredentials(email, password);

        const token = await user.generateAuthenticationToken();

        res.status(200).send({user, token});
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = route;