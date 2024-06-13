import { redis } from "../index.js";

export const getCachedData = (key) => async (req, res, next) => {
  const data = await redis.get(key);

  if (data) {
    return res.status(200).json({
      products: JSON.parse(data),
    });
  }
};

export const rateLimit = (limit, timer) => async (req, res, next) => {
  const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const key = `request_count : ${clientIp}`;

  const requestCount = await redis.incr(key);
  const remainingTime = await redis.ttl(key);

  // await redis.del(key);

  if (requestCount === 1) {
    await redis.expire(key, timer);
  }

  if (requestCount > limit) {
    return res
      .status(429)
      .send(
        `Too many requests, please try again after ${remainingTime} seconds`
      );
  }

  next();
};
