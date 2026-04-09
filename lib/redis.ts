import { createClient } from "redis";

export const redis = createClient({ url: process.env.REDIS_URL || "redis://redis:6379" });

redis.on("error", (err) => {
  console.error("Redis client error", err);
});
