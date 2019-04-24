const { MongoClient } = require('mongodb');
const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-app';

MongoClient.connect(connectionURL,{useNewUrlParser : true}, (error, client)=>{
    if(error) {
        return console.log("Unable to connect to database!");
    }
    const db = client.db(databaseName);

    // db.collection('users').insertOne({
    //     name : 'Night Lee',
    //     age : 21
    // });

    // db.collection('tasks').insertMany([
    //     {
    //         description : "Clean House",
    //         completed : true
    //     }, 
    //     {
    //         description : "Doing Homework",
    //         completed : false
    //     }
    // ], (error, result )=>{
    //     if(error) {
    //         return console.log("Unable insert data");
    //     }
    //     console.log(result.ops);
        
    // });


    // db.collection('tasks').updateMany(
    //     {
    //         completed : false
    //     },
    //     {
    //         $set : {
    //             completed : true
    //         }
    //     }
    // ).then(result => {
    //     console.log(result.modifiedCount);
    // }).catch(error => {
    //    console.log(error);
    // })

});
