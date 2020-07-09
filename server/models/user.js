const   mongoose    =   require("mongoose"),
        validator   =   require("validator"),
        jwt         =   require("jsonwebtoken"),
        _           =   require("lodash");
    let UserSchema = new mongoose.Schema({
        email:{
            type:String,
            required:true,
            minlength:1,
            trim:true,
            unique:true,
            validate:{
               validator:validator.isEmail,
               message:`{value} is not a valied Email address`
            }
        },
        password:{
            type:String,
            required:true,
             minlength:6
        },
        tokens:[{
            access:{
                type:String,
                required:true
            },
            token:{
                type:String,
                required:true
            }
        }]
        
    });

    UserSchema.methods.toJSON = function () {
        let user=this;
        let userObject=user.toObject();

        return _.pick(userObject,["_id","email"]);
    };

    UserSchema.methods.generateAuthToken=function(){
        var user=this;
        let access="auth";
        let token=jwt.sign({_id:user._id.toHexString(),access},"secret").toString();

        user.tokens=user.tokens.concat([{access,token}])
        return user.save()
        .then(()=>{
            return token;
        })
        
    }





let User = mongoose.model("User",UserSchema);

module.exports={User};