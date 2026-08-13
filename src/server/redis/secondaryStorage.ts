import redis from "./redis";

export const secondaryStorage = {
  get: async (key: string) => {
    const value = await redis.get(key);

    console.log("[Redis GET]", key, value);

    return value;
  },

  set: async (key: string, value: string, ttl?: number) => {
    console.log("[Redis SET]", {
      key,
      ttl,
    });

    if (ttl && ttl > 0) {
      await redis.set(key, value, "EX", ttl);
    } else {
      await redis.set(key, value);
    }
  },

  delete: async (key: string) => {
    console.log("[Redis DELETE]", key);

    await redis.del(key);
  },
};
