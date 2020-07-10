const expect    = require("expect"),
      request   = require("supertest"),
      {ObjectId}= require("mongodb");
    //   jwt       = require("jsonwebtoken");

const {app}                 = require("./../server"),      
      {Todo}                = require("./../models/todo"),      
      {todos,populateTodos} = require("./seed/seed"),
      {users,populateUsers} = require("./seed/seed");  

const user = require("../models/user");
const { User } = require("../models/user");

// --- Seed


beforeEach(populateTodos);
beforeEach(populateUsers);



describe("POST /todos",()=>{
    it("should create a new todo",(done)=>{
        let text="Test todo text";
        request(app)
        .post("/todos")
        .send({text})
        .expect(200)
        .expect((res)=>{
            expect(res.body.text).toBe(text);
        })
        .end((err,res)=>{
            if(err){
                return done(err)
            }

            Todo.find({text})
            .then((todos)=>{
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            })
            .catch(err => done(err));
        });    
    });

    it("should not create todo with invalid body data",(done)=>{
        request(app)
        .post("/todos")
        .send({})
        .expect(400)
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            Todo.find()
            .then((todos)=>{
                expect(todos.length).toBe(2);
                done();
            })
            .catch(err=>done(err))
        });
    });
});

describe("GET /todos",()=>{
    it("should get all todos",(done)=>{
        request(app)
        .get("/todos")
        .expect(200)
        .expect((res)=>{
            expect(res.body.todos.length).toBe(2);
        })
        .end(done);
    });
});

describe("GET /todos/:id",()=>{
    it("should get a todo by a valid id",(done)=>{
            request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    
    it("shouldn get a todo if no todo in db matched with id",(done )=>{
        request(app)
        .get(`/todos/${new ObjectId().toHexString()}`)
        .expect(404)
        .expect((res)=>{
            expect(res.body.todo.length).toBe(0);
        })
        .end(done);
    });

    it("shouldnt search for todo if id not valid",(done)=>{
        request(app)
        .get("/todos/lol")
        .expect(404)
        .end(done);
    });
});

   

describe("DELETE /todos/:id",()=>{

    it("should remove a todo",(done)=>{
        request(app)
        .delete(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.delTodo._id).toBe(todos[0]._id.toHexString());
        })
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            hashId=todos[0]._id.toHexString();
            Todo.findById(hashId)
            .then((foundTodo)=>{
                expect(foundTodo).toBeNull();
                done();
            })
            .catch((err)=>done(err));
        });

    });

    it("should return 404 if todo not found",(done)=>{
        request(app)
        .delete(`/todos/${new ObjectId().toHexString()}`)
        .expect(404)
        .end(done);
    });

    it("should return 404 if id not valid",(done)=>{
        request(app)
        .delete(`/todos/lol this is not valid id`)
        .expect(404)
        .end(done);
    });
});



describe("PATCH /todos/:id",()=>{

    it("should update todo text & completed->true",(done)=>{
        hashId=todos[0]._id.toHexString();4
        todo={
            text:"updated - test",
            completed:true
        }

        request(app)
        .patch(`/todos/${hashId}`)
        .send(todo)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.completed).toBe(true);
            expect(typeof res.body.todo.completedAt).toBe("number");
            expect(res.body.todo.text).toBe("updated - test");
        })
        .end(done);
    //     .end((err,res)=>{
    //         if(err){
    //             return done(err);
    //         }
    //         Todo.findById(hashId)
    //         .then((foundTodo)=>{
    //             expect(foundTodo.completed).toBe(true);
    //             expect(foundTodo.completedAt).toBeA(Number);
    //             expect(foundTodo.text).toBe("updated - test");
    //             done();
    //         })
    //         .catch(()=>done(err));
    //     });

    });

    it("should clear completedAt when todo is not completed",(done)=>{
        hashId=todos[1]._id.toHexString();
        todo={
            completed:false,
            completedAt:"yesterday lol"
        }

        request(app)
        .patch(`/todos/${hashId}`)
        .send(todo)
        .expect(200)
        .end((err,res)=>{
            if(err)return done(err);
            Todo.findById(hashId)
            .then((foundTodo)=>{
                expect(foundTodo.completed).toBeFalsy();
                expect(foundTodo.completedAt).toBeNull();
                done();
            })
            .catch((err)=>{
                done(err)
            });
        });

    });


});

describe("GET /users/me",()=>{

    it("should return user if authenticated",(done)=>{
        
        request(app)
        .get("/users/me")
        .set("x-auth",users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{            
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
        })
        .end(done)
    });

    it("should return 401 if not authenticated",(done)=>{

        request(app)
        .get("/users/me")
        .expect(401)
        .expect((res)=>{
            expect(res.body).toEqual({});
        })
        .end(done)
    });

});


describe("POST /users" ,()=>{

    it("should create a user",(done)=>{        
        request(app)
        .post("/users")
        .send(users[2])
        .expect(200)
        .expect((res)=>{                        
            expect(res.headers["x-auth"]).toBeTruthy() ;
            expect(res.body.user._id).toBeTruthy() ;
            expect(res.body.user.email).toBe(users[2].email) ;
        })
        // .end(done);
        .end((err,res)=>{
            if(err)return done(err);

            User.findOne({email:users[2].email})
            .then((user)=>{
                expect(user).toBeTruthy();
                expect(user.password).not.toBe(users[2].password);
                done();
            })
            .catch((err)=>done(err));
        });

    });

    it("should return validation error if request invalid",(done)=>{
        let user={email:"lol",password:69}
        request(app)
        .post("/users")
        .send(user)
        .expect(400)
        .expect((res)=>{
            
            expect(res.body).toEqual({});
        })
        .end(done);
    });

    it("not create user if email in use",(done)=>{
        
        request(app)
        .post("/users")
        // .send({email:users[0].email,password:"123456"})
        .send(users[0])
        .expect(400)
        .expect((res)=>{
            expect(res.body.user).toBeUndefined();
        })
        .end(done)
    });

});


describe("POST /users/login" ,()=>{

    it("should login user and return auth token",(done)=>{

        request(app)
        .post("/users/login")
        .send({
            email:users[0].email,
            password:users[0].password
        })
        .expect(200)
        .expect((res)=>{
            expect(res.body._id).toBe(users[0]._id.toHexString())
            expect(res.headers["x-auth"]).toBeTruthy();
        })
        .end((err,res)=>{
            if (err) return done(err);

            User.findById(res.body._id)
            .then((user)=>{
                // console.log(user.tokens);
                expect(user.tokens[1].token).toBe(res.headers["x-auth"]);
                // expect(user.tokens[0]).toMatchObject({
                //     access:"auth",
                //     token:res.headers["x-auth"]
                // })
                // dec=jwt.verify(res.headers["x-auth"],"secret");
                // // console.log(dec._id);
                // // console.log("user : "+user._id);
                // // expect(dec._id).toBe(user._id);
                // expect(dec._id).toBe(users[0]._id.toHexString());
                done();
            })
            .catch((err)=>done(err));
        });
    });

    it("should reject invalid login",(done)=>{

        request(app)
        .post("/users/login")
        .send({
            email:users[0].email,
            password:"wrong pw"
        })
        .expect(400)
        .expect((res)=>{
            expect(res.body).toEqual({});
            expect(res.headers["x-auth"]).toBeUndefined();
        })
        .end(done);
    });

});




