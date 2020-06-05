const mongoose = require("mongoose");

mongoose.Promise=global.Promise;
const mLabURI="mongodb+srv://mrmr:24843924@cluster0-smfdh.mongodb.net/NODE_JS_ANDREW"
+"?retryWrites=true&w=majority";

// 
// mongodb+srv://<username>:<password>@cluster0-smfdh.mongodb.net/<dbname>?retryWrites=true&w=majority
// 



mongoose.connect(mLabURI ||"mongodb://localhost:27017/TodoApp",{
    useNewUrlParser:true,
    useUnifiedTopology:true
});


module.exports={mongoose};
