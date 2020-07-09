const {SHA256}  =   require("crypto-js");

const jwt       =   require("jsonwebtoken");

// jwt.sign();
let data={
    id:4
};

let token = jwt.sign(data,"secret")
console.log(token);

let dec= jwt.verify(token,"secret");
console.log(dec.id);


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

