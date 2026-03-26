import connectDB from "./db/index.js";
import "dotenv/config"
import app from "./app.js";

/* 
 |
 |this is a old method when the dot env does not support the through the module method
 |
*/
// import dotenv from 'dotenv';
// dotenv.config({
//     path: './env'
// });

connectDB()
.then(() =>{
    app.listen(process.env.PORT || 8000, () =>{
        console.log(`Server is running into PORT : ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log("MongoDB connection failed !!!" , err)
})

