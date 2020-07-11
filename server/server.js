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
// const port = process.env.PORT||3000  ;

app.use(bodyParser.json());

app.post("/todos",authenticate,(req,res)=>{

    // console.log(req.body);
    let todo = new Todo({
        text:req.body.text,
        _creator:req.user._id
    });
    todo.save()
    .then((doc)=>{
        // console.log("--Successfully saved todo: \n",doc);
        // res.send("--Successfully saved todo: \n"+doc);
        
        res.header("x-auth",req.token).send(doc);
    },(err)=>{
        // console.log("--Err in saving todo: \n",err);  
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
    // Todo.findById(id)
    Todo.findOne({
        _id:id,
        _creator:req.user._id
    })
    .then((todo)=>{
        // let a=req.user._id;
        // let b=todo._creator;

        // console.log("req.user._id :"+req.user._id);
        // console.log("todo._creator: "+todo._creator);
        // console.log(a==b);
        if(!todo){
            return res.status(404).send({todo:[]}); 
        }        
        // else if(req.user._id!=todo._creator){
        //     return res.status(401).send("Authorization failed")
        // }
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
    // Todo.findByIdAndRemove(id)
    Todo.findOneAndRemove({
        _id:id,
        _creator:req.user._id
    })
    .then((delTodo)=>{
        if(!delTodo){
            return res.status(404).send();
        }
        // else if(req.user._id!==delTodo._creator){
        //     return res.status(401).send("Authorization failed")
        // }
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

    // Todo.findByIdAndUpdate(id,{$set:body},{new:true})
    Todo.findOneAndUpdate({
        _id:id,
        _creator:req.user._id
    },{$set:body},{new:true})
    .then((todo)=>{
        if(!todo) return res.status(404).send()
        // else if(req.user._id!==todo._creator){
        //     return res.status(401).send("Authorization failed")
        // }
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
            // req.headers["x-auth"]=token;
            // res.status(200).send(user)
            // res.status(200).send(token)
            res.header("x-auth",token).status(200).send(user)

        })
    })
    .catch((err)=>{
        // console.log(err);
        res.status(400).send();
    });



    // User.findOne({email:req.body.email})
    // .then((user)=>{
    //     if(!user)return res.status(404).send();
    //     bcrypt.compare(req.body.password,user.password,(err,result)=>{
    //         if(err || !result)return res.status(400).send();
    //         res.status(200).send(user)
    //     }) 
    // })
    // .catch((err)=>res.status(400).send());
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
