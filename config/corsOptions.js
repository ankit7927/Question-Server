const allowedOrigins = require("./allowedOrigins");

const corsOptions ={
    origin:(origin, cb)=>{
        if (allowedOrigins.includes(origin) || !origin) {
            cb(null, true)
        }else{
            cb(new Error("not allowed by CORS"))
        }
    },
    credential:true,
    optionsSuccessStatus:200
}

module.exports = corsOptions;