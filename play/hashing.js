const {SHA256}  =   require("crypto-js");

const jwt       =   require("jsonwebtoken");
const bcrypt    =   require("bcryptjs");

// let pw = "123456";

// bcrypt.genSalt(10,(err,salt)=>{
//     bcrypt.hash(pw,salt,(err,hash)=>{
//         console.log(hash);
        
//     });
// });

// let hashPassword= "$2a$10$OLLwDSjAAN9t1JodKHaPv.w3DCNLclwk8vb8znf4Ih5Fj5LL8vjR2"
// let hash2= "$2a$10$nB6.aIONln6D4QDXxIlOTOzq3cex7NsL2AdtheKrHgvXQi5sYXOom"

// bcrypt.compare(pw,hashPassword,(err,res)=>{
//     console.log(res);  
// })
// bcrypt.compare(hash2,hashPassword,(err,res)=>{
//     console.log(res);  
// })
// bcrypt.compare(pw,hash2,(err,res)=>{
//     console.log(res);  
// })

// bs={arr:[{a:2}]};
// a=1;
// bs=bs.arr.concat([{a}]);
// // bs.arr.push({a});
// console.log(bs);

// // jwt.sign();
let data={
    id:4
};

let token = jwt.sign(data,"secret")
console.log(token);

// let dec= jwt.verify(token,"secret");
// console.log(dec.id);


// let m = "i am user number 3";
// // let hash = SHA256(m);
// let hash2 = SHA256(m).toString();
// // console.log(hash);
// console.log(hash2);

// let data={
//     id:4
// }

// let token={
//     data,
//     hash:SHA256(JSON.stringify(data)+"somesecret").toString()
// }


// token.data.id =5;
// token.hash =SHA256(JSON.stringify(token.data)).toString();


// let resultHash=SHA256(JSON.stringify(token.data)+"somesecret").toString();

// if(resultHash===token.hash){
//     console.log("Data was not changed");
// }else{
//     console.log("Data was changed, dont trust");
    
// }


// // =====================================================
// // AES
// // const {AES}  =   require("crypto-js");
// // const crypto  =   require("crypto-js");
// // let c =AES.encrypt(m,"key").toString();
// // console.log(c);

// // let dec = AES.decrypt(c,"key").toString(crypto.enc.Utf8);
// // console.log("dec is "+ dec);

