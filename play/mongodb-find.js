const {MongoClient,ObjectID} = require("mongodb");


MongoClient.connect("mongodb://localhost:27017/TodoApp",(err,client)=>{
    if(err){
        console.log("Unable to conect to mongodb server");
        return console.log(err);
    }
    console.log("Connected to mongodb server");
    const db=client.db("TodoApp");
// ===========================================
    // db.collection("Todos").find({
    //     _id:new ObjectID("5ec640f073739309550ea706")
    // }).toArray()
    // .then((docs)=>{
    //     console.log("--Todos found :");
    //     console.log(docs);
    //     // console.log(JSON.stringify(docs,undefined,2));
        
    // })
    // .catch((err)=>{
    //     console.log("--Unable to fetch todos",err);
    // });
    // ======================================
    // db.collection("Todos").find().count()
    // .then((count)=>{
    //     console.log(`--Todos count: ${count}`);
    //     // console.log(JSON.stringify(docs,undefined,2));
        
    // })
    // .catch((err)=>{
    //     console.log("--Unable to fetch todos",err);
    // });
    // ===================================
    // db.collection("Users").find({
    //     name:"person1"
    // }).count()
    // .then((count)=>{
    //     console.log(`--Users with name person1 count: ${count}`);
    //     // console.log(JSON.stringify(docs,undefined,2));
        
    // })
    // .catch((err)=>{
    //     console.log("--Unable to fetch Users",err);
    // });
    // ===================================
    db.collection("Users").find({
        name:"person1"
    }).toArray()
    .then((docs)=>{
        console.log(`--Users with name person1 : `);
        console.log(docs);
        // console.log(JSON.stringify(docs,undefined,2));
        
    })
    .catch((err)=>{
        console.log("--Unable to fetch Users",err);
    });



    client.close();
});
