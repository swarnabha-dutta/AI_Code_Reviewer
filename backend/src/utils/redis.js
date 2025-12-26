const Redis = require("ioredis");

const redis = new Redis({
  host: "127.0.0.1",
  port: 6379,
  db: 0
});

redis.on("connect", () => console.log("🟢 Redis Connected"));
redis.on("error", err => console.log("🔴 Redis Error:", err));

module.exports = redis;
