const   express     =   require("express"),
        bodyParser  =   require("body-parser"),
        _           =   require("lodash");

const   {mongoose}=     require("./db/mongoose"),
        {ObjectId}=     require("mongodb"),
        {User}    =     require("./models/user"),
        {Todo}    =     require("./models/todo");


let app=express();
const port = process.env.PORT||3000  ;

app.use(bodyParser.json());

app.post("/todos",(req,res)=>{

    // console.log(req.body);
    let todo = new Todo({
        text:req.body.text
    });
    todo.save()
    .then((doc)=>{
        // console.log("--Successfully saved todo: \n",doc);
        // res.send("--Successfully saved todo: \n"+doc);
        res.send(doc);
    },(err)=>{
        // console.log("--Err in saving todo: \n",err);  
        res.status(400).send(err);  
    });
});


app.get("/todos",(req,res)=>{
    Todo.find()
    .then((todos)=>{
        // console.log(docs);
        // res.send(docs);
        
        // console.log("--Successfully found todos: \n",docs);
        res.send({todos});
    },(err)=>{
        // console.log("--Err in finding todos: \n",err);  
        res.status(400).send(err)
    });
});



app.get("/todos/:id",(req,res)=>{
    // console.log(req.params);
    // res.send(req.params);
    // ===================
    let id = req.params.id;
    let validId = ObjectId.isValid(id);
    if(!validId){
        // console.log("todo id not valid");
        return res.status(404).send("todo id not valid");
    }
    Todo.findById(id)
    .then((todo)=>{
        if(!todo){
            // console.log("todo not found ");
            return res.status(404).send({todo:[]}); 
            // return res.status(404).send();
        }
        // console.log("todo found by id: \n",todo);
        res.status(200).send({todo});
    })
    .catch((err)=>{
        
        console.log("--Err in finding todo by id: \n",err);
        res.status(400).send("--Err in finding todo by id: \n"+err);
    });

});

app.delete("/todos/:id",(req,res)=>{
    let id=req.params.id;
    let validId=ObjectId.isValid(id);
    if(!validId){
        return res.status(404).send();
    }
    Todo.findByIdAndRemove(id)
    .then((delTodo)=>{
        if(!delTodo){
            return res.status(404).send();
        }
        res.status(200).send({delTodo});
    })
    .catch((err)=>{
        res.status(400).send();
    });
});

app.patch("/todos/:id",(req,res)=>{
    let id=req.params.id;
    let body=_.pick(req.body,["text","completed"])
    
    // console.log("1. body: "+JSON.stringify(body,undefined,2));
    
    let validId=ObjectId.isValid(id);
    if(!validId){
        return res.status(404).send();
    }
    // console.log("_.isBoolean(body.completed) is :"+_.isBoolean(body.completed));
    // console.log("body.completed is :"+body.completed);
    
    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }else{
        // console.log("im false");
        
        body.completed=false;       
        body.completedAt=null;
    }

    Todo.findByIdAndUpdate(id,{$set:body},{new:true})
    .then((todo)=>{
        if(!todo) return res.status(404).send()
        // console.log("todo is \n",todo);
        // console.log("body is \n",body);
        
        res.status(200).send({todo});
    })
    .catch((err)=>{
        res.status(400).send();
    });
});



app.listen(port,()=>{
    console.log(`Server listening on port: ${port}`);
});


module.exports={app};
