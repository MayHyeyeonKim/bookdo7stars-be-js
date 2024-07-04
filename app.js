const express = require('express');

const app = express();
app.get('/', (req,res)=>{res.send("Hello Bookdo7stars")})

app.listen(4000,()=>{
    console.log("Server is running on port 4000");
});