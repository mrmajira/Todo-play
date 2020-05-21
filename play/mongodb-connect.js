// const MongoClient = require("mongodb").MongoClient;
const {MongoClient,ObjectID} = require("mongodb");


MongoClient.connect("mongodb://localhost:27017/TodoApp",(err,client)=>{
    if(err){
        console.log("Unable to conect to mongodb server");
        return console.log(err);
    }
    console.log("Connected to mongodb server");
    const db=client.db("TodoApp");
    
    // db.collection("Todos").insertOne({
    //     text:"some stuff to do thehehe",
    //     completed:false
    // },(err,result)=>{
    //     if(err){
    //         console.log("--Unable to add Todo to db");
    //         return console.log(err);
    //     }

    //     console.log("Todo successfully added");
    //     console.log(JSON.stringify(result.ops,undefined,2));
        
    // });
    // db.collection("Users").insertOne({
        
    //     name:"person1",
    //     age:68,
    //     location:"lol wtf darab"
    // },(err,result)=>{
    //     if(err){
    //         return console.log("--Unable to add Todo",err);
    //     }
    //     console.log("Successfully added Todo");
    //     console.log(result.ops[0]._id.getTimestamp());
    // });

    client.close();
});
