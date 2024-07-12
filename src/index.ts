import { Hono } from "hono";
import { prisma } from "./libs/prisma";

const app = new Hono();

app.get("/", (c) => {
  return c.json({
    message: " Welcome to REST API of Spices and Essential Oil",
    products: "/products",
  });
});

app.get("/products", async (c) => {
  try {
    const products = await prisma.product.findMany();
    return c.json(products);
  } catch (error) {
    return c.json({ error: " Error Fetching products" }, 500);
  }
});

app.get("/products/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (!id) {
    return c.json({
      message: " There is no id product",
    });
  }
  try {
    const product = await prisma.product.findUnique({
      where: { id: id },
    });
    if (!product) {
      c.status(404);
      return c.json({
        message: "Product not found",
      });
    }
    return c.json(product);
  } catch (error) {
    console.log("Error fetching product", error);
    return c.json({ error: "Error fetching Product" }, 500);
  }
});

app.post("/products", async (c) => {
  const body = await c.req.json();
  console.log("Receive body:", body);
  try {
    const newProduct = await prisma.product.create({
      data: {
        name: String(body.name),
        price: Number(body.price),
        quantity: Number(body.quantity),
        image: String(body.image),
        category: String(body.category),
        olfactoryProfile: String(body.olfactoryProfile),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return c.json(newProduct);
  } catch (error) {
    return c.json(
      {
        error: "Error creating product",
      },
      500
    );
  }
});

app.put("/products/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (!id) {
    return c.json({
      message: "There is no id Product",
    });
  }
  const body = await c.req.json();
  try {
    const newProduct = await prisma.product.update({
      where: { id },
      data: {
        name: body.name ? String(body.name) : undefined,
        price: body.price ? Number(body.price) : undefined,
        quantity: body.quantity ? Number(body.quantity) : undefined,
        image: body.image ? String(body.image) : undefined,
        category: body.category ? String(body.category) : undefined,
        olfactoryProfile: body.olfactoryProfile ? String(body.olfactoryProfile) : undefined,
      },
    });
    return c.json(newProduct);
  } catch (error) {
    return c.json({ error: "Error for updating product" }, 500);
  }
});
app.delete("/products", async (c) => {
  try {
    await prisma.product.deleteMany();

    return c.json({
      message: ` All Products have been deleted`,
    });
  } catch (error) {
    return c.json({ error: "Error deleting all products" });
  }
});

app.delete("/products/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (!id) {
    return c.json({
      message: " There is no id Product",
    });
  }
  try {
    const deleteProduct = await prisma.product.delete({
      where: { id },
    });
    return c.json({
      message: `Product with ${id} has been deleted`,
      deleteProduct,
    });
  } catch (error) {
    return c.json({ error: "Error deleting product" });
  }
});

console.log("API Spice Oil is Running");

export default app;
