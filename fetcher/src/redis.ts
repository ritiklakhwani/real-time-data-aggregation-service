import { createClient } from "redis";

export const redis = await createClient()
  .on("error", (err) => {
    console.log("Redis Client Error", err)
    process.exit()
})
  .connect();
console.log("connected to redis")

