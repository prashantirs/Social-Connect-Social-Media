const mongoose = require('mongoose');

exports.connectDatabse=()=>{
    
    mongoose.connect(process.env.MONGO_URI)
    .then((con)=>console.log(`Database Connected: ${con.connection.host}`))
    .catch((err)=>console.log(err));
}
