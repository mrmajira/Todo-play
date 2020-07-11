require("./config/config");


const   express     =   require("express"),
        bodyParser  =   require("body-parser"),
        _           =   require("lodash"),
        jwt         =   require("jsonwebtoken"),
        bcrypt      =   require("bcryptjs");

const   {mongoose}        =     require("./db/mongoose"),
        {ObjectId}        =     require("mongodb"),
        {User}            =     require("./models/user"),
        {Todo}            =     require("./models/todo"),
        {authenticate}    =     require("./middleware/authenticate");

const user = require("./models/user");





let app=express();
const port = process.env.PORT ;

app.use(bodyParser.json());

app.post("/todos",authenticate,(req,res)=>{

    let todo = new Todo({
        text:req.body.text,
        _creator:req.user._id
    });
    todo.save()
    .then((doc)=>{        
        res.header("x-auth",req.token).send(doc);
    },(err)=>{
        res.status(400).send(err);  
    });
});


app.get("/todos",authenticate,(req,res)=>{    
    Todo.find({
        _creator:req.user._id
    })
    .then((todos)=>{
        res.send({todos});
    },(err)=>{
        res.status(400).send(err)
    });
});



app.get("/todos/:id",authenticate,(req,res)=>{
    let id = req.params.id;
    let validId = ObjectId.isValid(id);
    if(!validId){
        return res.status(404).send("todo id not valid");
    }
    Todo.findOne({
        _id:id,
        _creator:req.user._id
    })
    .then((todo)=>{
        if(!todo){
            return res.status(404).send({todo:[]}); 
        }        
        res.status(200).send({todo});
    })
    .catch((err)=>{
        
        console.log("--Err in finding todo by id: \n",err);
        res.status(400).send("--Err in finding todo by id: \n"+err);
    });

});

app.delete("/todos/:id",authenticate,(req,res)=>{
    let id=req.params.id;
    let validId=ObjectId.isValid(id);
    if(!validId){
        return res.status(404).send();
    }
    Todo.findOneAndRemove({
        _id:id,
        _creator:req.user._id
    })
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

app.patch("/todos/:id",authenticate,(req,res)=>{
    let id=req.params.id;
    let body=_.pick(req.body,["text","completed"])    
    let validId=ObjectId.isValid(id);
    if(!validId){
        return res.status(404).send();
    }    
    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }else{        
        body.completed=false;       
        body.completedAt=null;
    }

    Todo.findOneAndUpdate({
        _id:id,
        _creator:req.user._id
    },{$set:body},{new:true})
    .then((todo)=>{
        if(!todo) return res.status(404).send()
        res.status(200).send({todo});
    })
    .catch((err)=>{
        res.status(400).send();
    });
});

// --------
// Users
app.post("/users",(req,res)=>{
    body=_.pick(req.body,["email","password"]);
    let user=new User(body);

    user.save()
    .then(()=>{
        return user.generateAuthToken();
    })
    .then((token)=>{
        res.header("x-auth",token).send({user})
        
    })
    .catch((err)=>{
        res.status(400).send()
    });

});




app.get("/users/me",authenticate,(req,res)=>{
    res.status(200).send(req.user);
});

app.post("/users/login",(req,res)=>{
    body=_.pick(req.body,["email","password"]);

    User.findByCredentials(body.email,body.password)
    .then((user)=>{
        return user.generateAuthToken()
        .then((token)=>{
            res.header("x-auth",token).status(200).send(user)

        })
    })
    .catch((err)=>{
        res.status(400).send();
    });
});

app.delete("/users/me/token",authenticate,(req,res)=>{
    req.user.removeToken(req.token)
    .then(()=>{
        res.status(200).send();
    })
    .catch((err)=>{
        res.status(400).send();
    });
}); 


app.listen(port,()=>{
    console.log(`Server listening on port: ${port}`);
});


module.exports={app};
