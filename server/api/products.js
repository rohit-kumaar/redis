export function getProductsPromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: "Product 1",
          price: 100,
        },
      ]);
    }, 2000);
  });
}

export function getProductsDetailsPromise(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([
        {
          id: id,
          name: `Product ${id}`,
          price: Math.floor(Math.random() * id * 100),
        },
      ]);
    }, 2000);
  });
}
