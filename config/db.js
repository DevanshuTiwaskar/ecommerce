const mongoose = require("mongoose");

mongoose.connect(process.env.MONGOURI).then(()=>{
    console.log("connected to db");
});


module.exports = mongoose.connection;  
