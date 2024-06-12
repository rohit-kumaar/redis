import express from "express";
const server = express();
const port = 4000;

server.get("/", (req, res) => {
  res.status(200).send("Working");
});

server.get("/products", async (req, res) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        products: [
          {
            id: 1,
            name: "Product 1",
            price: 100,
          },
        ],
      });
    }, 2000);
  });
});

server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
