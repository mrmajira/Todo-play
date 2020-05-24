const {MongoClient,ObjectID} = require("mongodb");


MongoClient.connect("mongodb://localhost:27017/TodoApp",(err,client)=>{
    if(err){
        console.log("Unable to conect to mongodb server");
        return console.log(err);
    }
    console.log("Connected to mongodb server");
    // ===============================================
    // const db=client.db("TodoApp");

    // db.collection("Todos").findOneAndUpdate({
    //     _id:new ObjectID("5ec6642c42245eb7d05def09")
    // },{
    //   $set:{completed:true}  
    // },{
    //     returnOriginal:false
    // })
    // .then((res)=>{
    //     console.log("--Update done , new result:",res);
        
    // })
    // .catch((err)=>{
    //     console.log("-Err in updating : ",err);
        
    // });    
// =========================================
    const db=client.db("TodoApp");
    db.collection("Users").findOneAndUpdate({
        _id:new ObjectID("5ec642c6e0ea2bc91410a97b")
    },{
        $set:{
            name:"mr lol person"
        },
        $inc:{
            age:-1
        }
    },{
        returnOriginal:false
    })
    .then((res)=>{
        console.log("--Update done, new value: ");
        console.log(res);
    })
    .catch((err)=>{
        console.log("--Err in updating :",err);
    });

    client.close();
});
