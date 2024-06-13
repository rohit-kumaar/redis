import express from "express";
import { Redis } from "ioredis";
import {
  getProductsDetailsPromise,
  getProductsPromise,
} from "./api/products.js";
import { getCachedData, rateLimit } from "./middleware/redis.js";
const server = express();
const port = 4000;

export const redis = new Redis({
  host: "redis-10116.c252.ap-southeast-1-1.ec2.redns.redis-cloud.com",
  port: 10116,
  password: "0ZAcK2kHX2LPOOAvmfzuS8CZBWx2MdW4",
});

redis.on("connect", () => {
  console.log("Redis Connected");
});

server.get("/", rateLimit(10, 60), async (req, res) => {
  // Current IP - request count
  res.status(200).send("Hello World");
});

server.get("/products", getCachedData("products"), async (req, res) => {
  const products = await getProductsPromise();
  await redis.setex("products", 20, JSON.stringify(products.products));

  res.status(200).json({
    products,
  });
});

server.get("/products/:id", async (req, res) => {
  const id = req.params.id;
  const key = `product:${id}`;

  let product = await redis.get(key);

  if (product) {
    return res.status(200).json({
      product: JSON.parse(product),
    });
  }

  product = await getProductsDetailsPromise(id);
  await redis.set(key, JSON.stringify(product));

  res.status(200).json({
    product,
  });
});

server.get("/order/:id", async (req, res) => {
  const productId = req.params.id;
  const key = `product: ${productId}`;

  await redis.del(key);

  return res.status(200).json({
    message: `Order placed successfully, product id:${productId} is ordered`,
  });
});

server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
