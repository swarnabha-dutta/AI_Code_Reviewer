require("dotenv").config();
const redis = require("./src/utils/redis.js");


(
    async () =>{
        try{
            await redis.set("test:key", "Hello Redis!", { ex: 30 });
            const value = await redis.get("test:key");
            console.log("Stored from Redis:", value);
            console.log("✅ Redis Connected Successfully!");
        }catch(e){
            console.error("Redis Error:", e);
        }

    }
)();

